import { supabase } from "./supabase";
import type { Widget } from "../types/widget";

// 브라우저+Node 타입 이슈 회피용
type TimeoutId = ReturnType<typeof setTimeout>;

// Debounce 타이머 관리
const pendingSyncs = new Map<string, TimeoutId>();

export class StorageAdapter {
  private user: any = null;

  constructor() {
    // constructor에서는 await 못 쓰므로, 외부에서 init()을 반드시 호출해줘야함
  }

  /** 반드시 앱 시작 시 1회 호출 */
  async init() {
    await this.initUser();
  }

  //  사용자 정보 초기화
  private async initUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.warn("auth.getUser failed:", error.message);
      this.user = null;
      return;
    }
    this.user = data.user ?? null;
  }

  //  로그인 여부 확인
  private isLoggedIn(): boolean {
    return this.user !== null;
  }

  private getLocalWidgets(): Record<string, Widget> {
    try {
      const raw = localStorage.getItem("widgets");
      if (!raw) return {};
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return Object.fromEntries(parsed.map((w: Widget) => [w.id, w]));
      }
      return parsed;
    } catch {
      return {};
    }
  }

  /** 외부에서 안전하게 로컬 캐시를 얻고 싶을 때 사용 (private 우회 금지) */
  public getLocalCache(): Record<string, Widget> {
    return this.getLocalWidgets();
  }

  // === localStorage 쓰기 (헬퍼) ===
  private saveLocalWidgets(widgets: Record<string, Widget>) {
    localStorage.setItem("widgets", JSON.stringify(widgets));
  }

  // === 앱 시작 시 위젯 로드 ===
  async getWidgets(): Promise<Record<string, Widget>> {
    if (this.isLoggedIn()) {
      try {
        const { data, error } = await supabase
          .from("widgets")
          .select("*")
          .eq("user_id", this.user.id);

        if (error) throw error;

        const cloudWidgets = (data ?? []).reduce((acc, widget) => {
          acc[widget.id] = widget as Widget;
          return acc;
        }, {} as Record<string, Widget>);

        // localStorage에도 캐싱 (오프라인 대비)
        this.saveLocalWidgets(cloudWidgets);
        return cloudWidgets;
      } catch (error) {
        console.error(
          "❌ Failed to load from cloud, using local cache:",
          error
        );
        return this.getLocalWidgets();
      }
    }
    // 비로그인: localStorage만 사용
    return this.getLocalWidgets();
  }

  // === 위젯 추가 ===
  async addWidget(
    widget: Omit<Widget, "id" | "created_at" | "updated_at">
  ): Promise<Widget> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newWidget: Widget = {
      ...widget,
      id,
      created_at: now,
      updated_at: now,
    } as Widget;

    // 1) localStorage 즉시 반영
    const widgets = this.getLocalWidgets();
    widgets[id] = newWidget;
    this.saveLocalWidgets(widgets);

    // 2) 로그인 시 클라우드 반영
    if (this.isLoggedIn()) {
      try {
        const { error } = await supabase
          .from("widgets")
          .insert([{ ...newWidget, user_id: this.user.id }]);
        if (error) throw error;
        console.log(`✅ Widget ${id} added to cloud`);
      } catch (e) {
        console.error("❌ Failed to add to cloud:", e);
      }
    }
    return newWidget;
  }

  // === 위젯 수정 ===
  async updateWidget(id: string, updates: Partial<Widget>): Promise<Widget> {
    const widgets = this.getLocalWidgets();
    if (!widgets[id]) throw new Error(`Widget ${id} not found`);

    const updated = {
      ...widgets[id],
      ...updates,
      updated_at: new Date().toISOString(),
    } as Widget;

    // 1) localStorage 즉시 반영
    widgets[id] = updated;
    this.saveLocalWidgets(widgets);

    // 2) 로그인 시 debounce 동기화
    if (this.isLoggedIn()) {
      this.syncToCloudDebounced(id, updated);
    }
    return updated;
  }
  async clearAllWidgets() {
    localStorage.removeItem("widgets");
  }

  // === Debounce 동기화 ===
  private syncToCloudDebounced(id: string, widget: Widget) {
    if (pendingSyncs.has(id)) {
      clearTimeout(pendingSyncs.get(id)!);
    }

    const timer = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("widgets")
          .update({
            title: (widget as any).title,
            type: widget.type,
            props: widget.props,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", this.user.id);

        if (error) throw error;

        console.log(`✅ Synced widget ${id} to cloud`);
        pendingSyncs.delete(id);
      } catch (e) {
        console.error(`❌ Sync failed for widget ${id}:`, e);
        this.retrySyncLater(id, widget);
      }
    }, 1000);

    pendingSyncs.set(id, timer);
  }

  private retrySyncLater(id: string, widget: Widget) {
    setTimeout(() => this.syncToCloudDebounced(id, widget), 5000);
  }

  // === 위젯 삭제 ===
  async deleteWidget(id: string): Promise<void> {
    const widgets = this.getLocalWidgets();
    delete widgets[id];
    this.saveLocalWidgets(widgets);

    if (this.isLoggedIn()) {
      try {
        const { error } = await supabase
          .from("widgets")
          .delete()
          .eq("id", id)
          .eq("user_id", this.user.id);
        if (error) throw error;
        console.log(`✅ Widget ${id} deleted from cloud`);
      } catch (e) {
        console.error("❌ Failed to delete from cloud:", e);
      }
    }

    if (pendingSyncs.has(id)) {
      clearTimeout(pendingSyncs.get(id)!);
      pendingSyncs.delete(id);
    }
  }

  // === 🔑 로그인 처리 ===
  async onLogin(user: any) {
    this.user = user;
    await this.migrateLocalToCloud();
    console.log("✅ Login complete, data migrated");
  }

  // === 🚪 로그아웃 처리 ===
  async onLogout() {
    await this.flushPendingSyncs();
    this.user = null;
    console.log("✅ Logout complete, data cached locally");
  }

  // === 📦 마이그레이션: localStorage → Supabase ===
  private async migrateLocalToCloud(): Promise<void> {
    if (!this.isLoggedIn())
      throw new Error("User must be logged in to migrate");

    try {
      const localWidgets = this.getLocalWidgets();
      if (Object.keys(localWidgets).length === 0) {
        console.log("No local data to migrate");
        return;
      }

      const { data: cloudWidgets, error } = await supabase
        .from("widgets")
        .select("id")
        .eq("user_id", this.user.id);

      if (error) throw error;

      const cloudIds = new Set((cloudWidgets ?? []).map((w: any) => w.id));
      const toUpload = Object.values(localWidgets).filter(
        (w) => !cloudIds.has(w.id)
      );

      if (toUpload.length > 0) {
        const { error: insErr } = await supabase
          .from("widgets")
          .insert(toUpload.map((w) => ({ ...w, user_id: this.user.id })));
        if (insErr) throw insErr;

        console.log(`✅ Migrated ${toUpload.length} widgets to cloud`);
      }
    } catch (e) {
      console.error("❌ Migration failed:", e);
      throw e;
    }
  }

  // === 🔄 남은 동기화 강제 실행 ===
  async flushPendingSyncs(): Promise<void> {
    if (!this.isLoggedIn() || pendingSyncs.size === 0) return;

    const widgets = this.getLocalWidgets();
    const jobs = Array.from(pendingSyncs.keys()).map(async (id) => {
      clearTimeout(pendingSyncs.get(id)!);
      const w = widgets[id];
      if (!w) return;

      try {
        const { error } = await supabase
          .from("widgets")
          .update({
            title: (w as any).title,
            type: w.type,
            props: w.props,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", this.user.id);

        if (error) throw error;
        console.log(`✅ Flushed sync for widget ${id}`);
      } catch (e) {
        console.error(`❌ Failed to flush widget ${id}:`, e);
      }
    });

    await Promise.all(jobs);
    pendingSyncs.clear();
  }
}

export const storage = new StorageAdapter();

// 브라우저 종료 시 남은 동기화 실행(완전 보장 X, 그래도 시도)
window.addEventListener("beforeunload", (e) => {
  // flush 호출 시 약간의 시간을 확보하려면 아래 2줄을 유지(일부 브라우저에서만 유효)
  e.preventDefault();
  e.returnValue = "";
  void storage.flushPendingSyncs();
});
