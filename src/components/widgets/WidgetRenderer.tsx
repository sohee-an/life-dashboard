import TextWidget from "./TextWidget";
import type { Widget } from "../../types/widget";
import CheckboxWidget from "./CheckboxWidget";

export default function WidgetRenderer({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case "text":
      return <TextWidget id={widget.id} content={widget.props.content} />;
    case "checkbox":
      return <CheckboxWidget id={widget.id} {...widget.props} />;
    default:
      return <div>❓ Unknown widget type</div>;
  }
}
