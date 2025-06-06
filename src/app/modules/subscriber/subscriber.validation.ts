import { z } from "zod";

const subSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
});

// Schema for the main `subscriber_schema`
export const create = z.object({
    accountId: z.string().optional(),
    groupId: z.string(),
    subscribers: z.array(subSchema).optional(),
});

export const subscriber_validation = {
    create
}