"use client";

import { useState, ChangeEvent } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiResult, setApiResult] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const callApi = async (endpoint: string, extraData = {}) => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setApiResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("API call failed:", error);
      setApiResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🎵 Audio Processing Tool
        </h1>

      
        <div className="mb-6">
          <label
            htmlFor="fileUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload your audio file:
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="audio/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

       
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => callApi("stemify", { stem_types: ["vocals", "drums"], model: "htdemucs_6s" })}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none"
          >
            Destemify
          </button>
          <button
            onClick={() => callApi("classify")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none"
          >
            Analyze Audio
          </button>
          <button
            onClick={() => callApi("fx", { wet_level: 0.2, dry_level: 0.8, room_size: 0.1 })}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none"
          >
            Add Reverb
          </button>
          <button
            onClick={() => callApi("loopify", { n_loops: 4, beats_per_loop: 8 })}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none"
          >
            Extract Loop
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">API Result:</h3>
          <div className="mt-2 bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
            {apiResult || "Results will be displayed here..."}
          </div>
        </div>
      </div>
    </main>
  );
}
