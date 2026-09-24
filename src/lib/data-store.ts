import {
  initialAnalyticsSnapshots,
  initialConnections,
  initialContentItems,
  initialEvents,
  initialAuditLogs,
  initialNotificationRules,
  defaultBrandSettings,
} from "./mock-data";
import {
  AnalyticsSnapshot,
  BrandSettings,
  ContentItem,
  ContentStatus,
  EventStatus,
  NotificationRule,
  PlatformType,
  SocialConnection,
  SocialEvent,
  AuditLog,
} from "@/types";

// In-memory persistent state container for the server lifecycle
class DataStore {
  private connections: SocialConnection[] = [...initialConnections];
  private events: SocialEvent[] = [...initialEvents];
  private contentItems: ContentItem[] = [...initialContentItems];
  private analytics: AnalyticsSnapshot[] = [...initialAnalyticsSnapshots];
  private notificationRules: NotificationRule[] = [...initialNotificationRules];
  private auditLogs: AuditLog[] = [...initialAuditLogs];
  private brandSettings: BrandSettings = { ...defaultBrandSettings };

  // Connections
  getConnections(): SocialConnection[] {
    return this.connections;
  }

  getConnection(provider: PlatformType): SocialConnection | undefined {
    return this.connections.find((c) => c.provider === provider);
  }

  toggleConnection(provider: PlatformType, connected: boolean): SocialConnection {
    const conn = this.connections.find((c) => c.provider === provider);
    if (!conn) {
      throw new Error(`Provider ${provider} not found`);
    }
    conn.status = connected ? "connected" : "disconnected";
    conn.expiresAt = connected
      ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    this.addAuditLog(
      connected ? "CONNECTED_PROVIDER" : "DISCONNECTED_PROVIDER",
      "SocialConnection",
      conn.id,
      `${connected ? "Simulated OAuth connection" : "Disconnected"} for ${provider.toUpperCase()}`
    );

    return conn;
  }

  // Events (Unified Inbox)
  getEvents(filter?: { status?: string; source?: string }): SocialEvent[] {
    let result = [...this.events];
    if (filter?.status && filter.status !== "all") {
      result = result.filter((e) => e.status === filter.status);
    }
    if (filter?.source && filter.source !== "all") {
      result = result.filter((e) => e.source === filter.source);
    }
    return result.sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }

  getEventById(id: string): SocialEvent | undefined {
    return this.events.find((e) => e.id === id);
  }

  updateEvent(
    id: string,
    updates: {
      status?: EventStatus;
      currentReplyDraft?: string;
      tags?: string[];
    }
  ): SocialEvent {
    const event = this.events.find((e) => e.id === id);
    if (!event) throw new Error("Event not found");

    if (updates.status) event.status = updates.status;
    if (updates.currentReplyDraft !== undefined)
      event.currentReplyDraft = updates.currentReplyDraft;
    if (updates.tags) event.tags = updates.tags;

    if (updates.status === "approved") {
      event.approvedAt = new Date().toISOString();
      event.approvedBy = this.brandSettings.userName;
      this.addAuditLog(
        "REPLY_APPROVED",
        "SocialEvent",
        event.id,
        `Approved public reply for ${event.source.toUpperCase()} ${event.type}: "${event.currentReplyDraft?.slice(0, 60)}..."`
      );
    } else if (updates.status === "done") {
      this.addAuditLog(
        "EVENT_RESOLVED",
        "SocialEvent",
        event.id,
        `Marked event done for ${event.source.toUpperCase()} ${event.type} from ${event.authorName}`
      );
    } else if (updates.status === "draft_saved") {
      this.addAuditLog(
        "REPLY_DRAFT_SAVED",
        "SocialEvent",
        event.id,
        `Saved reply draft for ${event.source.toUpperCase()} ${event.type}`
      );
    }

    return event;
  }

