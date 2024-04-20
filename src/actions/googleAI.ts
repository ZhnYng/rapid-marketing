"use server";

import { Campaign } from "@/lib/definitions";
import { firestore, storage } from "@/lib/firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileTypeFromBuffer } from "file-type";
import { getBytes, ref, uploadBytes } from "firebase/storage";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { dataURLtoFile } from "@/utils/images";
import { doc, updateDoc } from "firebase/firestore";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_KEY,
  apiKey: "",
  dangerouslyAllowBrowser: true,
});

export async function downloadImage(imagePath: string) {
  console.log(`Image path: ${imagePath}`);

  try {
    // const folder = '/tmp/'
    const fileDestination = `/tmp/${imagePath}`;
    const folder = path.dirname(fileDestination);

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    // Downloads the file
    const pathReference = ref(storage, imagePath);
    const arrayBuffer = await getBytes(pathReference);
    fs.appendFileSync(fileDestination, Buffer.from(arrayBuffer));
    const fileType = await fileTypeFromBuffer(arrayBuffer);

    return {
      fileDestination: fileDestination,
      mimeType: fileType?.mime || "image/jpeg",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

export async function generateImagePrompt(formData: Campaign) {
  console.info("function called");
  const { fileDestination, mimeType } = await downloadImage(
    formData.exampleImage
  );
  console.info(`File type: ${mimeType}`);
  console.info(
    `Image downloaded to ${fileDestination} as ${mimeType.toString()}`
  );

  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const cleanFormData = {
    brandName: formData.brandName,
    brandType: formData.brandType,
    size: formData.size,
    projectDescription: formData.projectDescription,
    targetAudience: formData.targetAudience,
    headline: formData.headline,
    punchline: formData.punchline,
    exampleImage: formData.exampleImage,
  }
  
  const prompt = `ONLY use information from this javascript object ${cleanFormData} with the design inspired by the provided image to design a post for this company. Describe in detail how you envision the poster to look like. Specify exactly the text that should be written.`;

  const imageParts = [
    fileToGenerativePart(fileDestination, mimeType.toString()),
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    console.info(`Model result: ${result}`);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function generateImage(formData: Campaign, docId:string) {
  try {
    const prompt = await generateImagePrompt(formData);
    console.log(prompt);

    const image = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      size: "1024x1024",
      n: 1,
      response_format: "b64_json",
    });
    console.log(image.data);

    const dataURL = `data:image/png;base64,${image.data[0].b64_json}`;
    const file = dataURLtoFile(dataURL, "generatedImage.png");
    console.log(file);

    const uploadFilePath = ref(
      storage,
      "generated-images/" + Date.now().toString() + "-" + file.name
    );
    const snapshot = await uploadBytes(uploadFilePath, file);
    const path = snapshot.metadata.fullPath;

    await updateDoc(doc(firestore, "campaigns", docId), {...formData, generatedImage: path});
  } catch (error) {
    console.error("Error creating image:", error);
  }
}
