const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generateRecommendation = async (data) => {
  try {
    const response =
      await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `
You are an aviation instructor.

Student statistics:

${JSON.stringify(data, null, 2)}

Provide:

1. Weakest area
2. What to study
3. Practical advice

Return ONLY JSON:

{
  "recommendation": "..."
}
`
      });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    return JSON.parse(text);

  } catch (error) {
  console.error(
    'RECOMMENDATION ERROR:',
    error.message
  );

  return {
    recommendation:
      'Focus on regulations. Review VFR terminology, airspace classifications, and weather minimums. Your analytics indicate repeated mistakes in this category.'
  };
}
};

module.exports = {
  generateRecommendation
};