export enum EventType {
  UPDATE_SNACKBAR = 'onebox.updateSnackBar',
  UPDATE_CURRENT_USER = 'onebox.updateCurrentUser',
  EDIT_COMPONENT = 'onebox.editComponent',
  ADD_BLOCK_TO_LAYOUT = 'onebox.addBlockToLayout',
  UPDATE_BLOCK_ON_LAYOUT = 'onebox.updateBlockOnLayout',
  UPDATE_FILTER_ON_BLOCK = 'onebox.updateFilterOnBlock'
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
