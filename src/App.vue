<script setup lang="ts">
import { ref, provide } from "vue";

import ResearchTopic from "./components/page/ResearchTopic.vue";
import BestOutline from "./components/page/BestOutline.vue";
import WordPress from "./components/page/PushToWordPress.vue";
import CreatePost from "./components/page/CreatePost.vue";
import ToastManager from "./components/common/ToastManager.vue";
import Loading from "./components/common/Loading.vue";

interface ToastManager {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const toastManagerRef = ref<ToastManager | null>(null);
const keyTab = "active_tab";
const activeTab = ref(localStorage.getItem(keyTab) || "research");
const isLoading = ref(false);

const tabs = [
  { id: "research", label: "Tìm kiếm" },
  { id: "outline", label: "Chọn Outline" },
  { id: "createPost", label: "Tạo bài viết" },
  { id: "wordpress", label: "Đăng bài" },
];

const setActiveTab = (tabId: string) => {
  localStorage.setItem(keyTab, tabId);
  activeTab.value = tabId;
};

const refreshData = () => {
  localStorage.clear();
  window.location.reload();
};

// Provide toast methods to all components
provide("toast", {
  success: (message: string, duration?: number) => {
    toastManagerRef.value?.success(message, duration);
  },
  error: (message: string, duration?: number) => {
    toastManagerRef.value?.error(message, duration);
  },
  info: (message: string, duration?: number) => {
    toastManagerRef.value?.info(message, duration);
  },
});

provide("loading", isLoading);


</script>

<template>
  <Loading v-if="isLoading"/>
  <div class="container">
    <div class="header">
      <h1 style="color: #fff;">Tự động đăng bài lên Wordpress</h1>
      <div class="btn-action" title="Tải lại" @click="refreshData">
        <div class="reload"></div>
      </div>
    </div>

    <div class="tabs">
      <div class="steps">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.id"
          :class="['step', { active: activeTab === tab.id }]"
          @click="setActiveTab(tab.id)"
        >
          <div class="step-circle">{{ index + 1 }}</div>
          <div class="step-label">{{ tab.label }}</div>
        </div>
      </div>
    </div>

    <div class="tab-content">
      <ResearchTopic v-if="activeTab === 'research'" />
      <BestOutline v-if="activeTab === 'outline'" :modelValue="activeTab" />
      <CreatePost v-if="activeTab === 'createPost'" />
      <WordPress v-if="activeTab === 'wordpress'" />
    </div>

    <!-- Toast Manager -->
    <ToastManager ref="toastManagerRef" />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reload {
  cursor: pointer;
  background-image: url("./assets/i-refresh.svg");
  background-repeat: no-repeat;
  height: 24px;
  width: 24px;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: solid 1px #CFD9E0;
  background-color: #FFF;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-action:hover {
  border-color: #1B79F2;
  background-color: #E7F1FE;
}

.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.steps {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

/* Line connecting the steps */
.steps::before {
  content: "";
  position: absolute;
  top: 15px; /* Adjust to center the line vertically */
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ddd;
  z-index: 0; /* Place behind the circles */
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin: 0;
  flex: 1; /* Distribute space evenly */
  position: relative;
  z-index: 1; /* Place circles above the line */
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-bottom: 5px;
  border: 2px solid #f0f0f0; /* Add a border */
  box-sizing: border-box; /* Include border in the element's total width and height */
}

.step.active .step-circle {
  background-color: #1B79F2;
  color: #fff;
  border-color: #1B79F2; /* Match border color to active color */
}

.step-label {
  font-size: 16px;
  color: #fff;
  text-align: center;
  word-break: break-word; /* Prevent labels from overflowing */
}

.tab-content {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
