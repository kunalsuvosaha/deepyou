import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//hugging-face setup
// const HUGGINGFACE_API_URL = "https://router.huggingface.co/hf-inference/models/google/flan-t5-large";
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// list of openai models
(async () => {
  const models = await openai.models.list();
  console.log(models.data.map(m => m.id));
})();

const questions = [
  "Do you enjoy social gatherings?",
  "Do you prefer planning over spontaneity?",
  "Do you feel comfortable in leadership roles?",
  "Do you enjoy solving complex problems?",
  "Do you prefer working alone rather than in a team?",
  "Do you often get emotional in situations?",
  "Do you enjoy debating on intellectual topics?",
  "Do you find it easy to adapt to new environments?",
  "Are you more creative or analytical?",
  "Do you enjoy taking risks?"
];

// Route to handle analysis
app.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;
    console.log("Received answers:", answers);

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid answers input" });
    }
    const prompt = `Analyze the following personality test responses and provide a brief, friendly personality insight:\n\n${questions
      .map((q, i) => `${i + 1}. ${q}\nAnswer: ${answers[i]}`)
      .join("\n\n")}`;
    console.log("sending prompt  : " +  prompt)
    
    await fetchFromHuggingFace(prompt, res);
    // await fetchFromOpenAI(prompt, res);
  } catch (error) {
    console.error("Server Error:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Error processing request" });
  }
});

async function fetchFromHuggingFace(prompt, res) {
  try {
    const hfResponse = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        inputs: prompt,
        options: { 
          wait_for_model: true 
        } }),
    });

    if (!hfResponse.ok) {
      const text = await hfResponse.text(); // in case it's not JSON
      throw new Error(`Hugging Face error: ${hfResponse.status} - ${text}`);
    }

    const hfResult = await hfResponse.json();
  
    const output = Array.isArray(hfResult) 
    ? hfResult[0]?.generated_text || "No response from model" 
    : JSON.stringify(hfResult);
    console.log("✅ Hugging Face response:", output);
    res.json({ result: output });
  } catch (err) {
    console.error("HF API Error:", err);
    res.status(500).json({ error: "Failed to fetch from Hugging Face API" });
  }
}

async function fetchFromOpenAI(prompt, res) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-search-preview-2025-03-11",
    messages: [{ role: "user", content: prompt }],
  });
  
  const analysis = completion.data.choices[0].message.content;
  console.log("OpenAI response:", analysis);
  res.json({ result: analysis });
}


// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
