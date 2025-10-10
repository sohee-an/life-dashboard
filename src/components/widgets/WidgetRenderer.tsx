import React from "react";
import TextWidget from "./TextWidget";
import type { Widget } from "../../types/widget";

export default function WidgetRenderer<T extends Widget["type"]>({
  widget,
}: {
  widget: Widget<T>;
}) {
  switch (widget.type) {
    // case "text":
    //   return <TextWidget id={widget.id} content={widget.props.content} />;
    case "text": {
      const w = widget as Widget<"text">;
      return <TextWidget id={w.id} content={w.props.content} />;
    }
    default:
      return <div>❓ Unknown widget type</div>;
  }
}
