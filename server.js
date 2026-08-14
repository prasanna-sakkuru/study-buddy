const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/generate", async (req, res) => {

    try {

        const { topic, difficulty } = req.body;

        const response = await groq.chat.completions.create({

            model: "llama-3.1-8b-instant",

            messages: [

                {
                    role: "system",
                    content: `
You are an educational MCQ generator.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

The JSON must have this exact structure:

{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct option"
    }
  ]
}

Generate exactly 5 questions.
`
                },

                {
                    role: "user",
                    content: `
Create 5 multiple-choice questions about ${topic}.

Difficulty: ${difficulty}

Each question must have exactly 4 options.
Only one option should be correct.
`
                }

            ],

            temperature: 0.7
        });

        const text = response.choices[0].message.content;

        const questions = JSON.parse(text);

        res.json(questions);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Could not generate MCQs."
        });

    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Study Buddy server running on port ${PORT}`);
});