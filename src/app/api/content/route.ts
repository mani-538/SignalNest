import { NextResponse } from "next/server";
import { store } from "@/lib/data-store";
import { ContentItemCreateSchema, ContentItemUpdateSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") || "all";
    const status = searchParams.get("status") || "all";

    const items = store.getContentItems({ platform, status });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ContentItemCreateSchema.parse(body);

    const created = store.createContentItem({
      coreIdea: validated.coreIdea,
      platform: validated.platform,
      title: validated.title,
      draft: validated.draft,
      status: validated.status,
      scheduledAt: validated.scheduledAt || undefined,
      mediaNotes: validated.mediaNotes,
      hashtags: validated.hashtags,
      cta: validated.cta,
      tone: validated.tone,
      targetAudience: validated.targetAudience,
      objective: validated.objective,
    });

    return NextResponse.json({
      success: true,
      message: "Draft saved.",
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.errors || error.message || "Failed to create content item" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validated = ContentItemUpdateSchema.parse(body);

    const updated = store.updateContentItem(validated.id, {
      draft: validated.draft,
      title: validated.title,
      status: validated.status,
      scheduledAt: validated.scheduledAt === null ? undefined : validated.scheduledAt,
      mediaNotes: validated.mediaNotes,
      hashtags: validated.hashtags,
      cta: validated.cta,
      tone: validated.tone,
    });

    return NextResponse.json({
      success: true,
      message: `Content item updated. Status: ${updated.status}`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.errors || error.message || "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }

    const deleted = store.deleteContentItem(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
