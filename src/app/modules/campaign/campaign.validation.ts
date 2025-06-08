import { z } from "zod";

const create = z.object({
    groupId: z.string(),
    subject: z.string(),
    text: z.string(),
    html: z.string(),
    userId: z.string().optional()
});


export const campaign_validation = {
    create
}