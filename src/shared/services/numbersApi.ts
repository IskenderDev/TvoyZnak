import { z } from "zod";

import apiClient from "@/shared/api/client";

const NumberItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    plate: z.string().min(1),
    region: z.string().min(1),
    price: z.coerce.number().positive(),
    comment: z.string().nullish(),
    phone: z.string().nullish(),
  })
  .passthrough();

export type NumberItem = z.infer<typeof NumberItemSchema>;

const CreateNumberPayloadSchema = z.object({
  plate: z.string().min(1),
  region: z.string().min(1),
  price: z.number().positive(),
  comment: z.string().optional(),
  phone: z.string().optional(),
});

export type CreateNumberPayload = z.infer<typeof CreateNumberPayloadSchema>;

const normalizePayload = (payload: CreateNumberPayload) => ({
  ...payload,
  comment: payload.comment?.trim() ? payload.comment.trim() : undefined,
  phone: payload.phone?.trim() ? payload.phone.trim() : undefined,
});

export const numbersApi = {
  async create(payload: CreateNumberPayload): Promise<NumberItem> {
    const parsed = CreateNumberPayloadSchema.parse(payload);
    const body = normalizePayload(parsed);
    const response = await apiClient.post("/api/numbers", body, {
      requiresAuth: true,
    });
    return NumberItemSchema.parse(response.data);
  },
};

export { NumberItemSchema, CreateNumberPayloadSchema };
