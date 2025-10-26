//@ts-ignore
import {SendMailClient} from "zeptomail";
import { configTransactionalEmail } from "./config";

const url = "https://api.zeptomail.in/v1.1/email";
const token = import.meta.env.ZEPTOMAIL_TOKEN;

const zeptoMailClient = new SendMailClient({url, token});

/**
 * @param email email address of receiver
 * @param name name of the receiver
 * @description sends transactional email to the receiver without using a template and without queueing
 */
export function sendTransactionalEmailWithoutTemplate (receiverEmail: string, receiverName: string, subject: string, content: string) {
    zeptoMailClient.sendMail({
        "from":{
            "address": configTransactionalEmail.fromAddress,
            "name": configTransactionalEmail.fromName,
        },
        "to":[
        {
        "email_address": 
            {
                "address": receiverEmail,
                "name": receiverName
            }
        }
    ],
    "reply_to":
    [
        {
            "address": configTransactionalEmail.replyAddress,
            "name": configTransactionalEmail.replyName
        }
    ],
    
    })

}