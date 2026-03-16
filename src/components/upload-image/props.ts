import type { ButtonType } from 'ant-design-vue/es/button';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
/**上传图片属性 */
export interface Props {
  /**文件头ID */
  value: string;
  /**是否禁用 */
  disabled?: boolean;
  /**是否多图片 */
  multiple?: boolean;
  /**类型
   * button-按钮
   * priview-预览图
   * dialog-按钮弹出
   */
  type?: 'button' | 'preview' | 'dialog';
  /**是否可以拖拽上传 */
  dragModal?: boolean;
  /**允许上传的图片类型 */
  accept?: string;
  /**图片大小限制-kb */
  maxFileSize?: number;
  /**最多上传数量 */
  maxUpload?: number;
  /**是否隐藏按钮文字 */
  miniSelectBtn?: boolean;
  /**尺寸 */
  size?: SizeType;
  /**展示图片宽度-单位px */
  width?: number;
  /**展示图片高度-单位px */
  height?: number;
  /**不接受文件类型 */
  unAccept?: string;
  /**type=dialog 按钮类型 */
  buttonType?: ButtonType;
  /**type=dialog 按钮文本 */
  buttonText?: {
    /**上传按钮 */
    upload: string;
    /**查看按钮 */
    view: string;
  };
}

type NativeType = null | number | string | boolean;
type InferDefault<P, T> = ((props: P) => T) | (T extends NativeType ? T : never);

export type InferVueDefaults<T> = {
  [K in keyof T]?: InferDefault<T, T[K]>;
};

/**默认属性 */
export const defaultProps: InferVueDefaults<Props> = {
  accept: 'image/*',
  maxFileSize: 1024 * 150,
  maxUpload: 0,
  size: 'middle',
  width: 160,
  height: 160,
  // buttonType: 'primary',
  buttonText: () => ({ upload: '上传图片', view: '查看图片' }),
};
