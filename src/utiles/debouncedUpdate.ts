import { debounce } from "./debounce";
import { useDashboardStore } from "../store/useDashboardStore";

import type { Layout } from "react-grid-layout";

// 각 type별 업데이트 로직을 미리 정의
const updateHandlers = {
  layout: (
    state: ReturnType<typeof useDashboardStore.getState>,
    id: string,
    payload: Layout
  ) => state.updateWidget(id, { layout: payload }),

  props: (
    state: ReturnType<typeof useDashboardStore.getState>,
    id: string,
    payload: any
  ) => state.updateWidget(id, { props: payload }),
};

// 공용 디바운스 업데이트
export const debouncedUpdate = debounce(
  (id: string, type: keyof typeof updateHandlers, payload: any) => {
    const state = useDashboardStore.getState();
    const handler = updateHandlers[type];
    if (!handler) {
      console.warn(`⚠️ Unknown update type: ${type}`);
      return;
    }
    handler(state, id, payload);
  },
  800
);
