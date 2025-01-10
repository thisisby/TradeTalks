import axios from "axios";
import {BOT_TOKEN, EXPIRY_TIME, LOGS_CHAT_ID, SMS} from "../config/settings";
import moment from "moment";
import {Redis} from "../config/redis";
import logger from "../config/logger";
import {google} from "googleapis";
import * as https from "https";
import {User} from "../app/modules/user/user.entity"
import {Chat} from "../app/modules/chat/chat.entity";
import Key from "./key.json"

const PROJECT_ID = 'alln-5b98f';
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

class MessageService {
    async sendSmsMessage(phone: string, code: number): Promise<void> {
        await axios.post(
            `${SMS.url}/Message/SendSmsMessage?apiKey=${SMS.apiKey}`,
            {
                recipient: phone,
                text: `Ваш код подтверждения для ${SMS.from}: ${code}`,
            }
        );
    }

    async sendTelegramMessage(phone: string, code: number): Promise<void> {
        await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: LOGS_CHAT_ID,
                text: `Номер телефона: *${phone}*\nКод: *${code}*\nДата: *${new Date().toLocaleString()}*\n` +
                    `Expires: *${EXPIRY_TIME}s* (${moment().add(EXPIRY_TIME, "seconds").format("HH:mm:ss DD.MM.YYYY")})`,
                parse_mode: "Markdown",
            }
        );
    }

    async sendFcmMessage(fcmMessage: any) {
        try {
            const accessToken = await getAccessToken();

            const options = {
                hostname: HOST,
                path: PATH,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };

            const request = https.request(options, function (resp) {
                resp.setEncoding('utf8');
                resp.on('data', function (data) {
                    console.log('Message sent to Firebase for delivery, response:');
                    console.log(data);
                });
            });

            request.on('error', function (err) {
                console.log('Unable to send message to Firebase');
                console.log(err);
            });

            request.write(JSON.stringify(fcmMessage));
            request.end();
        } catch (err) {
            console.error('Error obtaining access token:', err);
        }
    }


    async buildCommonMessage(user: User, data: any, chat: Chat, sender: User | null) {
        let title = chat.isPersonal ? (sender ? sender.name : "Неизвестный пользователь") : chat.title;
        return {
            'message': {
                'token': user.device_token,
                'notification': {
                    'title': title,
                    'body': data.text,
                },
                "data": {
                    'isPersonal': chat.isPersonal.toString(),
                    'chat_id': chat.id.toString(),
                },
                "android": {
                    "ttl": "86400s",
                    "notification":{
                        "click_action":"FLUTTER_NOTIFICATION_CLICK",
                        "channel_id": "Default Notification Channel Id",
                        "icon": "icon_transparent",
                        "color": "#FFA000"
                    }
                },
                "apns": {
                    "headers": {
                        "apns-priority": "10",
                    },
                    "payload": {
                        "aps": {
                            "alert": {
                                'title': title,
                                'body': data.text,
                            },
                            "sound": "default",
                        }
                    }
                }
            }
        };
    }

    async sendFcmNotification(user: User, data: any, chat: Chat, sender: User | null): Promise<void> {
        try {
            const fcmMessage = await this.buildCommonMessage(user, data, chat, sender);
            await this.sendFcmMessage(fcmMessage);
        } catch (err) {
            console.error('Error sending FCM notification:', err);
        }
    }
}

async function getAccessToken() {
    const jwtClient = new google.auth.JWT(
        Key.client_email,
        undefined,
        Key.private_key,
        SCOPES,
        undefined
    );

    try {
        const tokens = await jwtClient.authorize();
        return tokens?.access_token;
    } catch (err) {
        console.error('could not get google auth token', err);
    }
}


export default new MessageService();