<script setup lang="ts">
import { ref, inject, watch, Ref } from "vue";

import { DxSelectBox } from "devextreme-vue";

import { KeywordResult, userService } from "../../services/api";
import UserSelector from "../common/UserSelector.vue";
import Draggable from "../common/Draggable.vue";

const selectedUser = ref("");
const result = ref("")
const selectedKeyWord = ref<KeywordResult>({});
const loading = inject<Ref<boolean>>("loading");
const showResults = ref(false);

const toast = inject("toast") as {
  error: (msg: string) => void;
  success: (msg: string) => void;
};

const selectKeyWordConfig = ref<DxSelectBox>({
  items: [],
  searchEnabled: true,
  placeholder: "",
  noDataText: "Không có dữ liệu",
  elementAttr: { style: "width: 100%" },
  displayExpr: "value",
  value: localStorage.getItem("key_word") || "",
  valueExpr: "key",
  onSelectionChanged(e) {
    if (e && e.selectedItem) {
      {
        localStorage.setItem("key_word", e.selectedItem.key);
        selectedKeyWord.value = e.selectedItem;
      }
    }
  },
});

const createPost = async () => {
  if (!selectedUser.value) {
    toast.error("Vui lòng chọn người dùng");
    return;
  }

  if (!selectedKeyWord.value) {
    toast.error("Tên đề tài không được bỏ trống");
    return;
  }

  loading && (loading.value = true);
  const response = await userService.createPostFromBestOutline(
    selectedUser.value,
    selectedKeyWord.value.value ?? ""
  );
  if (response) {
    showResults.value = true;
    result.value = response;
    localStorage.setItem("link_Doc", response);
  }
  loading && (loading.value = false);

  // Show success toast
  toast.success("Tạo bài viết thành công");
};

const getListKeyWord = async () => {
  loading && (loading.value = true);
  if (selectedUser.value) {
    const response = await userService.getKeyWordByUser(selectedUser.value);
    if (response && response.length > 0) {
      selectKeyWordConfig.value.items = response;
    } else {
      selectKeyWordConfig.value.items = [];
    }
  }
  loading && (loading.value = false);
};

watch(selectedUser, () => {
  getListKeyWord();
});
</script>

<template>
  <div class="card">
    <h2>Tạo bài viết từ outline tốt nhất</h2>

    <UserSelector v-model="selectedUser" />
    <div class="form-group mt-25">
      <label class="label-input">Keyword đã tìm kiếm</label>
      <div class="form-group group-add-user">
        <DxSelectBox v-bind="selectKeyWordConfig" />
      </div>
    </div>
    <button @click="createPost" class="btn-green">Tạo bài viết</button>
  </div>

  <div v-if="showResults" class="popup">
    <Draggable>
      <div class="popup-content">
        <h3>Đang tạo bài viết từ outline tốt nhất:</h3>
        <div style="margin-bottom: 15px">
          Chi tiết tại:
          <a class="link" :href="result" target="_blank">{{ result }}</a>
        </div>
        <button @click="showResults = false">Đóng</button>
      </div>
    </Draggable>
  </div>
</template>