  // Content Items (Studio & Calendar)
  getContentItems(filter?: { platform?: string; status?: string }): ContentItem[] {
    let items = [...this.contentItems];
    if (filter?.platform && filter.platform !== "all") {
      items = items.filter((c) => c.platform === filter.platform);
    }
    if (filter?.status && filter.status !== "all") {
      items = items.filter((c) => c.status === filter.status);
    }
    return items.sort((a, b) => {
      const aTime = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
      const bTime = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  getContentItemById(id: string): ContentItem | undefined {
    return this.contentItems.find((c) => c.id === id);
  }

  createContentItem(item: Omit<ContentItem, "id" | "createdAt" | "updatedAt">): ContentItem {
    const newItem: ContentItem = {
      ...item,
      id: `cnt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.contentItems.unshift(newItem);

    this.addAuditLog(
      "DRAFT_CREATED",
      "ContentItem",
      newItem.id,
      `Created draft for ${newItem.platform.toUpperCase()}: "${newItem.title || newItem.coreIdea.slice(0, 40)}"`
    );

    return newItem;
  }

  updateContentItem(id: string, updates: Partial<ContentItem>): ContentItem {
    const item = this.contentItems.find((c) => c.id === id);
    if (!item) throw new Error("Content item not found");

    Object.assign(item, updates, { updatedAt: new Date().toISOString() });

    if (updates.status === "approved") {
      item.approvedAt = new Date().toISOString();
      item.approvedBy = this.brandSettings.userName;
      this.addAuditLog(
        "CONTENT_APPROVED",
        "ContentItem",
        item.id,
        `Approved publication for ${item.platform.toUpperCase()}: "${item.title || item.coreIdea.slice(0, 40)}"`
      );
    } else if (updates.status === "scheduled") {
      this.addAuditLog(
        "CONTENT_SCHEDULED",
        "ContentItem",
        item.id,
        `Scheduled ${item.platform.toUpperCase()} post for ${item.scheduledAt} (Planned MVP status)`
      );
    } else {
      this.addAuditLog(
        "CONTENT_UPDATED",
        "ContentItem",
        item.id,
        `Updated content for ${item.platform.toUpperCase()}`
      );
    }

    return item;
  }

  duplicateContentItem(id: string): ContentItem {
    const item = this.contentItems.find((c) => c.id === id);
    if (!item) throw new Error("Content item not found");

    const duplicate: ContentItem = {
      ...item,
      id: `cnt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: item.title ? `${item.title} (Copy)` : undefined,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedAt: undefined,
      approvedBy: undefined,
    };
    this.contentItems.unshift(duplicate);

    this.addAuditLog(
      "CONTENT_DUPLICATED",
      "ContentItem",
      duplicate.id,
      `Duplicated ${item.platform.toUpperCase()} content item`
    );

    return duplicate;
  }

  deleteContentItem(id: string): boolean {
    const idx = this.contentItems.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    const [removed] = this.contentItems.splice(idx, 1);

    this.addAuditLog(
      "CONTENT_DELETED",
      "ContentItem",
      removed.id,
      `Deleted ${removed.platform.toUpperCase()} content item: "${removed.title || removed.coreIdea.slice(0, 40)}"`
    );

    return true;
  }

  // Analytics
  getAnalytics(timeRange: string = "7d", platform: string = "all"): AnalyticsSnapshot[] {
    let snaps = [...this.analytics];
    if (platform !== "all") {
      // Scale metrics slightly for provider view
      snaps = snaps.map((s) => ({
        ...s,
        platform: platform as PlatformType,
        impressions: Math.round(s.impressions * 0.35),
        reach: Math.round(s.reach * 0.35),
        engagements: Math.round(s.engagements * 0.38),
        followersDelta: Math.round(s.followersDelta * 0.3),
      }));
    }
    return snaps;
  }

  // Notification Rules
  getNotificationRules(): NotificationRule[] {
    return this.notificationRules;
  }

  toggleNotificationRule(id: string, isEnabled: boolean): NotificationRule {
    const rule = this.notificationRules.find((r) => r.id === id);
    if (!rule) throw new Error("Rule not found");
    rule.isEnabled = isEnabled;
    return rule;
  }

  // Settings
  getBrandSettings(): BrandSettings {
    return this.brandSettings;
  }

  updateBrandSettings(newSettings: Partial<BrandSettings>): BrandSettings {
    this.brandSettings = { ...this.brandSettings, ...newSettings };
    this.addAuditLog(
      "SETTINGS_UPDATED",
      "Settings",
      "global",
      "Updated brand settings, tone, or approval policies"
    );
    return this.brandSettings;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  addAuditLog(
    action: string,
    resourceType: AuditLog["resourceType"],
    resourceId: string,
    description: string,
    details?: Record<string, unknown>
  ): AuditLog {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      resourceType,
      resourceId,
      description,
      actor: `${this.brandSettings.userName} (Commander)`,
      timestamp: new Date().toISOString(),
      details,
    };
    this.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
    return log;
  }
}

// Global singleton for Next.js dev server & production runtime
const globalForStore = globalThis as unknown as { signalNestStore?: DataStore };

export const store = globalForStore.signalNestStore ?? new DataStore();

if (process.env.NODE_ENV !== "production") {
  globalForStore.signalNestStore = store;
}
