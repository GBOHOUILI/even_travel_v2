import { useMutation } from "@tanstack/react-query";

import { contactApi } from "@/features/contact/api/contact.api";

export function useSendContactMessage() {
  return useMutation({
    mutationFn: contactApi.send,
  });
}
