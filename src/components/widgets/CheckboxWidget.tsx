import { useState, useEffect } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import { MoreVertical, X } from "lucide-react";
import clsx from "clsx";

type CheckboxWidgetProps = {
  id: string;
  title: string;
  checkboxes: { id: string; label: string; checked: boolean }[];
};

export default function CheckboxWidget({
  id,
  title,
  checkboxes,
}: CheckboxWidgetProps) {
  const updateWidgetProps = useDashboardStore((s) => s.updateWidgetProps);
  const deleteWidget = useDashboardStore((s) => s.deleteWidget);
  const isEditMode = useDashboardStore((s) => s.isEditMode);

  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localContent, setLocalContent] = useState({});

  //   // 외부 변경 동기화
  //   useEffect(() => setLocalContent(content), [content]);

  //   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //     setLocalContent(e.target.value);
  //   };

  //   const handleBlur = () => {
  //     updateWidgetProps(id, { content: localContent });
  //   };

  const handleCheckbox = () => {
     updateWidgetProps(id, { content: localContent });
  };

  return (
    <div
      className={clsx(
        "text-black p-2 relative flex flex-col w-full h-full rounded-lg shadow-sm transition-all duration-200",
        isEditMode && "animate-wiggle",
        hover ? "bg-red-300 cursor-grab" : "bg-gray-50"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setMenuOpen(false);
      }}
    >
      <input value={title} />
      {checkboxes.map((check) => {
        return (
          <div className="flex gap-2 no-drag items-center " id={check.id}>
            <input
              className="w-4 h-4  cursor-pointer"
              checked={check.checked}
              type="checkbox"
              onChange={handleCheckbox}
            />
            <input value={check.label} />
          </div>
        );
      })}
      {isEditMode ? (
        <button
          onClick={() => deleteWidget(id)}
          className="no-drag absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-100 transition"
        >
          <X className="text-red-500 w-4 h-4" />
        </button>
      ) : (
        hover && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="no-drag absolute top-2 right-2 bg-white border border-gray-300 rounded-md p-1 hover:bg-gray-100 transition"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        )
      )}

      {/* 메뉴 */}
      {menuOpen && !isEditMode && (
        <div className="absolute right-2 top-8 bg-white border border-gray-200 shadow-md rounded-md text-sm z-10">
          <button
            onClick={() => deleteWidget(id)}
            className="no-drag block px-4 py-2 w-full text-left text-red-500 border-t border-gray-200 hover:bg-gray-100"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
