import { useEffect } from "react";

import Dashboard from "./components/Dashboard";
import { useDashboardStore } from "./store/useDashboardStore";

export default function App() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const { initWidgets } = useDashboardStore();

  useEffect(() => {
    initWidgets();
  }, [initWidgets]);

  const handleAdd = () => {
    const id = Date.now().toString();
    addWidget({
      type: "text",
      layout: { i: id, x: 0, y: Infinity, w: 3, h: 2 },
      props: { content: "새 메모" },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Life Dashboard</h1>
      <button
        onClick={handleAdd}
        style={{
          marginBottom: 16,
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        + 새 텍스트 위젯
      </button>

      <Dashboard />
    </div>
  );
}
