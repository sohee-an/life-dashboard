import type { Layout } from "react-grid-layout";

export type WidgetType = "text" | "budget" | "chart" | "checkbox";

export interface WidgetPropsMap {
  text: { content: string };
  budget: { amount: number; category: string };
  chart: { data: number[]; color: string };
  checkbox: {
    title: string;
    checkboxes: { id: string; label: string; checked: boolean }[];
  };
}

export interface WidgetBase {
  id: string;
  type: WidgetType;
  layout: Layout;
  created_at?: string;
  updated_at?: string;
}

export type Widget<T extends WidgetType = WidgetType> = WidgetBase & {
  props: WidgetPropsMap[T];
};

// export type Layout = {
//   i: string;
//   x: number;
//   y: number;
//   w: number;
//   h: number;
// };

// export type Widget =
//   | {
//       id: string;
//       type: "text";
//       layout: Layout;
//       props: { content: string };
//     }
//   | {
//       id: string;
//       type: "budget";
//       layout: Layout;
//       props: { amount: number; category: string };
//     }
//   | {
//       id: string;
//       type: "chart";
//       layout: Layout;
//       props: { data: number[]; color: string };
//     };
