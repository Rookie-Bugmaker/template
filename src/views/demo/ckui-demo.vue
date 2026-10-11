<template>
  <!--
    CRRC UI 组件库 Demo 页面
    展示所有 CRRC UI 组件的用法和视觉效果。
    路由：/ckui-demo
  -->
  <div class="ckui-demo" :data-theme="currentTheme">
    <!-- ========== 页面顶部：主题切换 + 标题 ========== -->
    <header class="ckui-demo__header">
      <div class="ckui-demo__header-inner">
        <div>
          <h1 class="ckui-demo__title">CRRC UI 组件库</h1>
          <p class="ckui-demo__subtitle">基于 ant-design-vue 封装的企业级中后台组件库</p>
        </div>
        <div class="ckui-demo__theme-switch">
          <span class="ckui-demo__theme-label">主题切换：</span>
          <a-radio-group v-model:value="currentTheme" button-style="solid" size="small">
            <a-radio-button value="blue">蓝色主题</a-radio-button>
            <a-radio-button value="red">红色主题</a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </header>

    <main class="ckui-demo__main">
      <!-- ========== 左侧导航 ========== -->
      <aside class="ckui-demo__sidebar">
        <a
          v-for="section in sections"
          :key="section.id"
          :href="`#${section.id}`"
          class="ckui-demo__nav-link"
        >
          {{ section.label }}
        </a>
      </aside>

      <!-- ========== 右侧内容区 ========== -->
      <div class="ckui-demo__content">
        <!-- ========================================
          1. Button 按钮
          ======================================== -->
        <section id="button" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">1. Button 按钮</h2>
          <p class="ckui-demo__desc">
            用于触发即时操作，支持主按钮 / 次按钮 / 文字 / 虚线 / 危险 / 链接六种类型。
          </p>

          <CkCard title="按钮类型" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkButton type="primary">主按钮</CkButton>
              <CkButton type="secondary">次按钮</CkButton>
              <CkButton type="text">文字按钮</CkButton>
              <CkButton type="dashed">虚线按钮</CkButton>
              <CkButton type="danger">危险按钮</CkButton>
              <CkButton type="link">链接按钮</CkButton>
            </div>
          </CkCard>

          <CkCard title="按钮尺寸" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkButton type="primary" size="large">大尺寸</CkButton>
              <CkButton type="primary" size="middle">默认尺寸</CkButton>
              <CkButton type="primary" size="small">小尺寸</CkButton>
            </div>
          </CkCard>

          <CkCard title="按钮状态" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkButton type="primary" :loading="true">加载中</CkButton>
              <CkButton type="primary" :disabled="true">禁用态</CkButton>
              <CkButton type="primary" block>块级按钮（block）</CkButton>
            </div>
          </CkCard>
        </section>

        <!-- ========================================
          2. Input 输入框
          ======================================== -->
        <section id="input" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">2. Input 输入框</h2>
          <p class="ckui-demo__desc">基础文本输入，支持前缀/后缀图标、可清除、密码框、文本域。</p>

          <CkCard title="基础用法" class="ckui-demo__card">
            <div class="ckui-demo__form">
              <CkInput v-model:value="inputVal" placeholder="请输入内容" allow-clear />
              <CkInput v-model:value="inputVal" placeholder="禁用状态" :disabled="true" />
              <CkInput v-model:value="inputVal" placeholder="大尺寸" size="large" />
              <CkInput v-model:value="inputVal" placeholder="小尺寸" size="small" />
            </div>
          </CkCard>

          <CkCard title="校验状态" class="ckui-demo__card">
            <div class="ckui-demo__form">
              <CkInput
                v-model:value="inputVal"
                status="error"
                feedback="此项为必填项，不能为空"
                placeholder="错误状态"
              />
              <CkInput
                v-model:value="inputVal"
                status="success"
                feedback="校验通过"
                placeholder="成功状态"
              />
            </div>
          </CkCard>

          <CkCard title="文本域" class="ckui-demo__card">
            <CkInput
              v-model:value="textareaVal"
              type="textarea"
              :rows="3"
              placeholder="请输入详细描述..."
            />
          </CkCard>
        </section>

        <!-- ========================================
          3. Select 选择器
          ======================================== -->
        <section id="select" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">3. Select 选择器</h2>
          <p class="ckui-demo__desc">下拉选择器，支持单选 / 多选 / 可搜索。</p>

          <CkCard title="基础用法" class="ckui-demo__card">
            <div class="ckui-demo__form">
              <CkSelect
                v-model:value="selectVal"
                :options="selectOptions"
                placeholder="请选择一个选项"
                style="width: 280px"
              />
              <CkSelect
                v-model:value="selectMultiVal"
                mode="multiple"
                :options="selectOptions"
                placeholder="多选模式"
                style="width: 320px"
              />
              <CkSelect
                v-model:value="selectSearchVal"
                show-search
                :options="selectOptions"
                placeholder="可搜索选择器"
                style="width: 280px"
              />
            </div>
          </CkCard>
        </section>

        <!-- ========================================
          4. Checkbox 多选框
          ======================================== -->
        <section id="checkbox" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">4. Checkbox 多选框</h2>
          <p class="ckui-demo__desc">允许从一组选项中选择零个或多个。</p>

          <CkCard title="基础用法" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkCheckbox v-model:checked="check1">选项 A</CkCheckbox>
              <CkCheckbox v-model:checked="check2">选项 B</CkCheckbox>
              <CkCheckbox :checked="true" :disabled="true">禁用-选中</CkCheckbox>
              <CkCheckbox :checked="false" :disabled="true">禁用-未选中</CkCheckbox>
            </div>
          </CkCard>
        </section>

        <!-- ========================================
          5. Radio 单选框
          ======================================== -->
        <section id="radio" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">5. Radio 单选框</h2>
          <p class="ckui-demo__desc">从一组互斥选项中选择唯一值。</p>

          <CkCard title="基础用法" class="ckui-demo__card">
            <a-radio-group v-model:value="radioVal">
              <CkRadio value="a">选项 A</CkRadio>
              <CkRadio value="b">选项 B</CkRadio>
              <CkRadio value="c">选项 C</CkRadio>
            </a-radio-group>
            <p class="ckui-demo__hint">当前选中：{{ radioVal }}</p>
          </CkCard>

          <CkCard title="按钮样式" class="ckui-demo__card">
            <a-radio-group v-model:value="radioBtnVal" button-style="solid">
              <a-radio-button value="day">日</a-radio-button>
              <a-radio-button value="week">周</a-radio-button>
              <a-radio-button value="month">月</a-radio-button>
              <a-radio-button value="year">年</a-radio-button>
            </a-radio-group>
          </CkCard>
        </section>

        <!-- ========================================
          6. Switch 开关
          ======================================== -->
        <section id="switch" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">6. Switch 开关</h2>
          <p class="ckui-demo__desc">切换单一设置的开启/关闭状态。</p>

          <CkCard title="基础用法" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkSwitch v-model:checked="switchVal" />
              <CkSwitch
                v-model:checked="switchVal"
                checked-children="开"
                un-checked-children="关"
              />
              <CkSwitch :checked="true" :disabled="true" />
              <CkSwitch :checked="true" :loading="true" />
            </div>
          </CkCard>
        </section>

        <!-- ========================================
          7. Tag 标签
          ======================================== -->
        <section id="tag" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">7. Tag 标签</h2>
          <p class="ckui-demo__desc">用于标记、分类或状态展示，支持关闭 / 可选操作。</p>

          <CkCard title="预设颜色" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkTag color="primary">Primary</CkTag>
              <CkTag color="success">Success</CkTag>
              <CkTag color="warning">Warning</CkTag>
              <CkTag color="error">Error</CkTag>
              <CkTag color="info">Info</CkTag>
              <CkTag color="gray">Gray</CkTag>
            </div>
          </CkCard>

          <CkCard title="可关闭标签" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkTag color="primary" closable>可关闭</CkTag>
              <CkTag color="success" closable>点击关闭</CkTag>
              <CkTag color="#7c3aed">自定义色</CkTag>
            </div>
          </CkCard>
        </section>

        <!-- ========================================
          8. Badge 徽标
          ======================================== -->
        <section id="badge" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">8. Badge 徽标</h2>
          <p class="ckui-demo__desc">显示未读数量、状态点等标记。</p>

          <CkCard title="基础用法" class="ckui-demo__card">
            <div class="ckui-demo__row" style="gap: 32px">
              <CkBadge :count="5">
                <a-avatar shape="square" style="background-color: #f0f0f0">
                  <template #icon><BellOutlined /></template>
                </a-avatar>
              </CkBadge>
              <CkBadge :count="99">
                <a-avatar shape="square" style="background-color: #f0f0f0">
                  <template #icon><BellOutlined /></template>
                </a-avatar>
              </CkBadge>
              <CkBadge :count="1000" :overflow-count="999">
                <a-avatar shape="square" style="background-color: #f0f0f0">
                  <template #icon><BellOutlined /></template>
                </a-avatar>
              </CkBadge>
              <CkBadge dot>
                <a-avatar shape="square" style="background-color: #f0f0f0">
                  <template #icon><BellOutlined /></template>
                </a-avatar>
              </CkBadge>
              <CkBadge status="success" text="运行中" />
              <CkBadge status="error" text="异常" />
              <CkBadge status="processing" text="处理中" />
            </div>
          </CkCard>
        </section>

        <!-- ========================================
          9. Card 卡片
          ======================================== -->
        <section id="card" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">9. Card 卡片</h2>
          <p class="ckui-demo__desc">容器组件，用于聚合相关信息形成独立内容块。</p>

          <div class="ckui-demo__grid">
            <CkCard title="基础卡片" class="ckui-demo__card">
              这是一个基础卡片的内容区域，可用于展示任意信息。
            </CkCard>
            <CkCard title="可悬停卡片" hoverable class="ckui-demo__card">
              鼠标悬停时，阴影会提升，提供交互反馈。
            </CkCard>
            <CkCard title="带额外操作" class="ckui-demo__card">
              <template #extra><a href="#">更多 ›</a></template>
              卡片右上角有额外操作入口。
            </CkCard>
            <CkCard title="加载中卡片" loading class="ckui-demo__card">加载中内容</CkCard>
          </div>
        </section>

        <!-- ========================================
          10. Alert 警告提示
          ======================================== -->
        <section id="alert" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">10. Alert 警告提示</h2>
          <p class="ckui-demo__desc">展示系统重要通知、状态反馈或操作结果。</p>

          <CkCard title="四种类型" class="ckui-demo__card">
            <div class="ckui-demo__stack">
              <CkAlert type="info" message="提示信息：这是一个常规信息通知" />
              <CkAlert type="success" message="操作成功：数据已保存" />
              <CkAlert type="warning" message="注意：此操作将影响多个用户" />
              <CkAlert type="error" message="操作失败：服务器返回错误，请重试" />
            </div>
          </CkCard>

          <CkCard title="带描述 + 可关闭" class="ckui-demo__card">
            <div class="ckui-demo__stack">
              <CkAlert
                type="info"
                message="系统通知标题"
                description="这是详细的描述内容，可以包含较长的说明文字，帮助用户了解更多信息。"
                closable
              />
              <CkAlert
                type="error"
                message="错误详情"
                description="错误代码：500，请联系管理员处理。"
                closable
              />
            </div>
          </CkCard>
        </section>

        <!-- ========================================
          11. Modal 模态框
          ======================================== -->
        <section id="modal" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">11. Modal 模态框</h2>
          <p class="ckui-demo__desc">弹窗形式展示重要内容或确认操作。</p>

          <CkCard title="基础用法" class="ckui-demo__card">
            <CkButton type="primary" @click="modalVisible = true">打开模态框</CkButton>
            <CkModal
              v-model:open="modalVisible"
              title="确认操作"
              @ok="handleModalOk"
              @cancel="modalVisible = false"
            >
              <p>确认要执行此操作吗？此操作不可撤销。</p>
            </CkModal>
          </CkCard>

          <CkCard title="不同宽度" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkButton type="secondary" @click="smallModal = true">小弹窗（420px）</CkButton>
              <CkButton type="secondary" @click="largeModal = true">大弹窗（680px）</CkButton>
            </div>
            <CkModal v-model:open="smallModal" title="小弹窗" :width="420" @ok="smallModal = false">
              <p>这是一个宽度为 420px 的小弹窗。</p>
            </CkModal>
            <CkModal v-model:open="largeModal" title="大弹窗" :width="680" @ok="largeModal = false">
              <p>这是一个宽度为 680px 的大弹窗，适合展示更多内容。</p>
            </CkModal>
          </CkCard>
        </section>

        <!-- ========================================
          12. Drawer 抽屉
          ======================================== -->
        <section id="drawer" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">12. Drawer 抽屉</h2>
          <p class="ckui-demo__desc">从屏幕边缘滑入的面板，适合展示详情或表单。</p>

          <CkCard title="基础用法" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkButton type="primary" @click="drawerRight = true">右侧抽屉</CkButton>
              <CkButton type="secondary" @click="drawerLeft = true">左侧抽屉</CkButton>
            </div>
            <CkDrawer v-model:open="drawerRight" title="详情抽屉" placement="right" :width="400">
              <p>这是右侧抽屉的内容区域。</p>
              <p>适合展示详情信息、编辑表单等。</p>
            </CkDrawer>
            <CkDrawer v-model:open="drawerLeft" title="左侧抽屉" placement="left" :width="400">
              <p>这是左侧抽屉的内容区域。</p>
            </CkDrawer>
          </CkCard>
        </section>

        <!-- ========================================
          13. Table 表格
          ======================================== -->
        <section id="table" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">13. Table 表格</h2>
          <p class="ckui-demo__desc">展示结构化数据，支持排序 / 筛选 / 分页 / 行选择。</p>

          <!-- ===== 综合示例：订单管理（工具栏 + 头像 + 筛选 + 操作列） ===== -->
          <CkCard class="ckui-demo__card ckui-demo__card--flush">
            <!-- 工具栏：标题 + 记录数 + 搜索 + 新增 -->
            <div class="ckui-demo__toolbar">
              <div class="ckui-demo__toolbar-left">
                <h4 class="ckui-demo__toolbar-title">订单管理</h4>
                <span class="ckui-demo__toolbar-badge">共 {{ tableData.length }} 条记录</span>
              </div>
              <div class="ckui-demo__toolbar-right">
                <a-input-search
                  v-model:value="searchText"
                  placeholder="搜索订单号..."
                  allow-clear
                  style="width: 200px"
                />
                <CkButton type="primary" size="small">
                  <template #icon><PlusOutlined /></template>
                  新增
                </CkButton>
              </div>
            </div>

            <!-- 表格主体：含头像列 / 筛选列 / 操作列 -->
            <CkTable
              :columns="tableColumns"
              :data-source="filteredTableData"
              :pagination="{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (t: number) => `共 ${t} 条`,
              }"
              row-key="id"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
              @change="handleTableChange"
            >
              <template #bodyCell="{ column, record }">
                <!-- 客户姓名列：带头像 -->
                <template v-if="column.key === 'name'">
                  <div class="ckui-demo__user-cell">
                    <img
                      :src="record.avatar"
                      :alt="record.name"
                      class="ckui-demo__avatar"
                      @error="($event.target as HTMLImageElement).src = defaultAvatar"
                    />
                    <span class="ckui-demo__user-name">{{ record.name }}</span>
                  </div>
                </template>

                <!-- 状态列：彩色圆点 + 标签 -->
                <template v-else-if="column.key === 'status'">
                  <span :class="['ckui-demo__status-badge', `ckui-demo__status-badge--${statusMap[record.status]?.type || 'default'}`]">
                    <span class="ckui-demo__status-dot" />
                    {{ record.status }}
                  </span>
                </template>

                <!-- 金额列：加粗显示 -->
                <template v-else-if="column.key === 'amount'">
                  <span class="ckui-demo__amount">¥{{ record.amount.toLocaleString() }}</span>
                </template>

                <!-- 操作列：编辑 + 删除图标按钮 -->
                <template v-else-if="column.key === 'action'">
                  <div class="ckui-demo__action-cell">
                    <button class="ckui-demo__action-btn ckui-demo__action-btn--edit" title="编辑">
                      <EditOutlined />
                    </button>
                    <button class="ckui-demo__action-btn ckui-demo__action-btn--delete" title="删除">
                      <DeleteOutlined />
                    </button>
                  </div>
                </template>
              </template>
            </CkTable>
          </CkCard>

          <!-- ===== 斑马纹 + 边框模式 ===== -->
          <CkCard title="斑马纹表格" class="ckui-demo__card">
            <CkTable
              :columns="tableColumns"
              :data-source="tableData"
              :pagination="false"
              :bordered="true"
              striped
              row-key="id"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                  <div class="ckui-demo__user-cell">
                    <img :src="record.avatar" :alt="record.name" class="ckui-demo__avatar" @error="($event.target as HTMLImageElement).src = defaultAvatar" />
                    <span class="ckui-demo__user-name">{{ record.name }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'status'">
                  <span :class="['ckui-demo__status-badge', `ckui-demo__status-badge--${statusMap[record.status]?.type || 'default'}`]">
                    <span class="ckui-demo__status-dot" />
                    {{ record.status }}
                  </span>
                </template>
                <template v-else-if="column.key === 'amount'">
                  <span class="ckui-demo__amount">¥{{ record.amount.toLocaleString() }}</span>
                </template>
              </template>
            </CkTable>
          </CkCard>
        </section>

        <!-- ========================================
          14. Tabs 标签页
          ======================================== -->
        <section id="tabs" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">14. Tabs 标签页</h2>
          <p class="ckui-demo__desc">在有限空间内组织多层级内容，支持下划线 / 卡片 / 胶囊模式。</p>

          <CkCard title="下划线模式（默认）" class="ckui-demo__card">
            <CkTabs v-model:activeKey="tabKey" type="line">
              <a-tab-pane key="1" tab="基本信息">这是基本信息面板的内容。</a-tab-pane>
              <a-tab-pane key="2" tab="详细配置">这是详细配置面板的内容。</a-tab-pane>
              <a-tab-pane key="3" tab="操作日志">这是操作日志面板的内容。</a-tab-pane>
            </CkTabs>
          </CkCard>

          <CkCard title="卡片模式" class="ckui-demo__card">
            <CkTabs v-model:activeKey="tabKey2" type="card">
              <a-tab-pane key="1" tab="选项卡一">卡片模式内容一。</a-tab-pane>
              <a-tab-pane key="2" tab="选项卡二">卡片模式内容二。</a-tab-pane>
              <a-tab-pane key="3" tab="选项卡三">卡片模式内容三。</a-tab-pane>
            </CkTabs>
          </CkCard>

          <CkCard title="胶囊模式（CRRC 新增）" class="ckui-demo__card">
            <CkTabs v-model:activeKey="tabKey3" type="segment">
              <a-tab-pane key="1" tab="日视图">日视图内容。</a-tab-pane>
              <a-tab-pane key="2" tab="周视图">周视图内容。</a-tab-pane>
              <a-tab-pane key="3" tab="月视图">月视图内容。</a-tab-pane>
            </CkTabs>
          </CkCard>
        </section>

        <!-- ========================================
          15. Steps 步骤条
          ======================================== -->
        <section id="steps" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">15. Steps 步骤条</h2>
          <p class="ckui-demo__desc">展示任务流程的当前进度和步骤状态。</p>

          <CkCard title="水平步骤条" class="ckui-demo__card">
            <a-steps :current="1">
              <a-step title="创建申请" description="填写申请信息" />
              <a-step title="审批中" description="等待领导审批" />
              <a-step title="完成" description="审批通过" />
            </a-steps>
          </CkCard>

          <CkCard title="带状态的步骤条" class="ckui-demo__card">
            <a-steps :current="2">
              <a-step title="已完成" status="finish" />
              <a-step title="已完成" status="finish" />
              <a-step title="进行中" status="process" />
              <a-step title="等待中" status="wait" />
            </a-steps>
          </CkCard>
        </section>

        <!-- ========================================
          16. Progress 进度条
          ======================================== -->
        <section id="progress" class="ckui-demo__section">
          <h2 class="ckui-demo__section-title">16. Progress 进度条</h2>
          <p class="ckui-demo__desc">展示任务的完成进度，支持线性 / 环形模式。</p>

          <CkCard title="线性进度条" class="ckui-demo__card">
            <div class="ckui-demo__stack">
              <CkProgress :percent="30" />
              <CkProgress :percent="70" status="active" />
              <CkProgress :percent="100" status="success" />
              <CkProgress :percent="45" status="exception" />
            </div>
          </CkCard>

          <CkCard title="环形进度条" class="ckui-demo__card">
            <div class="ckui-demo__row">
              <CkProgress :percent="60" type="circle" />
              <CkProgress :percent="100" type="circle" status="success" />
              <CkProgress :percent="30" type="circle" status="exception" />
            </div>
          </CkCard>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * CRRC UI Demo 页面
 *
 * 展示所有 CRRC UI 组件的完整用法，包含：
 * - 主题切换（红色/蓝色）
 * - 所有组件的各种状态和配置
 * - 真实数据模拟
 */
import { ref, computed } from 'vue';
import {
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import {
  CkButton, CkInput, CkSelect, CkCheckbox, CkRadio,
  CkSwitch, CkTag, CkBadge, CkCard, CkAlert,
  CkModal, CkTable, CkTabs, CkProgress, CkDrawer,
} from '@/components/ckui';
import { setTheme, getTheme } from '@/components/ckui';
import '@/components/ckui/theme/index.less';
import defaultAvatar from '@/assets/logo.png';

/* ---- 主题状态 ---- */
const currentTheme = ref<'red' | 'blue'>(getTheme());

/* 监听主题变化并持久化 */
function watchTheme() {
  setTheme(currentTheme.value);
}

/* ---- 导航区域列表 ---- */
const sections = [
  { id: 'button', label: '1. Button 按钮' },
  { id: 'input', label: '2. Input 输入框' },
  { id: 'select', label: '3. Select 选择器' },
  { id: 'checkbox', label: '4. Checkbox 多选框' },
  { id: 'radio', label: '5. Radio 单选框' },
  { id: 'switch', label: '6. Switch 开关' },
  { id: 'tag', label: '7. Tag 标签' },
  { id: 'badge', label: '8. Badge 徽标' },
  { id: 'card', label: '9. Card 卡片' },
  { id: 'alert', label: '10. Alert 警告' },
  { id: 'modal', label: '11. Modal 模态框' },
  { id: 'drawer', label: '12. Drawer 抽屉' },
  { id: 'table', label: '13. Table 表格' },
  { id: 'tabs', label: '14. Tabs 标签页' },
  { id: 'steps', label: '15. Steps 步骤条' },
  { id: 'progress', label: '16. Progress 进度条' },
];

/* ---- Input 示例数据 ---- */
const inputVal = ref('');
const textareaVal = ref('');

/* ---- Select 示例数据 ---- */
const selectVal = ref<string>();
const selectMultiVal = ref<string[]>([]);
const selectSearchVal = ref<string>();
const selectOptions = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '成都', value: 'cd' },
];

