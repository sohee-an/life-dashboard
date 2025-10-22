import { useEffect } from 'react';
import { useDashboardStore } from './store/useDashboardStore';
import AppRouter from './router/AppRouter';

export default function App() {
  const initWidgets = useDashboardStore((s) => s.initWidgets);

  useEffect(() => {
    initWidgets();
  }, [initWidgets]);

  return <AppRouter />;
}
