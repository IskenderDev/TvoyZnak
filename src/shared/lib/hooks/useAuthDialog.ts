import { useAuthDialogContext } from "@/app/providers/auth-dialog/AuthDialogContext";

export function useAuthDialog() {
  return useAuthDialogContext();
}