/* ---- Checkbox 示例数据 ---- */
const check1 = ref(true);
const check2 = ref(false);

/* ---- Radio 示例数据 ---- */
const radioVal = ref('a');
const radioBtnVal = ref('day');

/* ---- Switch 示例数据 ---- */
const switchVal = ref(false);

/* ---- Modal 示例数据 ---- */
const modalVisible = ref(false);
const smallModal = ref(false);
const largeModal = ref(false);

function handleModalOk() {
  modalVisible.value = false;
}

/* ---- Drawer 示例数据 ---- */
const drawerRight = ref(false);
const drawerLeft = ref(false);

/* ---- Tabs 示例数据 ---- */
const tabKey = ref('1');
const tabKey2 = ref('1');
const tabKey3 = ref('1');

/* ---- Table 示例数据 ---- */
const tableColumns = [
  {
    title: '订单编号',
    dataIndex: 'orderId',
    key: 'orderId',
    width: 160,
    sorter: (a: any, b: any) => a.orderId.localeCompare(b.orderId),
  },
  {
    title: '客户姓名',
    dataIndex: 'name',
    key: 'name',
    width: 160,
  },
  {
    title: '部门',
    dataIndex: 'dept',
    key: 'dept',
    width: 120,
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '产品部', value: '产品部' },
      { text: '设计部', value: '设计部' },
      { text: '运营部', value: '运营部' },
      { text: '人事部', value: '人事部' },
    ],
    onFilter: (value: any, record: any) => record.dept === value,
  },
  {
    title: '下单时间',
    dataIndex: 'joinDate',
    key: 'joinDate',
    width: 180,
    sorter: (a: any, b: any) => a.joinDate.localeCompare(b.joinDate),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    filters: [
      { text: '已完成', value: '已完成' },
      { text: '配送中', value: '配送中' },
      { text: '等待支付', value: '等待支付' },
      { text: '已取消', value: '已取消' },
    ],
    onFilter: (value: any, record: any) => record.status === value,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 130,
    align: 'right' as const,
    sorter: (a: any, b: any) => a.amount - b.amount,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: 'center' as const,
  },
];

