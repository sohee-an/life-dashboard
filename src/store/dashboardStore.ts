import { create } from "zustand";
import type { Widget, WidgetType, WidgetPropsMap } from "../types/widget";

interface DashboardState {
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;

  updateWidget: <T extends WidgetType>(
    id: string,
    newProps: Partial<WidgetPropsMap[T]>
  ) => void;

  addWidget: (widget: Widget) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  widgets: JSON.parse(localStorage.getItem("widgets") || "[]"),

  setWidgets: (widgets) => {
    set({ widgets });
    localStorage.setItem("widgets", JSON.stringify(widgets));
  },

  updateWidget: (id, newProps) =>
    set((state) => {
      const updated = state.widgets.map((w) =>
        w.id === id ? { ...w, props: { ...w.props, ...newProps } } : w
      );
      localStorage.setItem("widgets", JSON.stringify(updated));
      return { widgets: updated };
    }),

  addWidget: (widget) =>
    set((state) => {
      const newWidgets = [...state.widgets, widget];
      localStorage.setItem("widgets", JSON.stringify(newWidgets));
      return { widgets: newWidgets };
    }),
}));
