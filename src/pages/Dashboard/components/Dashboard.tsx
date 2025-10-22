import GridLayout from "react-grid-layout";
import { WidgetRenderer } from "../../../widgets/registry/WidgetRender";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useWidgetLayoutSync } from "../../../hooks/useWidgetLayoutSync";

export default function Dashboard() {
  const { widgetArray, handleLayoutChange } = useWidgetLayoutSync();

  const layout = widgetArray.map((w) => ({ ...w.layout, i: w.id }));

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={80}
      width={1200}
      onLayoutChange={handleLayoutChange}
      draggableCancel=".no-drag"
    >
      {widgetArray.map((widget) => (
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