const tableData = [
  {
    id: 1,
    orderId: '#ORD-20240501',
    name: '李明远',
    avatar: 'https://i.pravatar.cc/100?img=1',
    dept: '技术部',
    joinDate: '2024-05-26 10:30',
    status: '已完成',
    amount: 2499,
  },
  {
    id: 2,
    orderId: '#ORD-20240502',
    name: '王小云',
    avatar: 'https://i.pravatar.cc/100?img=5',
    dept: '产品部',
    joinDate: '2024-05-26 11:15',
    status: '配送中',
    amount: 8120.5,
  },
  {
    id: 3,
    orderId: '#ORD-20240503',
    name: '赵刚',
    avatar: 'https://i.pravatar.cc/100?img=3',
    dept: '设计部',
    joinDate: '2024-05-26 12:45',
    status: '等待支付',
    amount: 560,
  },
  {
    id: 4,
    orderId: '#ORD-20240504',
    name: '陈思雨',
    avatar: 'https://i.pravatar.cc/100?img=9',
    dept: '技术部',
    joinDate: '2024-05-27 09:00',
    status: '已完成',
    amount: 15600,
  },
  {
    id: 5,
    orderId: '#ORD-20240505',
    name: '刘洋',
    avatar: 'https://i.pravatar.cc/100?img=11',
    dept: '运营部',
    joinDate: '2024-05-27 14:20',
    status: '已取消',
    amount: 320,
  },
  {
    id: 6,
    orderId: '#ORD-20240506',
    name: '张薇',
    avatar: 'https://i.pravatar.cc/100?img=16',
    dept: '技术部',
    joinDate: '2024-05-28 08:45',
    status: '配送中',
    amount: 4780,
  },
  {
    id: 7,
    orderId: '#ORD-20240507',
    name: '吴磊',
    avatar: 'https://i.pravatar.cc/100?img=7',
    dept: '人事部',
    joinDate: '2024-05-28 16:30',
    status: '已完成',
    amount: 9800,
  },
];

