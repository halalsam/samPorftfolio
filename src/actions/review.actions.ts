"use server";

import { z } from "zod";
import { appendReviewRow } from "@/lib/google-sheets";

const reviewSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  project: z.string().min(2, "Enter the project name"),
  rating: z.coerce.number().min(1).max(5),
  feedback: z.string().min(10, "Feedback needs a bit more detail"),
});

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof reviewSchema>, string>>;
};

export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const parsed = reviewSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    project: formData.get("project"),
    rating: formData.get("rating"),
    feedback: formData.get("feedback"),
  });

  if (!parsed.success) {
    const fieldErrors: ReviewFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof reviewSchema>;
      fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors };
  }

  try {
    await appendReviewRow(parsed.data);
    return { status: "success" };
  } catch (err) {
    console.error("Review submission failed:", err);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again.",
    };
  }
}
