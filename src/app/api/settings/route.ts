import { NextResponse } from "next/server";
import { store } from "@/lib/data-store";
import { BrandSettingsSchema } from "@/lib/validations";

export async function GET() {
  try {
    const settings = store.getBrandSettings();
    const rules = store.getNotificationRules();
    return NextResponse.json({ success: true, data: { settings, rules } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validated = BrandSettingsSchema.partial().parse(body);

    const updated = store.updateBrandSettings(validated);
    return NextResponse.json({
      success: true,
      message: "Brand voice and governance settings saved.",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.errors || error.message || "Failed to update settings" },
      { status: 400 }
    );
  }
}