const selectedRowKeys = ref<any[]>([]);

function onSelectChange(keys: any[]) {
  selectedRowKeys.value = keys;
}

/** 搜索关键词 */
const searchText = ref('');

/** 按搜索词过滤的表格数据 */
const filteredTableData = computed(() => {
  if (!searchText.value) return tableData;
  const keyword = searchText.value.toLowerCase();
  return tableData.filter(
    (item) =>
      item.orderId.toLowerCase().includes(keyword) ||
      item.name.toLowerCase().includes(keyword),
  );
});

/** 状态 → 徽章类型映射（对应 CSS 类） */
const statusMap: Record<string, { type: string }> = {
  '已完成': { type: 'success' },
  '配送中': { type: 'primary' },
  '等待支付': { type: 'warning' },
  '已取消': { type: 'error' },
};

/** 表格筛选 / 排序变化回调 */
function handleTableChange(_pagination: any, _filters: any, _sorter: any) {
  // ant-design-vue 内部已处理筛选和排序逻辑，此处可扩展服务端请求
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  Demo 页面布局样式
 * ============================================================ */

.ckui-demo {
  min-height: 100vh;
  background-color: var(--ck-bg-primary, #f9fafb);
}

/* ---- 页面头部 ---- */
.ckui-demo__header {
  background-color: var(--ck-primary, #3b82f6);
  color: #fff;
  padding: 20px 32px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--ck-shadow-sticky);
}

.ckui-demo__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.ckui-demo__title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #fff;
}

.ckui-demo__subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 4px 0 0;
}

