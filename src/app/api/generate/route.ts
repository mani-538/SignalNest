import { NextResponse } from "next/server";
import { GenerateContentSchema } from "@/lib/validations";
import { contentGenerator } from "@/lib/generator/content-generator";
import { store } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = GenerateContentSchema.parse(body);

    const drafts = await contentGenerator.generateDrafts(validated);

    store.addAuditLog(
      "AI_DRAFTS_GENERATED",
      "ContentItem",
      "batch",
      `Generated drafts across ${drafts.length} platforms for prompt: "${validated.coreIdea.slice(0, 50)}..."`
    );

    return NextResponse.json({
      success: true,
      count: drafts.length,
      data: drafts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.errors || error.message || "Failed to generate drafts" },
      { status: 400 }
    );
  }
}
