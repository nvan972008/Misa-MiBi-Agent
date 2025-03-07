<script setup lang="ts">
import { ref, inject, Ref } from "vue";
import { userService } from "../../services/api";

const content = ref(localStorage.getItem("link_Doc") || "");
const selectUser = ref("");
const isSubmitting = ref(false);
const isLink = ref(false);
const linkPost = ref("");
const loading = inject<Ref<boolean>>("loading");

const toast = inject("toast") as { error: (msg: string) => void; success: (msg: string) => void };

const submitToWordPress = async () => {
  if (!content.value) {
    toast.error("Vui lòng nhập link bài viết doc");
    return;
  }

  loading && (loading.value = true);
  isSubmitting.value = true;
  const response = await userService.pushToWordPress(selectUser.value, content.value);
  if (response) {
    linkPost.value = response;
    isSubmitting.value = false;
    isLink.value = true;
    toast.success("Đăng bài thành công");
  } else {
    toast.error("Đăng bài thất bại");
  }
  loading && (loading.value = false);
};
</script>

<template>
  <div class="card">
    <h2>Đăng bài lên WordPress</h2>
    <!-- <UserSelector v-model="selectUser"/> -->
    <div class="form-group mt-25">
      <label class="label-input">Link bài viết</label>
      <input
        id="wordpress-content"
        v-model="content"
        rows="8"
        placeholder="Nhập link bài viết doc tại đây"
        class="width-fill"
      ></input>
    </div>

    <div class="d-flex" style="justify-content: space-between;">
      <button @click="submitToWordPress" :disabled="isSubmitting" class="btn-green">
      {{ isSubmitting ? "Đang đăng bài..." : "Đăng bài" }}
      </button>
      <div v-if="isLink">Xem chi tiết: <span><a :href="linkPost" target="_blank">Tại đây</a></span></div>
    </div>

  </div>
</template>

<style scoped>
textarea {
  width: 100%;
  padding: 0.6em;
  font-size: 1em;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: #242424;
  color: white;
  margin-bottom: 1rem;
  font-family: inherit;
  resize: none;
  height: 24px;
}

.status-message {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(66, 184, 131, 0.1);
  color: #42b883;
}

@media (prefers-color-scheme: light) {
  textarea {
    background-color: white;
    color: #213547;
    border: 1px solid #ddd;
  }
}
</style>