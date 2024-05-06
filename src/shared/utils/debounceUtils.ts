let timer: ReturnType<typeof setTimeout>;
export const debounce = (func: any, timeout = 300) => {
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
