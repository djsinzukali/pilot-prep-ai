const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateExplanation = async (questions, userAnswers) => {
  try {
    const prompt = buildPrompt(questions, userAnswers);

    const response = await ai.models.generateContent({
     model: "gemini-2.5-flash",
      contents: `
You are an expert aviation instructor (FAA/ICAO standard).

Return ONLY JSON.

Explain ONLY incorrect answers.

If all answers are correct, return empty array.

Format:
{
  "explanations": [
    {
      "questionId": number,
      "correctExplanation": string,
      "wrongExplanation": string,
      "takeaway": string,
       "errorType": "knowledge_gap | misunderstanding | careless_error"
    }
  ]
}

Questions:
${JSON.stringify(prompt, null, 2)}
`
    });

   const rawText =
  response.candidates?.[0]?.content?.parts?.[0]?.text || "";

const cleanedText = rawText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

let parsed;

try {
  parsed = JSON.parse(cleanedText);
} catch (err) {
  console.error("Invalid JSON from Gemini:", rawText);

  return {
    explanations: [],
    error: "AI returned invalid JSON"
  };
}

    return parsed;
  } catch (error) {
    console.error("GEMINI ERROR:", error.message);

    return {
      explanations: [],
      error: "AI explanation failed"
    };
  }
};

const buildPrompt = (questions, answers) => {
  return questions
    .map(q => {
      const userAnswer = answers[q.id];

      const isCorrect = userAnswer === q.answer;

      // ONLY include wrong answers
      if (isCorrect) return null;

      return {
        questionId: q.id,
        question: q.question,
        correctAnswer: q.answer,
        userAnswer: userAnswer || "No answer"
      };
    })
    .filter(Boolean);
};

module.exports = {
  generateExplanation
};