import type { TimerWidgetData } from '../implementations/timer-widget';

export type WidgetType = 'text' | 'checkbox' | 'timer';

export interface WidgetPropsMap {
  text: { content: string };
  checkbox: {
    title: string;
    checkboxes: { id: string; label: string; checked: boolean }[];
  };
  timer: TimerWidgetData;
}

export interface WidgetBase<TType extends WidgetType = WidgetType> {
  id: string;
  type: TType;
  props: WidgetPropsMap[TType];
}

export type Widget = WidgetBase<WidgetType>;
