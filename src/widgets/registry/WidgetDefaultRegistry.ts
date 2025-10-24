import { TextWidgetDefaults } from '../implementations/text-widget/defaults';
import { CheckboxWidgetDefaults } from '../implementations/checkbox-widget/defaults';
import { TimerWidgetDefaults } from '../implementations/timer-widget';

export const widgetDefaults = {
  text: TextWidgetDefaults,
  checkbox: CheckboxWidgetDefaults,
};
export const widgetRegistry = {
  text: {
    label: '메모',
    defaults: TextWidgetDefaults,
  },
  checkbox: {
    label: '할 일',
    defaults: CheckboxWidgetDefaults,
  },
  timer: {
    label: '타이머',
    defaults: TimerWidgetDefaults,
  },
} as const;

export type WidgetType = keyof typeof widgetRegistry;
