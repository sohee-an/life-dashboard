import React from "react";
import GridLayout, { type Layout } from "react-grid-layout"; // ✅ Layout 타입 import

import WidgetRenderer from "./widgets/WidgetRenderer";
import type { Widget } from "../types/widget";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboardStore } from "../store/dashboardStore";

export default function Dashboard() {
  const { widgets, setWidgets } = useDashboardStore();

  const layout: Layout[] = widgets.map((w) => ({ ...w.layout, i: w.id }));

  const handleLayoutChange = (newLayout: Layout[]) => {
    const updated: Widget[] = widgets.map((w) => ({
      ...w,
      layout: newLayout.find((l) => l.i === w.id) || w.layout,
    }));
    setWidgets(updated);
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={80}
      width={1200}
      onLayoutChange={handleLayoutChange}
    >
      {widgets.map((widget) => (
        <div
          key={widget.id}
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 0 4px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <WidgetRenderer widget={widget} />
        </div>
      ))}
    </GridLayout>
  );
}