.ckui-demo__theme-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ckui-demo__theme-label {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
}

/* ---- 主体布局（左侧导航 + 右侧内容） ---- */
.ckui-demo__main {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
  gap: 24px;
}

/* 左侧导航 */
.ckui-demo__sidebar {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  height: fit-content;
  max-height: calc(100vh - 104px);
  overflow-y: auto;
  padding: 16px;
  background: var(--ck-bg-card, #fff);
  border-radius: var(--ck-radius-md, 8px);
  box-shadow: var(--ck-shadow-card);
}

.ckui-demo__nav-link {
  display: block;
  padding: 8px 12px;
  border-radius: var(--ck-radius-sm, 4px);
  color: var(--ck-text-secondary, #6b7280);
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  margin-bottom: 2px;

  &:hover {
    background-color: var(--ck-primary-bg, rgba(59, 130, 246, 0.05));
    color: var(--ck-primary, #3b82f6);
  }
}

/* 右侧内容区 */
.ckui-demo__content {
  flex: 1;
  min-width: 0;
}

/* ---- 章节 ---- */
.ckui-demo__section {
  margin-bottom: 40px;
}

.ckui-demo__section-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--ck-text-primary, #111827);
  margin: 0 0 8px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--ck-primary, #3b82f6);
}

.ckui-demo__desc {
  color: var(--ck-text-secondary, #6b7280);
  font-size: 14px;
  margin: 0 0 16px;
}

/* ---- 卡片间距 ---- */
.ckui-demo__card {
  margin-bottom: 16px;
}

/* ---- 行内排列 ---- */
.ckui-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

/* ---- 垂直排列 ---- */
.ckui-demo__stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ---- 表单纵向排列 ---- */
.ckui-demo__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

/* ---- 网格布局（卡片组） ---- */
.ckui-demo__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* ---- 提示文字 ---- */
.ckui-demo__hint {
  color: var(--ck-text-tertiary, #9ca3af);
  font-size: 13px;
  margin-top: 8px;
}

/* ============================================================
 *  Table Demo 专用样式
 *  工具栏 / 头像 / 状态徽章 / 操作按钮
 * ============================================================ */

/* ---- 无内边距卡片（工具栏 + 表格紧贴） ---- */
.ckui-demo__card--flush {
  :deep(.ant-card-body) {
    padding: 0 !important;
  }
}

/* ---- 工具栏：标题 + 搜索 + 按钮 ---- */
.ckui-demo__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  background-color: var(--ck-bg-primary, #f9fafb);
  border-bottom: 1px solid var(--ck-border-default, #e5e7eb);
}

.ckui-demo__toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ckui-demo__toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ckui-demo__toolbar-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--ck-text-primary, #111827);
}

/* 记录数徽章 */
.ckui-demo__toolbar-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ck-primary, #3b82f6);
  background-color: var(--ck-primary-bg, rgba(59, 130, 246, 0.08));
  border-radius: 999px;
}

/* ---- 头像 + 姓名单元格 ---- */
.ckui-demo__user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ckui-demo__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--ck-border-default, #e5e7eb);
}

.ckui-demo__user-name {
  font-weight: 500;
  color: var(--ck-text-primary, #111827);
}

/* ---- 状态徽章（圆点 + 文字） ---- */
.ckui-demo__status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  line-height: 1.6;
}

.ckui-demo__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 已完成 / 成功 — 绿色 */
.ckui-demo__status-badge--success {
  background-color: #ecfdf5;
  color: #059669;

  .ckui-demo__status-dot {
    background-color: #059669;
  }
}

/* 配送中 / 主色 — 蓝色 / 红色（跟随主题） */
.ckui-demo__status-badge--primary {
  background-color: var(--ck-primary-bg, rgba(59, 130, 246, 0.08));
  color: var(--ck-primary, #3b82f6);

  .ckui-demo__status-dot {
    background-color: var(--ck-primary, #3b82f6);
  }
}

/* 等待支付 / 警告 — 橙色 */
.ckui-demo__status-badge--warning {
  background-color: #fff7ed;
  color: #ea580c;

  .ckui-demo__status-dot {
    background-color: #ea580c;
  }
}

/* 已取消 / 错误 — 红色 */
.ckui-demo__status-badge--error {
  background-color: #fef2f2;
  color: #dc2626;

  .ckui-demo__status-dot {
    background-color: #dc2626;
  }
}

/* ---- 金额加粗 ---- */
.ckui-demo__amount {
  font-weight: 700;
  color: var(--ck-text-primary, #111827);
}

/* ---- 操作列图标按钮 ---- */
.ckui-demo__action-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.ckui-demo__action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--ck-text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background-color: var(--ck-bg-primary, #f3f4f6);
  }
}

.ckui-demo__action-btn--edit:hover {
  color: var(--ck-primary, #3b82f6);
  background-color: var(--ck-primary-bg, rgba(59, 130, 246, 0.08));
}

.ckui-demo__action-btn--delete:hover {
  color: #dc2626;
  background-color: #fef2f2;
}

/* ---- 响应式 ---- */
@media (max-width: 1024px) {
  .ckui-demo__sidebar {
    display: none;
  }
  .ckui-demo__grid {
    grid-template-columns: 1fr;
  }
}
</style>
