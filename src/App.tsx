import { useEffect } from 'react';
import { useDashboardStore } from './store/useDashboardStore';
import AppRouter from './router/AppRouter';

// 💡 공용 debounce (입력 중 타이머 리셋)
let idleTimer: ReturnType<typeof setTimeout> | null = null;
const debounceIdle = (fn: () => void, delay: number) => {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(fn, delay);
};

export default function App() {
  const initWidgets = useDashboardStore((s) => s.initWidgets);

  useEffect(() => {
    initWidgets();
  }, [initWidgets]);

  const persistAll = useDashboardStore((s) => s.persistAll);
  const widgets = useDashboardStore((s) => s.widgets);

  // 1️⃣ idle 기반 저장 (입력 멈추면 2초 뒤 저장)
  useEffect(() => {
    debounceIdle(() => {
      persistAll();
    }, 1000);
  }, [widgets]); // widgets이 변할 때마다 idle 타이머 reset

  // // 2️⃣ 창 닫을 때 강제 flush
  useEffect(() => {
    const handleUnload = () => {
      persistAll(); // 동기 localStorage 저장이므로 안전
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return <AppRouter />;
}
