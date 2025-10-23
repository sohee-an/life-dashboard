import { create } from 'zustand';
import { storage } from '../lib/storageAdapter';
import { supabase } from '../lib/supabase';
import type { Widget, WidgetType } from '../types/widget';
import { debouncedUpdate } from '../utiles/debouncedUpdate';
import { debounce } from '../utiles/debounce';

const debouncedPersist = debounce(async (id: string, widget: Widget) => {
  console.log('💾 Auto-saving widget:', id);
  await storage.updateWidget(id, widget);
}, 800);

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    console.log('⚡ Flushing pending saves before unload');
    debouncedPersist.flush(); // 타이머 중이던 저장 강제 실행
  });
}
interface DashboardState {
  widgets: Record<string, Widget>;
  selectedWidgetId: string | null;
  isLoading: boolean;
  error: string | null;
  user: any | null;

  persistAll: any;
  initWidgets: () => Promise<void>;
  setWidgets: (widgets: Record<string, Widget>) => void;
  addWidget: (
    widget: Omit<Widget, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<string>;
  updateWidget: (id: string, updates: Partial<Widget>) => Promise<void>;
  updateWidgetProps: (id: string, newProps: Partial<Widget['props']>) => void;
  updateWidgetLayout: (
    id: string,
    newLayout: Partial<Widget['layout']>
  ) => void;

  deleteWidget: (id: string) => Promise<void>;
  selectWidget: (id: string | null) => void;
  clearAllWidgets: () => void;
  //위젯 편집 모드 상태
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  widgets: {},
  selectedWidgetId: null,
  isLoading: false,
  error: null,
  user: null,

  // === 초기화 ===
  // Storage 초기화 하는 로직으로 사용자가 로그인이 되어있다면 supbase로
  // 안되어있다면 localstorage로
  initWidgets: async () => {
    set({ isLoading: true, error: null });

    try {
      await storage.init();

      const { data } = await supabase.auth.getUser();
      const user = data.user ?? null;

      const widgets = await storage.getWidgets();

      set({ widgets, user, isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Failed to load',
        isLoading: false,
      });
    }
  },

  setWidgets: (widgets) => set({ widgets }),

  // === 위젯 추가 ===
  addWidget: async (widget) => {
    set({ isLoading: true, error: null });
    try {
      const newWidget = await storage.addWidget(widget);
      set((state) => ({
        widgets: { ...state.widgets, [newWidget.id]: newWidget },
        isLoading: false,
      }));
      return newWidget.id;
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Failed to add',
        isLoading: false,
      });
      throw e;
    }
  },

  // === 위젯 수정 ===
  updateWidget: async <T extends WidgetType>(
    id: string,
    updates: Partial<Widget<T>>
  ) => {
    try {
      const current = get().widgets[id];
      if (!current) throw new Error(`Widget ${id} not found`);

      const updated: Widget = {
        ...current,
        ...updates,
        props: {
          ...current.props,
          ...updates.props,
        },
        updated_at: new Date().toISOString(),
      };

      // 저장(로컬 즉시, 로그인 시 debounce 클라우드)
      await storage.updateWidget(id, updated);

      set((state) => ({
        widgets: { ...state.widgets, [id]: updated },
      }));
    } catch (e) {
      console.error('Update failed:', e);
      set({ error: e instanceof Error ? e.message : 'Failed to update' });
      throw e;
    }
  },
  /** 1️⃣ 메모리 내 업데이트 (즉시 반영) */
  updateWidgetProps: (id, newProps) => {
    const current = get().widgets[id];
    if (!current) return;
    const updated = { ...current, props: { ...current.props, ...newProps } };
    set((s) => ({ widgets: { ...s.widgets, [id]: updated } }));
  },

  /** 2️⃣ 로컬스토리지 저장 (idle or unload 시점에서만 호출) */
  persistAll: () => {
    localStorage.setItem('widgets', JSON.stringify(get().widgets));
    console.log('💾 saved to localStorage');
  },
  // updateWidgetProps: (id: string, newProps: Partial<Widget['props']>) => {
  //   const current = get().widgets[id];
  //   if (!current) return;

  //   const updated = {
  //     ...current,
  //     props: { ...current.props, ...newProps },
  //   };
  //   set((s) => ({ widgets: { ...s.widgets, [id]: updated } }));
  //   debouncedUpdate(id, 'props', newProps);
  // },

  updateWidgetLayout: (id, newLayout) => {
    const current = get().widgets[id];
    if (!current) return;

    const updated = {
      ...current,
      layout: { ...current.layout, ...newLayout },
    };
    set((s) => ({ widgets: { ...s.widgets, [id]: updated } }));

    debouncedUpdate(id, 'layout', newLayout);
  },

  // === 위젯 삭제 ===
  deleteWidget: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await storage.deleteWidget(id);

      set((state) => {
        const next = { ...state.widgets };
        delete next[id];
        return {
          widgets: next,
          selectedWidgetId:
            state.selectedWidgetId === id ? null : state.selectedWidgetId,
          isLoading: false,
        };
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Failed to delete',
        isLoading: false,
      });
      throw e;
    }
  },
  clearAllWidgets: async () => {
    set({ isLoading: true, error: null });
    try {
      await storage.clearAllWidgets?.();

      set({
        widgets: {},
        selectedWidgetId: null,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Failed to clear all',
        isLoading: false,
      });
      throw e;
    }
  },

  selectWidget: (id) => set({ selectedWidgetId: id }),
  isEditMode: false,
  setEditMode: (value) => set({ isEditMode: value }),

  // === 로그인 ===
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      await storage.onLogin(data.user);

      const widgets = await storage.getWidgets();
      set({ user: data.user, widgets, isLoading: false });

      console.log('✅ Logged in successfully');
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Login failed',
        isLoading: false,
      });
      throw e;
    }
  },

  // === 로그아웃 ===
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await storage.onLogout();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 로컬 캐시 유지
      const widgets = storage.getLocalCache();
      set({ user: null, widgets, isLoading: false });

      console.log('✅ Logged out successfully');
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Logout failed',
        isLoading: false,
      });
      throw e;
    }
  },
}));
