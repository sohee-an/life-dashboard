import { useState, useEffect } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import { MoreVertical } from "lucide-react";

export default function TextWidget({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  const updateWidget = useDashboardStore((s) => s.updateWidget);
  const deleteWidget = useDashboardStore((s) => s.deleteWidget);
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [localContent, setLocalContent] = useState(content);

  // 외부 content 변경 → 로컬 상태 동기화 (초기화 or 다른 기기에서 수정된 경우)
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  };

  const handleBlur = () => {
    updateWidget(id, { props: { content: localContent } });
  };

  return (
    <div
      className="relative flex flex-col w-full h-full rounded-lg bg-gray-50 shadow-sm"
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

      {hover && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className="bg-white no-drag absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {menuOpen && (
        <div className="absolute no-drag right-2 top-8 bg-white border border-gray-200 shadow-md rounded-md text-sm z-10">
          <button
            onClick={() => deleteWidget(id)}
            className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
