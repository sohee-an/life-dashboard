import { useDashboardStore } from "../../store/dashboardStore";

export default function TextWidget({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  const updateWidget = useDashboardStore((s) => s.updateWidget);

  return (
    <textarea
      value={content}
      onChange={(e) => updateWidget(id, { content: e.target.value })}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        resize: "none",
        padding: 12,
        background: "#f9fafb",
        borderRadius: 8,
        fontSize: "1rem",
        outline: "none",
        color: "black",
      }}
    />
  );
}
