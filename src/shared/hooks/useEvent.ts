export enum EventType {
  UPDATE_SNACKBAR = 'onebox.updateSnackBar',
  UPDATE_CURRENT_USER = 'onebox.updateCurrentUser',
  ADD_BLOCK_TO_LAYOUT = 'onebox.addBlockToLayout'
}

export type EventProps = {
  trigger: (eventType: EventType, data: any) => void;
  listen: (eventType: EventType, callback: any) => void;
};

export const useEvent = (): EventProps => {
  const trigger = (eventType: EventType, data: any) => {
    typeof window !== 'undefined' &&
      document.dispatchEvent(new CustomEvent(eventType, { detail: data }));
  };
  const listen = (eventType: EventType, callback: any) => {
    typeof window !== 'undefined' &&
      document.removeEventListener(eventType, callback);
    typeof window !== 'undefined' &&
      document.addEventListener(eventType, callback);
  };

  return { trigger, listen };
};
