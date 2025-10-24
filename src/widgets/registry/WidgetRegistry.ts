import { TextWidget } from '../implementations/text-widget';
import CheckboxWidget from '../implementations/checkbox-widget/CheckboxWidget';
import { TimerWidget } from '../implementations/timer-widget';
// import { ExpenseWidget } from '../implementations/expense-widget';
// import { TimerWidget } from '../implementations/timer-widget';

import type { WidgetType } from './types';

export const widgetRegistry: Record<WidgetType, React.ComponentType<any>> = {
  text: TextWidget,
  checkbox: CheckboxWidget,
  timer: TimerWidget,
  //   expense: ExpenseWidget,
  //   timer: TimerWidget,
};
