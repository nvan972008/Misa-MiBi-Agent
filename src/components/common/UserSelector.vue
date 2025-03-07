<script setup lang="ts">
import { ref, inject, onMounted, onBeforeMount, watch } from "vue";

import { userService, type User } from "../../services/api";
import Draggable from "./Draggable.vue";
import { DxSelectBox } from "devextreme-vue";

const STORAGE_KEY = "selected_user";
const USERS_STORAGE_KEY = "users_list";
const toast = inject("toast") as {
  error: (msg: string) => void;
  success: (msg: string) => void;
};

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "userChanged", value: User): void;
}>();

const users = ref<User[]>([]);
const newUser = ref("");
const showPopup = ref(false);
const loading = ref(false);
const linkDrive = ref("");

const selectUserConfig = ref<DxSelectBox>({
  items: [],
  searchEnabled: true,
  placeholder: "Tìm tên...",
  noDataText: "Không có dữ liệu",
  displayExpr: "UserName",
  value:  JSON.parse(localStorage.getItem(STORAGE_KEY) || "")?.DocId,
  valueExpr: "DocId",
  elementAttr: { class: "child-group-select-user" },
  onSelectionChanged(event) {
    if (event && event.selectedItem) {
      updateValue(event.selectedItem.UserName, event.selectedItem.DocId);
      linkDrive.value = `https://docs.google.com/spreadsheets/d/${event.selectedItem.DocId}`;
    }
  },
});

const addNewUser = async () => {
  if (newUser.value.trim() === "") {
    toast.error("Tên người dùng không được để trống");
    return;
  }

  await userService
    .addUser(newUser.value.trim())
    .then((response) => {
      if (response && response.length > 0) {
        if (response[0].error && response[0].message) {
          if (response[0].message.toLowerCase() === "user already exists") {
            toast.error("Tên đã tồn tại");
            return;
          } else {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại sau");
            return;
          }
        } else {
          // Create new user object
          const newUserObj: User = {
            row_number: 1,
            UserName: response[0].data.UserName,
            DocId: response[0].data.DocUrl,
          };

          users.value.push(newUserObj);
          // Update localStorage with new user list
          updateValue(response[0].data.UserName, response[0].data.DocUrl);
          newUser.value = "";
        }
      }
    })
    .catch((error) => {
      toast.error(error.message || "Failed to add new user");
    });
};

const closePopup = () => {
  newUser.value = "";
  showPopup.value = false;
};

const updateValue = (UserName: string, DocId: string) => {
  emit("update:modelValue", UserName);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ UserName, DocId }));
};

const loadUsers = async () => {
  loading.value = true;
  try {
    const responseUser = await userService.getUsers();
    selectUserConfig.value.items = responseUser;
  } catch (error: any) {
    toast.error(error.message || "Failed to load users");
  } finally {
    loading.value = false;
  }
};

// Load saved selection from localStorage
onMounted(async () => {
  await loadUsers();
  const savedSelection = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "null"
  );
  if (savedSelection && !props.modelValue) {
    updateValue(savedSelection.UserName, savedSelection.DocId || "");
  }
});
</script>

<template>
  <div>
    <label class="label-input">Chọn tên người dùng</label>
    <div class="form-group group-add-user">
      <DxSelectBox v-bind="selectUserConfig" />
      <div>
        <button class="btn btn-primary" @click="showPopup = true">Thêm</button>
      </div>
    </div>
    <a v-if="linkDrive" class="link" :href="linkDrive" target="_blank">
      {{ linkDrive }}
    </a>
    <!-- Popup for adding new user -->
    <div v-if="showPopup" class="modal-overlay">
      <Draggable>
        <div class="modal">
          <div class="modal-header">
            <h3>Thêm người dùng</h3>
            <div class="btn-action" @click="closePopup">
              <div class="close"></div>
            </div>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="new-user">Tên (vd: nvan)</label>
              <input
                autocomplete="off"
                id="new-user"
                type="text"
                v-model="newUser"
                @keyup.enter="addNewUser"
                class="form-input"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closePopup">Hủy</button>
            <button class="btn btn-primary" @click="addNewUser">Lưu</button>
          </div>
        </div>
      </Draggable>
    </div>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  column-gap: 10px;
  margin-bottom: 1rem;
  align-items: center;
  margin-bottom: 5px;
}

.form-row > div:last-child {
  margin-left: 10px;
}

.select-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  color: #333;
  margin-top: 0px;
}

.search-input:focus {
  outline: none;
  border-color: #1877f2;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.select-option {
  padding: 8px 12px;
  cursor: pointer;
  color: #333;
}

.select-option:hover {
  background: #f5f5f5;
}

.select-option.selected {
  background: #1877f2;
  color: #fff;
}

.no-results {
  padding: 8px 12px;
  color: #666;
  font-style: italic;
}

.loading-indicator {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-action {
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
}

.btn-action:hover {
  background-color: #f1f1f1;
}

.btn-primary {
  background: #646cff;
  color: #fff;
}

.btn-primary:hover {
  background: #535bf2;
}

.btn-secondary {
  background: #e2e2e2;
  color: #333;
}

.btn-secondary:hover {
  background: #d5d5d5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  width: 365px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 10px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #333;
}

#new-user {
  width: 92%;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #1877f2;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (prefers-color-scheme: dark) {
  .search-input,
  .modal,
  .select-dropdown {
    background: #1a1a1a;
    color: #fff;
    border-color: #444;
  }

  .select-option {
    color: #fff;
  }

  .select-option:hover {
    background: #2a2a2a;
  }

  .modal-header,
  .modal-footer {
    border-color: #444;
  }

  .form-input {
    background: #1a1a1a;
    color: #fff;
    border-color: #444;
  }

  .btn-secondary {
    background: #444;
    color: #fff;
  }

  .btn-secondary:hover {
    background: #555;
  }

  .close-btn {
    color: #fff;
  }

  .modal-header h3,
  .form-group label {
    color: #fff;
  }

  .no-results {
    color: #999;
  }
}

.block-arrow {
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-51%);
  width: 37px;
  height: 39px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.block-arrow:hover {
  cursor: pointer;
  background: #f1f1f1;
}

.arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-18%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #333;
  pointer-events: none;
}

.arrow.open {
  border-top: none;
  border-bottom: 5px solid #333;
}

@media (prefers-color-scheme: dark) {
  .arrow {
    border-top-color: #fff;
  }

  .arrow.open {
    border-bottom-color: #fff;
  }
}

.close {
  cursor: pointer;
  background-image: url("../../assets/i-close.svg");
  background-repeat: no-repeat;
  height: 24px;
  width: 24px;
}
</style>
