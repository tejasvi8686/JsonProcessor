"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Upload, LoaderCircle } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Parse = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file upload for JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      try {
        const parsedJson = JSON.parse(text as string);
        // Assuming each object in the JSON array needs an 'id' property
        const jsonWithIds = parsedJson.map((item, index) => ({
          ...item,
          id: index + 1, // Assigning a unique id to each object
        }));
        setJsonInput(JSON.stringify(jsonWithIds, null, 2));
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  // Process JSON and upload to Firestore
  const processJson = async () => {
    if (!collectionName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    // Validate collection name
    if (!/^[a-zA-Z0-9_-]+$/.test(collectionName)) {
      toast.error(
        "Collection name must be alphanumeric and cannot contain spaces or special characters."
      );
      return;
    }

    try {
      setIsProcessing(true);

      // Validate JSON input
      let data;
      try {
        data = JSON.parse(jsonInput);
      } catch (err) {
        throw new Error("Invalid JSON format. Please check your input.");
      }

      // Add document to Firestore
      const docRef = await addDoc(collection(db, collectionName), {
        data,
        timestamp: new Date().toISOString(),
      });

      toast.success("Data successfully stored in Firebase!", {
        description: `Document ID: ${docRef.id}`,
      });

      setJsonInput("");
    } catch (error) {
      toast.error("Error processing JSON", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="min-h-screen  dark:from-gray-900 dark:to-gray-800 py-16 px-6 sm:px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            JSON Data Processor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your JSON data and easily store it in Firebase
          </p>
        </div>

        <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
          <div className="space-y-6">
            {/* Collection Name Input */}
            <div>
              <label
                htmlFor="collection-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Collection Name
              </label>
              <Input
                id="collection-name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="e.g., users, products"
                className="mt-2"
              />
            </div>

            {/* JSON Input */}
            <div>
              <label
                htmlFor="json-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                JSON Data Input
              </label>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON data here"
                className="mt-2 min-h-[200px] font-mono"
              />
            </div>

            {/* File Upload */}
            <div>
              <label
                htmlFor="json-file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Upload JSON File
              </label>
              <Input
                id="json-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>

            {/* JSON Preview */}
            {jsonInput && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200">
                  {jsonInput}
                </pre>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={processJson}
                disabled={!jsonInput || !collectionName || isProcessing}
                className="flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <LoaderCircle className="h-4 w-4 text-gray-500 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Process JSON</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Parse;
