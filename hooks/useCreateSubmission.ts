// src/hooks/useCreateSubmission.ts
import { useMutation } from "@tanstack/react-query";

export interface SubmissionPayload {
  name: string;
  contact_info: string;
  description: string;
}

const submitContact = async (payload: SubmissionPayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await fetch(`${baseUrl}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("خطا در برقراری ارتباط با فرکانس امن");
  }
  
  return response.json();
};

export function useCreateSubmission() {
  return useMutation({
    mutationFn: submitContact,
  });
}