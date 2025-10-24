import { Settings } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { widgetRegistry } from '../../widgets/registry/WidgetDefaultRegistry';
import Layout from '../../components/layout';
import Dashboard from './components/Dashboard';

export default function DashboardPage() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const isEditMode = useDashboardStore((s) => s.isEditMode);
  const setEditMode = useDashboardStore((s) => s.setEditMode);
  const clearAllWidgets = useDashboardStore((s) => s.clearAllWidgets);

  const handleAdd = (type: keyof typeof widgetRegistry) => {
    const id = Date.now().toString();
    const { defaults } = widgetRegistry[type];

    addWidget({
      type,
      layout: { i: id, x: 0, y: Infinity, w: 3, h: 2 },
      props: defaults,
    });
  };

  return (
    <Layout>
      <div className="p-5">
        <div className="flex gap-2 mb-4">
          {Object.entries(widgetRegistry).map(([type, { label }]) => (
            <button
              key={type}
              onClick={() => handleAdd(type as keyof typeof widgetRegistry)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              + 새 {label}
            </button>
          ))}

          {/* 편집모드 버튼 */}
          <button
            onClick={() => setEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-md border transition-colors flex gap-2 items-center ${
              isEditMode
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>{isEditMode ? '편집 종료' : '편집 모드'}</span>
          </button>

          {isEditMode && (
            <button
              onClick={clearAllWidgets}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              전체 삭제
            </button>
          )}
        </div>

        <Dashboard />
      </div>
    </Layout>
  );
}
