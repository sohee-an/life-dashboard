export type WidgetType = "text" | "budget" | "chart";

export interface WidgetPropsMap {
  text: { content: string };
  budget: { amount: number; category: string };
  chart: { data: number[]; color: string };
}

// Widget 제네릭화
export interface Widget<T extends WidgetType = WidgetType> {
  id: string;
  type: T;
  layout: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  props: WidgetPropsMap[T];
}
