// export type WidgetType = "text" | "budget" | "chart";

// export interface WidgetPropsMap {
//   text: { content: string };
//   budget: { amount: number; category: string };
//   chart: { data: number[]; color: string };
// }

// // Widget 제네릭화
// export interface Widget<T extends WidgetType = WidgetType> {
//   id: string;
//   type: T;
//   layout: {
//     i: string;
//     x: number;
//     y: number;
//     w: number;
//     h: number;
//   };
//   props: WidgetPropsMap[T];
// }
export type Layout = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Widget =
  | {
      id: string;
      type: "text";
      layout: Layout;
      props: { content: string };
    }
  | {
      id: string;
      type: "budget";
      layout: Layout;
      props: { amount: number; category: string };
    }
  | {
      id: string;
      type: "chart";
      layout: Layout;
      props: { data: number[]; color: string };
    };
