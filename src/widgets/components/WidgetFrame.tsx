import { useState } from "react";
import { X, MoreVertical } from "lucide-react";
import clsx from "clsx";
import { useDashboardStore } from "../../store/useDashboardStore";

type WidgetFrameProps = {
  id: string;
  children: React.ReactNode;
};

export function WidgetFrame({ id, children }: WidgetFrameProps) {
  const deleteWidget = useDashboardStore((s) => s.deleteWidget);
  const isEditMode = useDashboardStore((s) => s.isEditMode);

  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={clsx(
        "relative w-full h-full p-2 rounded-lg shadow-sm transition-all duration-200",
        hover ? "bg-gray-100" : "bg-white",
        isEditMode && "animate-wiggle"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setMenuOpen(false);
      }}
    >
      {children}

      {/* 편집 모드일 때: 삭제 버튼 */}
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
            className="no-drag block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
