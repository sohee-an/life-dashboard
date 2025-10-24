import { useEffect, useRef } from 'react';
import { useDashboardStore } from '../../../store/useDashboardStore';
import { WidgetFrame } from '../../components/WidgetFrame';

export function TextWidget({ id, content }: { id: string; content: string }) {
  const commitWidgetProps = useDashboardStore((s) => s.commitWidgetProps);
  const ref = useRef<HTMLTextAreaElement>(null);

  // 초기값 반영
  useEffect(() => {
    if (ref.current) ref.current.value = content;
  }, [content]);

  // 입력 멈추면 저장
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleInput = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (ref.current) {
          commitWidgetProps(id, { content: ref.current.value });
          console.log('hi');
        }
      }, 1000);
    };

    const el = ref.current;
    el?.addEventListener('input', handleInput);
    return () => {
      el?.removeEventListener('input', handleInput);
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <WidgetFrame id={id}>
      <textarea
        ref={ref}
        defaultValue={content}
        className="no-drag flex-1 w-full h-full resize-none border-none outline-none p-3 text-base rounded-lg
                   text-black bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
        placeholder="내용을 입력하세요..."
      />
    </WidgetFrame>
  );
}
