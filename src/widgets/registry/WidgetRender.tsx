import { widgetRegistry } from './WidgetRegistry';
import type { Widget } from './types';

export function WidgetRenderer({ widget }: { widget: Widget }) {
  const WidgetComponent =
    widgetRegistry[widget.type as keyof typeof widgetRegistry];
  if (!WidgetComponent) return <div>❓ Unknown widget type</div>;
  return <WidgetComponent {...widget.props} id={widget.id} />;
}
