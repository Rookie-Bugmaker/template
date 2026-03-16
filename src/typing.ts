import type { Rule } from 'ant-design-vue/es/form';
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface';
import type { ColumnType } from 'ant-design-vue/lib/table';
import type { FilterValue } from 'ant-design-vue/lib/table/interface';
import type { Ref } from 'vue';

export type Pagination = TablePaginationConfig;
export type TableFilters = Record<string, FilterValue>;
export type TableColumn = ColumnType;
export type Breakpoint = 'xxxl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export type MaybeRef<T> = T | Ref<T>;

/**表单校验规则 */
export type FormRule<T> = {
  [key in keyof T]?: Rule[];
};
