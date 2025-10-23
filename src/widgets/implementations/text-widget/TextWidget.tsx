import { useDashboardStore } from '../../../store/useDashboardStore';
import { WidgetFrame } from '../../components/WidgetFrame';

function TextWidget({ id }: { id: string; content: string }) {
  const updateWidgetProps = useDashboardStore((s) => s.updateWidgetProps);

  const content = useDashboardStore(
    (s) => s.widgets[id]?.props?.content ?? ''
    // shallow
  );

  return (
    <WidgetFrame id={id}>
      <textarea
        value={content}
        onChange={(e) => updateWidgetProps(id, { content: e.target.value })}
        // onBlur={handleBlur}
        className="no-drag flex-1 w-full h-full resize-none border-none outline-none p-3 text-base rounded-lg
                   text-black bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
        placeholder="내용을 입력하세요..."
      />
    </WidgetFrame>
  );
}
export { TextWidget };
