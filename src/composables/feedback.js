import { ref } from "vue";

export const toastMessage = ref("");
export const dialogState = ref(null);

let toastTimer;

export function toast(message) {
  toastMessage.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2800);
}

export function openDialog(next) {
  dialogState.value = next;
}

export function closeDialog() {
  dialogState.value = null;
}
