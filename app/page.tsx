import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <section className=" bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Seamlessly Format JSON Data.
            <strong className="font-extrabold text-red-700 sm:block">
              Streamline Your Workflow.{" "}
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Upload, preview, and process your JSON files effortlessly. Simplify
            data handling and integrate it into Firebase in no time.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
              href="Parse"
            >
              Get Started
            </Link>

            <Link
              className="block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
              href="https://tejasviraj.vercel.app/"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
