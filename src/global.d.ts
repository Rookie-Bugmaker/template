/* eslint-disable @typescript-eslint/consistent-type-imports */
/**
 *  此文件注册全局组件类型定义
 */
import type { AnchorHTMLAttributes as InnerAnchorHTMLAttributes } from 'vue';
declare module 'vue' {
  export interface GlobalComponents {
    RouterView: typeof import('vue-router')['RouterView'];
    RouterLink: typeof import('vue-router')['RouterLink'];
    Component: import('vue').Component<{
      is: any;
    }>;
    STable: typeof import('@surely-vue/table')['STable'];
    STableColumn: typeof import('@surely-vue/table')['STableColumn'];
    STableColumnGroup: typeof import('@surely-vue/table')['STableColumnGroup'];
    STableSummary: typeof import('@surely-vue/table')['STableSummary'];
    STableSummaryCell: typeof import('@surely-vue/table')['STableSummaryCell'];
    STableSummaryRow: typeof import('@surely-vue/table')['STableSummaryRow'];
  }
  export interface ComponentCustomProperties {
    document?: Document;
  }
  interface AnchorHTMLAttributes extends InnerAnchorHTMLAttributes {
    disabled?: boolean;
  }
}

declare global {
  /**
   * 实体类基本属性
   */
  interface BaseEntity {
    /** 创建人ID */
    createBy?: string;
    /** 更新人ID */
    updateBy?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 创建人名称 */
    createPerson?: string;
    /** 更新人名称 */
    updatePerson?: string;
  }

  /**状态 */
  type BaseStatus = 'Y' | 'N';

  /**统一分页参数 */
  interface PageParams {
    /**页码 */
    page?: number;
    /**偏移量 */
    pageSize?: number;
  }

  //返回普通结构
  interface ResponseBody<T = any> {
    code: number;
    message: string;
    success: boolean; //请求状态true/false
    result: T;
  }

  //分页信息结构
  interface PageResult<T = any> {
    page: number; //分页页码
    pageSize: number; //偏移量
    offset?: number;
    endset?: number;
    total: number;
    rows: T[];
    [key: string]: any;
  }
}
export {};
