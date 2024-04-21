"use server";

import { Campaign } from "@/lib/definitions";
import { firestore, storage } from "@/lib/firebase";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { fileTypeFromBuffer } from "file-type";
import { getBytes, ref, uploadBytes } from "firebase/storage";
import OpenAI, { APIError, AuthenticationError } from "openai";
import fs from "fs";
import path from "path";
import { dataURLtoFile } from "@/utils/images";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function downloadImage(imagePath: string) {
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
  try {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function generateImagePrompt(formData: Campaign) {
  const { fileDestination, mimeType } = await downloadImage(
    formData.exampleImage
  );

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision", safetySettings: safetySettings });

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
  
  const prompt = `
    ONLY use information provided.
    The following information is about a company and the product it is offering.
    ${JSON.stringify(cleanFormData)} 
    Using this information, design a post for this product.
    Describe in detail how you envision the poster to look like. 
    Keep the design minimalistic with little to no words.
    Specify exactly the text that should be written, with reference to the provided information.
    Be detailed about the layout of the poster such as colors for example.
    Design only the layout of the poster with inspiration from the provided example image.
    The content of the example image does not necessarily relate to the company's product.
  `;

  const imageParts = [
    fileToGenerativePart(fileDestination, mimeType.toString()),
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;

    if (response.promptFeedback?.blockReason) {
      throw {blockReasonMessage: response.promptFeedback.blockReasonMessage}
    }

    const text = response.text();
    return text;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function generateImage(formData: Campaign, docId:string, email:string) {
  try {
    const account = await getDocs(query(collection(firestore, "accounts"), where("email", "==", email)));

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY || account.docs[0].data().openaiAPIKey
    });

    const prompt = await generateImagePrompt(formData);

    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      n: 1,
      response_format: "b64_json",
    });

    const dataURL = `data:image/png;base64,${image.data[0].b64_json}`;
    const file = dataURLtoFile(dataURL, "generatedImage.png");

    const uploadFilePath = ref(
      storage,
      "images/" + Date.now().toString() + "-" + file.name
    );
    const snapshot = await uploadBytes(uploadFilePath, file);
    const path = snapshot.metadata.fullPath;

    await updateDoc(doc(firestore, "campaigns", docId), {...formData, generatedImage: path});
  } catch (error) {
    if(error instanceof AuthenticationError) {
      return {error: "Invalid OpenAI API key"}
    }
    throw error;
  }
}