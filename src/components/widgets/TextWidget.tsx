import { useState, useEffect } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import { MoreVertical, X } from "lucide-react";

export default function TextWidget({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  const updateWidget = useDashboardStore((s) => s.updateWidget);
  const deleteWidget = useDashboardStore((s) => s.deleteWidget);
  const isEditMode = useDashboardStore((s) => s.isEditMode);

  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localContent, setLocalContent] = useState(content);

  // 외부 변경 동기화
  useEffect(() => setLocalContent(content), [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  };

  const handleBlur = () => {
    updateWidget(id, { props: { content: localContent } });
  };

  return (
    <div
      className={`relative flex flex-col w-full h-full rounded-lg bg-gray-50 shadow-sm transition-transform
        ${isEditMode ? "animate-wiggle" : ""}
      `}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setMenuOpen(false);
      }}
    >
      <textarea
        value={localContent}
        onChange={handleChange}
        onBlur={handleBlur}
        className=" flex-1 w-full h-full resize-none border-none outline-none p-3 text-base text-black bg-gray-50"
        placeholder="내용을 입력하세요..."
      />

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
