import { z } from "zod";

const create = z.object({ groupName: z.string({ message: "Group name is required!" }) })
const update = z.object({ groupName: z.string().optional() })


export const group_validation = {
    create,
    update
}