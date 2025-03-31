import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateArticleContent(
  description: string
): Promise<{ title: string; content: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `Write a short news article (200-300 words) based on this description: "${description}". 
    The article should include a catchy/realistic title and realistic content for an April Fools' joke. 
    Write in plan text, for example, dont use bolding like **example bold**. 
    Example format:
    Title: Yorushika Sets To Perform In Singapore Next Month!
    Content: Get ready, Singapore! Acclaimed Japanese musical duo Yorushika is bringing their signature blend of evocative storytelling and breathtaking melodies to our shores next month! After months of anticipation, fans can finally...`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Extract title and content from the response
    const [title, ...contentLines] = response.text().split("\n");
    const content = contentLines.join("\n").trim();

    return { title: title.replace(/^Title:\s*/, ""), content };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate article content");
  }
}
