// app/api/pranks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { findArticleBySlug, saveArticle } from "../../../database-functions";
import { generateArticleContent } from "../../../google-gen-ai";

// Basic slugify function (keep this or use a library)
function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD") // Handle accents
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "") // Allow letters, numbers, underscore, hyphen
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { headline, description } = body;
    const type = body.type || "news-article"; // Default type

    // --- Basic Validation (Still Important!) ---
    if (
      !headline ||
      typeof headline !== "string" ||
      headline.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Headline is required." },
        { status: 400 }
      );
    }
    // Add other validation as needed (length, allowed types etc)
    if (description && typeof description !== "string") {
      return NextResponse.json(
        { error: "Description must be a string." },
        { status: 400 }
      );
    }

    let content;
    try {
      content = await generateArticleContent(description);
    } catch (error) {
      console.error("Content generation failed:", error);
      return NextResponse.json(
        { error: "Failed to generate article content" },
        { status: 500 }
      );
    }

    // --- Generate Slug ---
    let finalSlug = slugify(headline);

    if (!finalSlug) {
      // Handle cases where headline results in empty slug
      finalSlug = `prank-${Date.now()}`; // Simple fallback
    }

    // Check if slug already exists
    const existingArticle = await findArticleBySlug(finalSlug);
    if (existingArticle) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    // Save to Firestore
    await saveArticle({
      headline: headline,
      description: description,
      type: type,
      content: content,
      slug: finalSlug,
      views: 0,
      // headline: "Test Headline",
      // description: "Test Description",
      // type: "news-article",
      // content: "This is test content",
      // slug: "test-headline",
    });

    // --- Construct the Full Link ---
    // Use environment variable for base URL or fallback to request origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const prankPath = `/article/${finalSlug}`;
    const fullLink = `${baseUrl}${prankPath}`;

    console.log(`(Mock) Generated Link: ${fullLink}`);

    return NextResponse.json({ link: fullLink }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Mock API Error creating prank:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body format." },
        { status: 400 }
      );
    }
    // Generic error for other cases
    return NextResponse.json(
      { error: error.message || "Failed to create prank link (mock error)." },
      { status: 500 }
    );
  }
}
