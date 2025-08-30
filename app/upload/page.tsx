"use client";

import { useState } from "react";

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUrl(data.url || null);
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold mb-4">Test Upload API</h1>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {url && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img src={url} alt="Uploaded" className="mt-2 max-w-xs rounded" />
        </div>
      )}
    </div>
  );
}
