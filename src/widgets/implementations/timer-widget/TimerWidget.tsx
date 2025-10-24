import { useEffect, useRef, useState } from 'react';
import { WidgetFrame } from '../../components/WidgetFrame';
import type { TimerWidgetData } from './schema';

type Props = { id: string } & TimerWidgetData;

export function TimerWidget({ id, duration }: Props) {
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 타이머 작동
  useEffect(() => {
    if (isRunning && remaining > 0) {
      timerRef.current = setInterval(() => {
        setRemaining((r) => Math.max(r - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [isRunning]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePreset = (min: number) => {
    setIsRunning(false);
    setRemaining(min * 60);
  };

  const handleCustomSubmit = () => {
    const min = parseInt(customMinutes, 10);
    if (isNaN(min) || min <= 0) return alert('올바른 시간을 입력해주세요!');
    setIsRunning(false);
    setRemaining(min * 60);
    setCustomMode(false);
    setCustomMinutes('');
  };

  return (
    <WidgetFrame id={id}>
      <div className="text-gray-500 flex flex-col items-center justify-center h-full">
        {/* 프리셋 선택 */}
        <div className="no-drag flex gap-2 mb-4">
          {[5, 10, 15].map((min) => (
            <button
              key={min}
              onClick={() => handlePreset(min)}
              className="px-2 py-1 border rounded-md text-sm hover:bg-gray-100"
            >
              {min}분
            </button>
          ))}
          <button
            onClick={() => setCustomMode(!customMode)}
            className="px-2 py-1 border rounded-md text-sm hover:bg-gray-100"
          >
            직접입력
          </button>
        </div>

        {/* <div className="text-3xl font-bold mb-3">
          {remaining > 0 ? formatTime(remaining) : '✨ 수고했어요 ✨'}
        </div> */}

        {/* 직접입력 모드 */}
        {customMode ? (
          <div className="no-drag flex gap-2 mb-4">
            <input
              type="number"
              min={1}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="w-20 border px-2 py-1 rounded-md text-center"
              placeholder="분"
            />
            <button
              onClick={handleCustomSubmit}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              설정
            </button>
          </div>
        ) : (
          <div className="text-3xl font-bold mb-3">
            {remaining > 0 ? formatTime(remaining) : '✨ 수고했어요 ✨'}
          </div>
        )}

        {/* 타이머 컨트롤 */}
        <div className="no-drag flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isRunning ? '⏸ 일시정지' : '▶️ 시작'}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setRemaining(duration);
            }}
            className="px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400"
          >
            🔄 리셋
          </button>
        </div>
      </div>
    </WidgetFrame>
  );
}
