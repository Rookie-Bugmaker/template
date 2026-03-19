import type { InjectionKey } from 'vue';

export const designerStateInjectKey: InjectionKey<any> = Symbol('designerState');

export const designerStateFnInjectKey: InjectionKey<any> = Symbol('designerStateFn');

export const TABLE_COLUMN_ACTION_KEY = 'customTableColumnActions';

export const TABLE_COLUMN_ROW_INDEX_KEY = 'customTableColumnRowIndex';
