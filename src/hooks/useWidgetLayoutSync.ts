import { useDashboardStore } from "../store/useDashboardStore";
import { type Layout } from "react-grid-layout";

// 다시 타입스크립트 보기
//  빠른 이동 시 저장 과부하 방지용 디바운스 유틸
// function debounce<T extends (...args: unknown[]) => void>(
//   fn: T,
//   delay: number
// ): (...args: Parameters<T>) => void {
//   let timer: ReturnType<typeof setTimeout>;
//   return (...args: Parameters<T>) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// }
type Proc<Args extends unknown[]> = (...args: Args) => void;

function debounce<Args extends unknown[]>(
  fn: Proc<Args>,
  delay: number
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
//x, y가 바뀌면 → 위치 이동
//w, h가 바뀌면 → 크기 변경
export function useWidgetLayoutSync() {
  const { widgets } = useDashboardStore();
  const updateWidgetLayout = useDashboardStore((s) => s.updateWidgetLayout);

  const widgetArray = Object.values(widgets);

  const handleLayoutChange = debounce((newLayout: Layout[]) => {
    const layoutMap = new Map(newLayout.map((l) => [l.i, l]));

    widgetArray.forEach((w) => {
      const next = layoutMap.get(w.id);
      if (!next) return;

      if (
        next.x !== w.layout.x ||
        next.y !== w.layout.y ||
        next.w !== w.layout.w ||
        next.h !== w.layout.h
      ) {
        updateWidgetLayout(w.id, next);
      }
    });
  }, 500);

  return { widgetArray, handleLayoutChange };
}
