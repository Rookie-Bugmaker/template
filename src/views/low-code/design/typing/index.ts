import { MainType, BlockType, WidgetType, WidgetGroupType } from './typing';
import { FieldType, OperatorType, OPERATOR_LIST } from './operator';

import { defaultConfig as defaultRootConfig } from './root';

import { defaultConfig as formConfig } from './block/form';
import { defaultConfig as searchFromConfig } from './block/search-form';
import {
  defaultConfig as tableConfig,
  defaultColumnConfig,
  defaultColumnActionItemConfig,
} from './block/table';
import { defaultConfig as cardConfig } from './block/card';
import { defaultConfig as tabsConfig } from './block/tabs';
import { defaultConfig as tabPaneConfig } from './block/tab-pane';
import { defaultConfig as gridConfig } from './block/grid';
import { defaultConfig as gridColConfig } from './block/grid-col';
import { defaultConfig as treeConfig } from './block/tree';

import { defaultConfig as inputConfig } from './widget/input';
import { defaultConfig as numberConfig } from './widget/number';
import { defaultConfig as buttonConfig } from './widget/button';
import { defaultConfig as textareaConfig } from './widget/textarea';
import { defaultConfig as radioConfig } from './widget/radio';
import { defaultConfig as checkboxConfig } from './widget/checkbox';
import { defaultConfig as dateConfig } from './widget/date';
import { defaultConfig as timeConfig } from './widget/time';
import { defaultConfig as selectConfig } from './widget/select';
import { defaultConfig as popeditConfig } from './widget/popedit';
import { defaultConfig as uploadFileConfig } from './widget/upload-file';
import { defaultConfig as uploadImageConfig } from './widget/upload-image';
import { defaultConfig as treeSelectConfig } from './widget/tree-select';
import { defaultConfig as passwordConfig } from './widget/password';
import { defaultConfig as userConfig } from './widget/user';
import { defaultConfig as personConfig } from './widget/person';
// import { defaultConfig as serialNumberConfig } from './widget/serial-number';
// import { defaultConfig as valueSetConfig } from './widget/value-set';
import { defaultConfig as processStatusConfig } from './widget/process-status';
import { defaultConfig as switchConfig } from './widget/switch';
// import { defaultConfig as orgConfig } from './widget/org';
import { defaultConfig as companyConfig } from './widget/company';
import { defaultConfig as deptConfig } from './widget/dept';
import { defaultConfig as dictConfig } from './widget/dict';

const defaultConfig = {
  [BlockType.Form]: formConfig,
  [BlockType.Table]: tableConfig,
  [BlockType.SearchForm]: searchFromConfig,
  [BlockType.Card]: cardConfig,
  [BlockType.Tabs]: tabsConfig,
  [BlockType.TabPane]: tabPaneConfig,
  [BlockType.Grid]: gridConfig,
  [BlockType.GridCol]: gridColConfig,
  [BlockType.Tree]: treeConfig,
  [WidgetType.Input]: inputConfig,
  [WidgetType.Textarea]: textareaConfig,
  [WidgetType.Number]: numberConfig,
  [WidgetType.Button]: buttonConfig,
  [WidgetType.Radio]: radioConfig,
  [WidgetType.Checkbox]: checkboxConfig,
  [WidgetType.Date]: dateConfig,
  [WidgetType.Time]: timeConfig,
  [WidgetType.Select]: selectConfig,
  [WidgetType.Popedit]: popeditConfig,
  [WidgetType.UploadFile]: uploadFileConfig,
  [WidgetType.UploadImage]: uploadImageConfig,
  [WidgetType.TreeSelect]: treeSelectConfig,
  [WidgetType.Password]: passwordConfig,
  [WidgetType.User]: userConfig,
  [WidgetType.Person]: personConfig,
  // [WidgetType.SerialNumber]: serialNumberConfig,
  // [WidgetType.ValueSet]: valueSetConfig,
  [WidgetType.ProcessStatus]: processStatusConfig,
  [WidgetType.Switch]: switchConfig,
  // [WidgetType.Org]: orgConfig,
  [WidgetType.Company]: companyConfig,
  [WidgetType.Dept]: deptConfig,
  [WidgetType.Dict]: dictConfig,
};

export {
  MainType,
  BlockType,
  WidgetType,
  WidgetGroupType,
  defaultConfig,
  defaultColumnConfig,
  defaultColumnActionItemConfig,
  defaultRootConfig,
  tabPaneConfig,
  gridColConfig,
  FieldType,
  OperatorType,
  OPERATOR_LIST,
};
