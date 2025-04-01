import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateArticleContent(description: string): Promise<{
  title: string;
  category: string;
  content: string;
  subHeading: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Write a short news article (300-500 words) based on this description: "${description}". 

The article should be written in a style similar to real news articles. The title should be **catchy and believable**. Ensure the article **sounds natural**, not like an AI-generated summary. 

**Formatting Rules:**
- The title must start with: "Title: " followed by the headline.
- The subheading must start with: "Subheading: " followed by a short, engaging summary of the article.
- The content should start on a new line after the subheading.
- The category must start with: "Category: " followed by one of these categories: Food, Technology, Education, Lifestyle, Business, Entertainment, Travel.
- Do not use Markdown formatting (e.g., no bold, italics, or bullet points).
- The output should be in plain text.

**Example Format:**
Title: Yorushika Set to Perform in Singapore Next Month!  
Subheading: Acclaimed Japanese duo Yorushika is set to captivate fans with their soulful melodies.  
Category: Entertainment  
Get ready, Singapore! Acclaimed Japanese musical duo Yorushika is bringing their signature blend of evocative storytelling and breathtaking melodies to our shores next month! After months of anticipation, fans can finally...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Extract title, subheading, category, and content from the response
    const [titleLine, subheadingLine, categoryLine, ...contentLines] = response
      .text()
      .split("\n");
    const title = titleLine.replace(/^Title:\s*/, "").trim();
    const subHeading = subheadingLine.replace(/^Subheading:\s*/, "").trim();
    const category = categoryLine.replace(/^Category:\s*/, "").trim();
    const content = contentLines.join("\n").trim();

    return { title, subHeading, category, content };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate article content");
  }
}
