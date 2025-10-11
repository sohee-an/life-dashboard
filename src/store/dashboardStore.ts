import { create } from "zustand";
import type { Widget, WidgetType, WidgetPropsMap } from "../types/widget";

interface DashboardState {
  // widgets: Widget[];
  widgets: Record<string, Widget>; // Record로 바꾸기
  // setWidgets: (widgets: Widget[]) => void;
  setWidgets: (widgets: Record<string, Widget>) => void;
  updateWidget: <T extends WidgetType>(
    id: string,
    newProps: Partial<WidgetPropsMap[T]>
  ) => void;

  addWidget: (widget: Widget) => void;
  deleteWidget: (id: string) => void;
}

function loadWidgets(): Record<string, Widget> {
  try {
    const raw = localStorage.getItem("widgets");
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    // 만약 배열 형태로 저장돼 있었다면 Record로 변환
    if (Array.isArray(parsed)) {
      return Object.fromEntries(parsed.map((w: Widget) => [w.id, w]));
    }
    return parsed;
  } catch {
    return {};
  }
}
export const useDashboardStore = create<DashboardState>((set) => ({
  widgets: loadWidgets(),

  setWidgets: (widgets) => {
    set({ widgets });
    localStorage.setItem("widgets", JSON.stringify(widgets));
  },

  addWidget: (widget) => {
    set((state) => {
      const newWidgets = { ...state.widgets, [widget.id]: widget };
      localStorage.setItem("widgets", JSON.stringify(newWidgets));
      return { widgets: newWidgets };
    });
  },

  updateWidget: (id, newProps) =>
    set((state) => {
      const target = state.widgets[id];
      if (!target) return state;
      const updated = {
        ...state.widgets,
        [id]: { ...target, props: { ...target.props, ...newProps } },
      };

      // const updated = state.widgets.map((w) =>
      //   w.id === id ? { ...w, props: { ...w.props, ...newProps } } : w
      // );
      localStorage.setItem("widgets", JSON.stringify(updated));
      return { widgets: updated };
    }),

  deleteWidget: (id) => {
    set((state) => {
      const newWidgets = { ...state.widgets };
      delete newWidgets[id];
      localStorage.setItem("widgets", JSON.stringify(newWidgets));
      return { widgets: newWidgets };
    });
  },
}));
