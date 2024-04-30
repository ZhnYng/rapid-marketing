import React from "react";
import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="text-gray-900 flex items-center justify-center">
      <div className="max-w-7xl">
        <Navbar />
        {/* Hero Section */}
        <div className="flex p-10 mt-20">
          <div className="">
            <h1 className="text-6xl font-bold mb-6">
              Find your next successful campaign{" "}
              <span className="text-purple-500">faster.</span>
            </h1>
            <p className="text-lg">
              Crafting compelling ads in seconds! Engage your audience with our
              expertly crafted messages. Test them swiftly across platforms for
              maximum impact. Let your brand shine in a crowded marketplace!
            </p>
            <div className="my-4">
              <Link href="/main">
                <Button text="Get started" />
              </Link>
            </div>
          </div>
          <div className="ml-10">
            <Image
              src={'/heroImage.png'}
              alt="Example poster"
              width={600}
              height={600}
              className="rounded-md shadow-2xl transition ease-in-out 
                  hover:-translate-y-1 hover:scale-110 duration-300"
            />
          </div>
        </div>

        {/* Image Gallery Section */}
        <section className="p-10 xl:m-12">
          <div className="max-w-xl">
            <h2 className="text-md font-medium mb-4 text-purple-500">
              Past projects
            </h2>
            <h1 className="text-4xl font-bold mb-4 text-black">
              Beautifully crafted advertising materials, curated for your next
              campaign.
            </h1>
            <p className="text-black text-lg">
              Explore the possibility of diverse advertising, meticulously crafted
              for engagement. Elevate your campaigns with expertly designed
              material that seamlessly integrate into your campaigns, offering
              endless customization possibilities to suit your advertising needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto lg:grid-cols-3 gap-8 my-12">
            {['example1', 'example2', 'example3'].map((path, index) => (
              <Image
                key={index}
                src={`/${path}.png`}
                alt="Example poster"
                width={370}
                height={370}
                className="rounded-md shadow-2xl transition ease-in-out 
                    hover:-translate-y-1 hover:scale-110 duration-300"
              />
            ))}
          </div>
        </section>

        {/* Enhanced Footer */}
        <hr className="border-gray-300 mx-12"></hr>
        <footer className="text-black p-16 text-center">
          <p className="text-lg font-bold mb-2">
            Elevate Your Brand with Rapid Marketing
          </p>
          <p className="text-sm">
            Explore innovative strategies for your success
          </p>
          <div className="mt-4 flex justify-center items-center">
            <span className="mx-2 text-sm">
              {" "}
              &copy; 2024 Rapid Marketing. All rights reserved.{" "}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;