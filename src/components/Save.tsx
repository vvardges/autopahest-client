// src/SaveJson.tsx
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

// 🔑 Replace these with your own project credentials
const supabaseUrl = "https://YOUR_PROJECT.supabase.co";
const supabaseKey = "YOUR_PUBLIC_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Save() {
  const [status, setStatus] = useState("");

  const saveJson = async() => {
    const jsonData = {
      project: "ConnectCarrier",
      version: "1.0",
      timestamp: new Date().toISOString(),
      settings: { language: "en", theme: "dark" }
    };

    const { error } = await supabase.from("data").insert([{ json: jsonData }]);

    if (error) {
      console.error("❌ Error saving JSON:", error);
      setStatus("❌ Failed to save");
    } else {
      setStatus("✅ JSON saved to the cloud!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Save JSON to Supabase</h2>
      <button onClick={saveJson}>Save JSON</button>
      <p>{status}</p>
    </div>
  );
}
