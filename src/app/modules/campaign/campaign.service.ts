import { Request } from "express";
import { Campaign_Model } from "./campaign.schema";
import { TCampaign } from "./campaign.interface";
import httpStatus from 'http-status';
import { AppError } from "../../utils/app_error";
import { Group_Model } from "../group/group.schema";
import { Account_Model } from "../auth/auth.schema";
import { Subscriber_Model } from "../subscriber/subscriber.schema";
import { Sub } from "../subscriber/subscriber.interface";
import sendMail from "../../utils/mail_sender";
import sendElasticEmail from "../../utils/elasticEmail";



const save_campaign_into_db = async (payload: TCampaign, email: string) => {
    const isExistUser = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false })
    if (!isExistUser) {
        throw new AppError("You are not authorized or block account", httpStatus.BAD_REQUEST)
    }

    // check group exist
    const isGroupExist = await Group_Model.findOne({ _id: payload.groupId, accountId: isExistUser._id })
    if (!isGroupExist) {
        throw new AppError("Group not found!!", httpStatus.BAD_REQUEST)
    }
    // check already campaign name exist
    const isCampaignExist = await Campaign_Model.findOne({ subject: payload.subject, userId: isExistUser._id, groupId: isGroupExist._id })
    if (isCampaignExist) {
        throw new AppError("Campaign name already exist!!", httpStatus.BAD_REQUEST)
    }

    // create new payload
    const campaign_payload: TCampaign = {
        ...payload,
        userId: isExistUser._id,
        groupId: isGroupExist._id
    }
    const result = await Campaign_Model.create(campaign_payload)
    return result;
}

const get_all_campaign_from_db = async (email: string) => {
    // find account exist
    const isExistUser = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false })
    if (!isExistUser) {
        throw new AppError("You are not authorized or block account", httpStatus.BAD_REQUEST)
    }
    const result = await Campaign_Model.find({ userId: isExistUser._id }).populate("groupId")
    return result
}
const get_single_campaign_from_db = async (email: string, campaignId: string) => {
    // find account exist
    const isExistUser = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false })
    if (!isExistUser) {
        throw new AppError("You are not authorized or block account", httpStatus.BAD_REQUEST)
    }
    const result = await Campaign_Model.find({ userId: isExistUser._id, _id: campaignId }).populate("groupId")
    if (!result) {
        throw new AppError("Campaign not found!!", httpStatus.OK)
    }
    return result
}
const update_campaign_into_db = async (req: Request) => {
    const { email } = req.user!
    const { id } = req?.params
    const payload: Partial<TCampaign> = req?.body;
    // find account exist
    const isExistUser = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false })
    if (!isExistUser) {
        throw new AppError("You are not authorized or block account", httpStatus.BAD_REQUEST)
    }
    const isExistCampaign = await Campaign_Model.find({ userId: isExistUser._id, _id: id })
    if (!isExistCampaign) {
        throw new AppError("Campaign not found!!", httpStatus.OK)
    }
    // update campaign
    const result = await Campaign_Model.findOneAndUpdate({ userId: isExistUser._id, _id: id }, payload, { new: true })

    return result
}
const delete_campaign_into_db = async (req: Request) => {
    const { email } = req.user!
    const { id } = req?.params
    // find account exist
    const isExistUser = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false })
    if (!isExistUser) {
        throw new AppError("You are not authorized or block account", httpStatus.BAD_REQUEST)
    }
    const isExistCampaign = await Campaign_Model.find({ userId: isExistUser._id, _id: id })
    if (!isExistCampaign) {
        throw new AppError("Campaign not found!!", httpStatus.OK)
    }
    // update campaign
    await Campaign_Model.findOneAndDelete({ userId: isExistUser._id, _id: id })

    return
}

// const start_mailing_with_campaign = async (req: Request) => {
//     const { email } = req.user!;
//     const { id } = req.params;

//     try {
//         // Find user
//         const isExistUser = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
//         if (!isExistUser) {
//             throw new AppError("You are not authorized or block account", httpStatus.BAD_REQUEST);
//         }

//         // Find campaign
//         const isExistCampaign = await Campaign_Model.findOne({ userId: isExistUser._id, _id: id });
//         if (!isExistCampaign) {
//             throw new AppError("Campaign not found!!", httpStatus.NOT_FOUND);
//         }

//         // Find subscriber group
//         const subscriber = await Subscriber_Model.findOne({ accountId: isExistUser._id, groupId: isExistCampaign.groupId });
//         if (!subscriber || !Array.isArray(subscriber.subscribers)) {
//             throw new AppError("No subscribers found for this campaign group", httpStatus.NOT_FOUND);
//         }

//         const total = subscriber.subscribers.length;
//         let sent = 0;

//         for (const sub of subscriber.subscribers) {
//             const mailRes = await sendMail(sub.email, isExistCampaign.subject, isExistCampaign.text, isExistCampaign.html);
//             console.log(mailRes)
//             sent++;
//         }
//         await Campaign_Model.findOneAndUpdate({ userId: isExistUser._id, _id: id }, { isDelivered: true })
//         // Return progress summary
//         return {
//             totalMails: total,
//             mailsSent: sent,
//         };
//     } catch (err) {
//         throw new AppError("Email send failed !", 400)
//     }
// };


const start_mailing_with_campaign = async (req: Request) => {
    const { email } = req.user!;
    const { id } = req.params;

    // try {
    const io = req.app.get("io");

    const isExistUser = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isExistUser) throw new AppError("You are not authorized", 400);

    const isExistCampaign = await Campaign_Model.findOne({ userId: isExistUser._id, _id: id });
    if (!isExistCampaign) throw new AppError("Campaign not found", 404);

    const subscriber = await Subscriber_Model.findOne({ accountId: isExistUser._id, groupId: isExistCampaign.groupId });
    if (!subscriber || !Array.isArray(subscriber.subscribers)) throw new AppError("No subscribers found", 404);

    const total = subscriber.subscribers.length;
    let sent = 0;
    for (const sub of subscriber.subscribers) {
        await sendElasticEmail(sub.email, isExistCampaign.subject, isExistCampaign.html);
        sent++;

        io.emit("mail-progress", {
            sent,
            total,
        });
    }

    await Campaign_Model.findOneAndUpdate({ userId: isExistUser._id, _id: id }, { isDelivered: true });

    return { totalMails: total, mailsSent: sent };
    // } catch (err) {
    //     throw new AppError("Email send failed", 400);
    // }
};
const send_test_mail = async (email: string) => {
    sendElasticEmail(email, "Hello", "hello")
    return null
}



export const campaign_services = {
    save_campaign_into_db,
    get_all_campaign_from_db,
    get_single_campaign_from_db,
    update_campaign_into_db,
    delete_campaign_into_db,
    start_mailing_with_campaign,
    send_test_mail

}