export function debounce(callback: Function, wait: number) {
  let timeoutId: number | undefined;
  return (...args: any[]) => {
    if (!window) return;
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      // eslint-disable-next-line n/no-callback-literal
      callback(...args);
    }, wait);
  };
}
