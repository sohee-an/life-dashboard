import TextWidget from "./TextWidget";
import type { Widget } from "../../types/widget";

export default function WidgetRenderer({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case "text":
      return <TextWidget id={widget.id} content={widget.props.content} />;

    default:
      return <div>❓ Unknown widget type</div>;
  }
}
