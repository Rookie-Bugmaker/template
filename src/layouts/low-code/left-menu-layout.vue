add-group-modal
<template>
  <div class="sideBar">
    <a-row style="margin: 5px 0 10px">
      <a-col>
        <icon :name="application.applicationIcon" :size="40" />
      </a-col>
      <a-col class="applicationName">{{ application.applicationName }}</a-col>
    </a-row>
    <a-row>
      <a-col flex="1">
        <a-input v-model:value="groupName" placeholder="请输入分组名称" allow-clear>
          <template #suffix>
            <search-outlined class="pointer" @click="searchGroup" />
          </template>
        </a-input>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          style="margin-left: 10px"
          @click="
            () => {
              modal.model = null;
              modal.open = true;
            }
          "
        >
          <template #icon><PlusOutlined /></template>
        </a-button>
      </a-col>
    </a-row>
    <a-divider style="margin: 5px 0" />
    <drag-container
      behaviour="contain"
      lock-axis="y"
      dragHandleSelector=".drag-icon"
      @drop="e => move(e)"
    >
      <draggable v-for="item in groupData" :key="item.groupId">
        <a-dropdown :trigger="['contextmenu']">
          <div
            class="pointer"
            :class="{ highlight: groupId == item.groupId, highhover: groupId != item.groupId }"
            style="padding: 5px; border-bottom: 1px solid #eee"
            @click="emit('changeGroup', item.groupId)"
          >
            <a-row>
              <a-col flex="1">
                <span style="line-height: 24px">{{ item.groupName }}</span>
              </a-col>
              <a-col>
                <holder-outlined class="drag-icon" style="padding: 5px" />
              </a-col>
            </a-row>
          </div>
          <template #overlay>
            <a-menu style="width: 70px; text-align: center">
              <a-menu-item>
                <a
                  @click="
                    () => {
                      modal.model = item;
                      modal.open = true;
                    }
                  "
                >
                  编辑
                </a>
              </a-menu-item>
              <a-menu-item>
                <a style="color: red" @click="delGroup(item.groupId)">删除</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </draggable>
    </drag-container>
  </div>
  <edit-modal
    :open="modal.open"
    :model="modal.model"
    @cancel="
      () => {
        modal.open = false;
        modal.model = null;
      }
    "
    @ok="added"
  ></edit-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { Container as DragContainer, Draggable } from '@/components/draggable';
import { Modal, message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import EditModal from './edit-modal.vue';
import { getAppById } from '@/api/low-code/application/index';
import { findByGroupName, deleteGroup, dragSort } from '@/api/low-code/group';
import type { FindByGroupNameResult } from '@/api/low-code/group';
export default defineComponent({
  props: {
    groupId: {
      type: String,
      default: () => null,
    },
  },
  emits: ['changeGroup', 'changeCreatePageFlag'],
  setup(props, { emit }) {
    const route = useRoute();
    const groupData = ref<FindByGroupNameResult[]>([]);
    const groupName = ref<string>();

    // 获取应用信息
    const application = reactive({
      applicationIcon: '',
      applicationName: '',
    });
    const applicationId = route.params.applicationId;
    getAppById(applicationId as string).then(({ result }) => {
      Object.assign(application, result);
    });

    // 查询分组
    const searchGroup = async () => {
      const { result } = await findByGroupName({
        applicationId: applicationId as string,
        groupName: groupName.value,
      });
      groupData.value = result;
    };

    onMounted(async () => {
      await searchGroup();
      //如果url上带了groupId参数，则用url上的groupId
      const groupId = route.query.groupId;
      if (groupId) {
        emit('changeGroup', groupId);
        emit('changeCreatePageFlag', true);
      } else {
        const [first] = groupData.value;
        if (!first) return;
        emit('changeGroup', first.groupId);
      }
    });

    const modal = reactive({
      model: null,
      open: false,
    });

    // 删除分组
    const delGroup = async (id: string) => {
      const { success, message: content } = await deleteGroup(id);
      if (success) {
        message.success('删除成功');
        await searchGroup();
        if (props.groupId === id) {
          const [first] = groupData.value;
          emit('changeGroup', first ? first.groupId : null);
        }
      } else {
        Modal.error({ title: '错误', content });
      }
    };

    // 拖拽排序
    const move = async ({ removedIndex, addedIndex }) => {
      const [moveItem] = groupData.value.splice(removedIndex, 1);
      groupData.value.splice(addedIndex, 0, moveItem);
      const data = groupData.value.map(item => ({ groupId: item.groupId }));
      const { success } = await dragSort(data);
      if (success) {
        message.success('排序成功');
      }
    };

    // 新增分组完成
    const added = async () => {
      modal.open = false;
      modal.model = null;
      await searchGroup();
      if (!props.groupId) {
        const [first] = groupData.value;
        emit('changeGroup', first.groupId);
      }
    };

    return {
      groupData,
      groupName,
      modal,
      application,
      added,
      move,
      emit,
      searchGroup,
      delGroup,
    };
  },
  components: {
    EditModal,
    DragContainer,
    Draggable,
  },
});
</script>
<style scoped>
.sideBar {
  height: 100%;
  padding: 10px;
  background-color: #fff;
}
.applicationName {
  align-self: center;
  width: 180px;
  padding-left: 10px;
  overflow: hidden;
  font-size: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pointer {
  cursor: pointer;
  user-select: none;
}
.highlight {
  color: #fff;
  background-color: var(--primary-color);
}
.highhover:hover {
  background-color: #eee;
}
.drag-icon {
  cursor: all-scroll;
}
</style>
