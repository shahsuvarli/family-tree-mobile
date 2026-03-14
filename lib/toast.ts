import Toast from "react-native-toast-message";

interface ShowToastOptions {
  bottomOffset?: number;
}

export function showToast(
  type: "success" | "error",
  text1: string,
  text2: string,
  options: ShowToastOptions = {},
) {
  Toast.show({
    type,
    text1,
    text2,
    position: "bottom",
    bottomOffset: options.bottomOffset ?? 100,
    swipeable: true,
  });
}

export function showSuccessToast(
  text1: string,
  text2: string,
  options?: ShowToastOptions,
) {
  showToast("success", text1, text2, options);
}

export function showErrorToast(
  text1: string,
  text2: string,
  options?: ShowToastOptions,
) {
  showToast("error", text1, text2, options);
}
