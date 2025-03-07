<script setup lang="ts">
import { ref, inject, Ref } from "vue";

import { userService } from "../../services/api";
import Draggable from "../common/Draggable.vue";
import UserSelector from "../common/UserSelector.vue";

const selectedUser = ref("");
const researchTopic = ref(localStorage.getItem("research_topic") || "");
const toast = inject("toast") as {
  error: (msg: string) => void;
  success: (msg: string) => void;
};

const result = ref("");
const showResults = ref(false);
const loading = inject<Ref<boolean>>("loading");

const submitResearch = async () => {
  if (!selectedUser.value) {
    toast.error("Tên người dùng không được để trống");
    return;
  }

  if (!researchTopic.value) {
    toast.error("Tên đề tài không được bỏ trống");
    return;
  }

  loading && (loading.value = true);
  await userService
    .research(selectedUser.value, researchTopic.value)
    .then((response) => {
      if (response) {
        toast.success("Yêu cầu tìm kiếm đã được tạo");
        result.value = response;
        showResults.value = true;
        // Reset form
        //researchTopic.value = "";
      }
    })
    .catch((error) => {
      console.log("Research error:", error);
    })
    .finally(() => {
      loading && (loading.value = false);
    });
};

const saveLocalStorage = () => {
  localStorage.setItem("research_topic", researchTopic.value);
};
</script>

<template>
  <div class="card">
    <h2>Tìm kiếm theo đề tài</h2>
    <UserSelector v-model="selectedUser" />

    <div class="form-group mt-25">
      <label class="label-input">Tìm kiếm theo đề tài</label>
      <input
        id="research-topic"
        v-model="researchTopic"
        type="text"
        placeholder="Nhập đề tài"
        class="width-fill"
        @input="saveLocalStorage"
      />
    </div>

    <button @click="submitResearch" class="btn-green">Tìm kiếm</button>

    <div v-if="showResults" class="popup">
      <Draggable>
        <div class="popup-content">
          <h3>Đang tìm kiếm thông tin:</h3>
          <div style="margin-bottom: 15px">
            Chi tiết tại:
            <a class="link" :href="result" target="_blank">{{ result }}</a>
          </div>
          <button @click="showResults = false">Đóng</button>
        </div>
      </Draggable>
    </div>
  </div>
</template>

<style>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
