import type { InjectionKey } from 'vue';
import type { PopupEditAction, PopupEditSingleContext, PopupEditMultiContext } from './typing';

export const POPUP_EDIT_STATE_KEY: InjectionKey<
  PopupEditAction<PopupEditSingleContext | PopupEditMultiContext>
> = Symbol('popup-edit-state');
