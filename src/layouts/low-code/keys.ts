import type { InjectionKey, Ref } from 'vue';

export const groupIdInjectKey: InjectionKey<Ref<string>> = Symbol('groupId');

export const appIdInjectKey: InjectionKey<string> = Symbol('applicationId');

export const createPageFlagInjectKey: InjectionKey<Ref<boolean>> = Symbol('cratePageFlag');
