import Dashboard from './components/Dashboard';
import Layout from '../../components/layout';
import { Settings } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { MENU_TAB } from '../../constants/menuTab';
import { widgetDefaults } from '../../widgets/registry/WidgetDefaultRegistry';

export default function DashboardPage() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const isEditMode = useDashboardStore((s) => s.isEditMode);
  const setEditMode = useDashboardStore((s) => s.setEditMode);
  const clearAllWidgets = useDashboardStore((s) => s.clearAllWidgets);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = Date.now().toString();
    const type = e.currentTarget.name as keyof typeof widgetDefaults;

    const defaults = widgetDefaults[type];
    if (!defaults) return;

    addWidget({
      type,
      layout: { i: id, x: 0, y: Infinity, w: 3, h: 2 },
      props: defaults,
    });
  };

  const handleAllDelete = () => {
    if (confirm('모든 위젯을 삭제하시겠습니까?')) clearAllWidgets();
  };

  return (
    <Layout>
      <div className="p-5">
        <div className="flex gap-2 mb-4">
          {MENU_TAB.map((menu) => (
            <button
              key={menu.id}
              name={menu.type}
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              + 새 {menu.value}
            </button>
          ))}

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
              onClick={handleAllDelete}
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
