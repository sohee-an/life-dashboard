import { useEffect } from "react";
import { useDashboardStore } from "./store/useDashboardStore";
import Dashboard from "./components/Dashboard";

export default function App() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const isEditMode = useDashboardStore((s) => s.isEditMode);
  const setEditMode = useDashboardStore((s) => s.setEditMode);
  const initWidgets = useDashboardStore((s) => s.initWidgets);
  const clearAllWidgets = useDashboardStore((s) => s.clearAllWidgets);

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
  const handleAllDelet = () => {
    if (confirm("모든 위젯을 삭제하시겠습니까?")) {
      clearAllWidgets();
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl mb-2 text-customRed">📊 Life Dashboard</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + 새 텍스트 위젯
        </button>

        <button
          onClick={() => setEditMode(!isEditMode)}
          className={`px-4 py-2 rounded-md border transition-colors ${
            isEditMode
              ? "bg-red-600 text-white border-red-600"
              : "bg-gray-600 text-white border-gray-600 hover:bg-gray-700"
          }`}
        >
          {isEditMode ? "편집 종료" : "편집 모드"}
        </button>
        {isEditMode && (
          <button
            onClick={handleAllDelet}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            전체 삭제
          </button>
        )}
      </div>

      <Dashboard />
    </div>
  );
}
