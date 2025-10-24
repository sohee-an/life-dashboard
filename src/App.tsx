import { useEffect } from 'react';
import { useDashboardStore } from './store/useDashboardStore';
import AppRouter from './router/AppRouter';

export default function App() {
  const initWidgets = useDashboardStore((s) => s.initWidgets);

  useEffect(() => {
    initWidgets();
  }, [initWidgets]);

  const persistAll = useDashboardStore((s) => s.persistAll);

  //  창 닫을 때 강제 flush
  useEffect(() => {
    const handleUnload = () => {
      persistAll();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return <AppRouter />;
}
