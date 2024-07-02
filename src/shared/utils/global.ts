declare global {
  interface Window {
    notificationTimeout?: ReturnType<typeof setTimeout>;
  }
}
export {};
