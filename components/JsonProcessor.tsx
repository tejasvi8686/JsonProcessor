"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Upload, CheckCircle, AlertCircle, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function JsonProcessor() {
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
        setJsonInput(JSON.stringify(JSON.parse(text as string), null, 2)); 
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
    <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="space-y-4">
        {/* Collection Name Input */}
        <div className="space-y-2">
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
            placeholder="Enter collection name (e.g., users, products)"
            className="font-mono"
          />
        </div>

        {/* JSON Input */}
        <div className="space-y-2">
          <label
            htmlFor="json-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Enter JSON Data
          </label>
          <Textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON data here..."
            className="min-h-[200px] font-mono"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
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
          />
        </div>

        {/* JSON Preview */}
        {jsonInput && (
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto">
            <pre className="text-sm text-gray-800 dark:text-gray-200">
              {jsonInput}
            </pre>
          </div>
        )}

        {/* Process Button */}
        <div className="flex justify-end">
          <Button
            onClick={processJson}
            disabled={!jsonInput || !collectionName || isProcessing}
            className="flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin">
                  <LoaderCircle className="h-4 w-4 text-gray-500 animate-spin " />
                </span>
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
  );
}
