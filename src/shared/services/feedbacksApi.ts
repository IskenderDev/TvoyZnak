import { z } from "zod";
import apiClient from "@/shared/api/client";

export interface FeedbackRequestPayload {
  fullName: string;
  phoneNumber: string;
  carNumber: string;
  feedbackType: string;
}

export interface FeedbackTypeOption {
  value: string;
  label: string;
  description?: string;
}

const feedbackTypeSchema = z
  .object({
    code: z.string().optional(),
    value: z.string().optional(),
    label: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    title: z.string().optional(),
  })
  .passthrough();

const feedbackRequestSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    feedbackType: z.string().optional(),
    carNumber: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

const typesListSchema = z.array(feedbackTypeSchema);

const pickString = (values: Array<unknown | undefined>): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const formatLabel = (value: string): string => {
  if (!value) return "";
  const words = value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const feedbacksApi = {
  async getTypes(): Promise<FeedbackTypeOption[]> {
    const response = await apiClient.get("/api/feedbacks/types");
    const parsed = typesListSchema.safeParse(response.data);
    if (!parsed.success) {
      console.error("Failed to parse feedback types", parsed.error);
      return [];
    }

    return parsed.data.map((item, index) => {
      const value = pickString([item.value, item.code, item.label, item.title, item.name]) || `type-${index}`;
      return {
        value,
        label: pickString([item.label, item.title, formatLabel(value)]) || formatLabel(value),
        description: pickString([item.description]),
      } satisfies FeedbackTypeOption;
    });
  },

  async create(payload: FeedbackRequestPayload) {
    const response = await apiClient.post("/api/feedbacks", payload);
    const parsed = feedbackRequestSchema.safeParse(response.data);
    if (!parsed.success) {
      console.error("Failed to parse feedback response", parsed.error);
      return;
    }
    return parsed.data;
  },
};
