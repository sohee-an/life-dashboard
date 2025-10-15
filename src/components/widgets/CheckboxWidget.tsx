import { useState, useEffect, type ChangeEvent } from "react";
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
  const [localContent, setLocalContent] = useState({ title, checkboxes });

  //   // 외부 변경 동기화
  useEffect(() => setLocalContent({ title, checkboxes }), [title, checkboxes]);

  const handleBlur = () => {
    updateWidgetProps(id, localContent);
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const targetId = e.target.name;
    const checked = e.target.checked;

    // 체크박스 배열 업데이트
    const updatedCheckboxes = localContent.checkboxes.map((cb) =>
      cb.id === targetId ? { ...cb, checked } : cb
    );

    // 로컬 상태 갱신
    const updated = { ...localContent, checkboxes: updatedCheckboxes };
    setLocalContent((prev) => ({ ...prev, updated }));

    updateWidgetProps(id, updated);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalContent((prev) => ({
      ...prev,
      title: e.target.value,
    }));
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
      <input
        onBlur={handleBlur}
        value={localContent.title}
        onChange={handleChangeTitle}
      />
      {checkboxes.map((check) => {
        return (
          <div className="flex gap-2 no-drag items-center " id={check.id}>
            <input
              id={check.id}
              className="w-4 h-4  cursor-pointer"
              checked={check.checked}
              type="checkbox"
              name={check.id}
              onChange={handleCheckbox}
            />
            <input value={check.label} />
          </div>
        );
      })}
      <div className=" no-drag flex items-center justify-center pt-2">
        <button className="border-gray-400 border w-6 h-6 flex items-center justify-center ">
          +
        </button>
      </div>

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
