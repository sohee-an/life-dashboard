import { useState, useEffect, type ChangeEvent } from "react";
import { useDashboardStore } from "../../../store/useDashboardStore";
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

  // 외부 변경 동기화
  useEffect(() => setLocalContent({ title, checkboxes }), [title, checkboxes]);

  /**  체크박스 상태 (자주 바뀜 → 디바운스 저장) */
  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const targetId = e.target.name;
    const checked = e.target.checked;

    const updatedCheckboxes = localContent.checkboxes.map((cb) =>
      cb.id === targetId ? { ...cb, checked } : cb
    );

    const updated = { ...localContent, checkboxes: updatedCheckboxes };
    setLocalContent(updated);

    updateWidgetProps(id, updated);
  };

  /** 위젯 제목 (onBlur 시 저장 - 자주 바뀌지않을거 같아서) */
  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalContent((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleBlurTitle = () => {
    updateWidgetProps(id, { title: localContent.title });
  };

  /**  개별 label 수정 (onBlur 시 저장-자주 바뀌지않을거 같아서) */
  const handleLabelChange = (
    e: ChangeEvent<HTMLInputElement>,
    targetId: string
  ) => {
    const newLabel = e.target.value;
    setLocalContent((prev) => ({
      ...prev,
      checkboxes: prev.checkboxes.map((cb) =>
        cb.id === targetId ? { ...cb, label: newLabel } : cb
      ),
    }));
  };

  const handleBlurLabel = (targetId: string) => {
    const updated = localContent.checkboxes.find((cb) => cb.id === targetId);
    if (updated) updateWidgetProps(id, { checkboxes: localContent.checkboxes });
  };

  /**  체크박스 추가 (즉시 저장) */
  const addCheckbox = () => {
    const newCheckbox = {
      id: crypto.randomUUID(),
      label: "새로운 할 일",
      checked: false,
    };
    const updated = {
      ...localContent,
      checkboxes: [...localContent.checkboxes, newCheckbox],
    };
    setLocalContent(updated);
    updateWidgetProps(id, updated);
  };

  /**  체크박스 삭제 (즉시 저장) */
  const deleteCheckbox = (targetId: string) => {
    const updated = {
      ...localContent,
      checkboxes: localContent.checkboxes.filter((cb) => cb.id !== targetId),
    };
    setLocalContent(updated);
    updateWidgetProps(id, updated);
  };

  return (
    <div
      className={clsx(
        "text-black p-4 relative flex flex-col w-full h-full rounded-lg shadow-sm transition-all duration-200",
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
        onBlur={handleBlurTitle}
        value={localContent.title}
        onChange={handleChangeTitle}
        className="font-semibold mb-1"
      />
      <div
        className={clsx(
          "flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-hide group-hover:scrollbar-default"
        )}
      >
        {localContent.checkboxes.map((check) => (
          <div
            key={check.id}
            className="flex gap-2 no-drag items-center group"
            id={check.id}
          >
            <input
              id={check.id}
              className="w-4 h-4 cursor-pointer"
              checked={check.checked}
              type="checkbox"
              name={check.id}
              onChange={handleCheckbox}
            />
            <input
              className="border-b border-transparent focus:border-gray-400 outline-none flex-1"
              value={check.label}
              onChange={(e) => handleLabelChange(e, check.id)}
              onBlur={() => handleBlurLabel(check.id)}
            />

            <button
              onClick={() => deleteCheckbox(check.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-black transition text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="no-drag flex items-center justify-center pt-2">
        <button
          onClick={addCheckbox}
          className="no-drag text-gray-400 border-gray-400 border w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
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

      {/* 🔹 위젯 메뉴 */}
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
