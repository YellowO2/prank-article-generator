// app/api/pranks/route.ts
import { NextRequest, NextResponse } from "next/server";
// No database imports needed for now!
// import { prisma } from '@/lib/db';
// import { findPrankBySlug, savePrank } from '@/lib/prankDbUtils'; // No Firestore either

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
  console.log("--- Using Mock API Route (No DB Interaction) ---");
  try {
    const body = await req.json();
    let { headline, description, type } = body;

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
    headline = headline.trim();
    description = description?.trim() || null;
    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Prank type is required." },
        { status: 400 }
      );
    }

    // --- Generate Slug (No Uniqueness Check Yet) ---
    let finalSlug = slugify(headline);
    if (!finalSlug) {
      // Handle cases where headline results in empty slug
      finalSlug = `prank-${Date.now()}`; // Simple fallback
    }

    // --- Skip Database Check and Save ---
    console.log(`(Mock) Would check/save prank with slug: ${finalSlug}`);
    console.log(`(Mock) Data:`, { headline, description, type });
    // No actual DB interaction here

    // --- Construct the Full Link ---
    // Use environment variable for base URL or fallback to request origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    // Use the desired path structure (e.g., /article/)
    const prankPath = `/article/${finalSlug}`;
    const fullLink = `${baseUrl}${prankPath}`;

    console.log(`(Mock) Generated Link: ${fullLink}`);

    // --- Return Success Response ---
    // Simulate a short delay like a real DB operation might have
    await new Promise((resolve) => setTimeout(resolve, 300)); // Optional: Simulate delay

    return NextResponse.json({ link: fullLink }, { status: 201 }); // 201 Created
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
