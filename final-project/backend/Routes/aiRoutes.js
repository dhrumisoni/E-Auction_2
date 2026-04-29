import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required." });
    }

    const groqApiKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : null;

    if (!groqApiKey) {
      return res.status(500).json({ message: "Groq API key not configured." });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for an eAuction platform. Answer questions concisely and professionally."
          },
          {
            role: "user",
            content: question
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error("Error asking AI:", error?.response?.data || error.message);
    const errorMsg = error?.response?.data?.error?.message || error.message;
    res.status(500).json({ message: `Failed to get AI response: ${errorMsg}` });
  }
});

export default router;
