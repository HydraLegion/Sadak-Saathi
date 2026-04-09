"use client"; 

import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";

// ⚠️ IMPORTANT: Adjust this path to point to your actual firebase config file.
// If your firebase.ts/js is directly inside the 'src' folder, "../firebase" is correct.
import { app } from "../firebase"; 

const db = getFirestore(app);

export default function PotholeDatasetUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Reading file...");

    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setUploadStatus("Error: File is empty or could not be read.");
        setIsUploading(false);
        return;
      }
      
      // Split the text into an array of lines
      const lines = text.split("\n");
      setUploadStatus(`Found ${lines.length} potential rows. Uploading to Firestore...`);

      let successCount = 0;

      // Loop through every line and save to Firestore
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines or header rows (like "latitude, longitude, severity")
        if (!line || line.toLowerCase().includes("latitude")) continue; 

        // Split the line by commas 
        const dataParts = line.split(",");
        
        if (dataParts.length >= 3) {
          try {
            await addDoc(collection(db, "potholes"), {
              // Convert text to numbers for map coordinates
              latitude: parseFloat(dataParts[0].trim()),
              longitude: parseFloat(dataParts[1].trim()),
              severity: dataParts[2].trim()
            });
            successCount++;
          } catch (error) {
            console.error(`Error saving row ${i + 1}:`, error);
          }
        }
      }

      setIsUploading(false);
      setUploadStatus(`✅ Done! Successfully saved ${successCount} potholes to Firestore.`);
      
      // Clear the input so you can upload another file if needed
      e.target.value = ""; 
    };

    reader.onerror = () => {
      setUploadStatus("❌ Error reading the file.");
      setIsUploading(false);
    };

    // Start reading the file
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', maxWidth: '400px', backgroundColor: '#ffffff', color: '#000000' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>Upload Pothole Dataset</h3>
      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
        Requires a .txt or .csv file. <br/>Format: <code>Latitude, Longitude, Severity</code>
      </p>
      
      <input 
        type="file" 
        accept=".txt,.csv" 
        onChange={handleFileUpload} 
        disabled={isUploading}
        style={{ marginBottom: '16px', display: 'block' }}
      />
      
      {uploadStatus && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: isUploading ? '#f3f4f6' : '#ecfdf5', 
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
}