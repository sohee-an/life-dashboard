export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  //flush: 아직 실행 안 된 타이머 즉시 실행
  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      func(); // 바로 실행
      timeout = null;
    }
  };

  //cancel: 타이머 취소
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
