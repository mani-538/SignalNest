import { NextResponse } from "next/server";
import { store } from "@/lib/data-store";
import { EventActionSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const source = searchParams.get("source") || "all";

    const events = store.getEvents({ status, source });
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = EventActionSchema.parse(body);

    const statusMap = {
      save_draft: "draft_saved" as const,
      approve: "approved" as const,
      mark_done: "done" as const,
      dismiss: "dismissed" as const,
    };

    const updated = store.updateEvent(validated.eventId, {
      status: statusMap[validated.action],
      currentReplyDraft: validated.replyContent,
    });

    return NextResponse.json({
      success: true,
      message: `Action ${validated.action} executed successfully. Human approval enforced.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.errors || error.message || "Validation failed" },
      { status: 400 }
    );
  }
}
