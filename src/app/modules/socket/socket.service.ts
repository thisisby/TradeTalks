import {Server, Socket} from "socket.io";
import MyChatService from "../my-chat/my-chat.service";
import SubChatService from "../sub-chat/sub-chat.service";
import MessageService from "../message/message.service";
import MsgS from "../../../services/message.service"
import ImageUploadService from "../../../services/image-upload.service";
import {CreateMessageDto} from "../message/message.interface";
import {CreateGroupMsgDto, CreatePersonalMsgDto, UserInRedis} from "./socket.interface";
import {Redis} from "../../../config/redis";
import {UserRedis} from "../auth/auth.interface";
import UserService from "../user/user.service";
import ChatService from "../chat/chat.service";
import {CategoryEnum} from "../../../constants/category.constant";
import {Chat} from "../chat/chat.entity";
import {Message} from "../message/message.entity";
import {Roles} from "../user/user.enum";
import {User} from "../user/user.entity";

class SocketService {
    async joinGroup(socketId: string, groupId: number) {
        await Redis.client.sAdd(`group:${groupId}`, socketId)
        console.log(`User ${socketId} joined group ${groupId}`);
    };

    async leaveAllGroups(socketId: string) {
        const groupIds = await Redis.client.keys('group:*');

        await Promise.all(
            groupIds.map(async (key) => {
                const groupId = key.split(':')[1];
                await Redis.client.sRem(`group:${groupId}`, socketId);
            })
        );

        console.log(`User ${socketId} left all groups`);
    }

    async leaveGroup(socketId: string, groupId: number) {
        await Redis.client.sRem(`group:${groupId}`, socketId);
        console.log(`User ${socketId} left group ${groupId}`);
    };

    async broadcastToGroup(groupId: number, data: any, io: Server) {
        const groupMembers = await Redis.client.sMembers(`group:${groupId}`);

        for (const socketId of groupMembers) {
            const user = await this.getUserBySocketId(socketId);
            if (user) {
                io.to(socketId).emit("getMessage", data);
            }
        }
    }

    async getUserBySocketId(socketId: string): Promise<UserInRedis | null> {
        const users = await Redis.client.hGetAll("users");

        const user = Object.values(users).find((u) => {
            const userData: UserInRedis = JSON.parse(u);
            return userData.socketId === socketId;
        });

        return user ? JSON.parse(user) : null;
    }

    async addUser(userId: number, socketId: string) {
        const user = await UserService.findById(userId);
        if(user) {
            const data: UserInRedis = {
                userId,
                socketId,
                online: false,
                device_token: user.device_token,
                name: user.name,
                phone: user.phone,
            }
            await Redis.client.hSet("users", userId, JSON.stringify(data));
            console.log("User " + userId + " connected");
        } else {
            console.log("User not found");
        }
    }

    async getUser(userId: number): Promise<UserRedis | null> {
        const userDataString = await Redis.client.hGet("users", userId.toString());

        if (userDataString) {
            return JSON.parse(userDataString);
        } else {
            return null;
        }
    }

    async updateUserStatus(userId: number, status: boolean) {
        const user = await this.getUser(userId);

        if (user) {
            user.online = status;
            await Redis.client.hSet("users", userId.toString(), JSON.stringify(user));
            console.log("user " + userId + " status updated to " + (status ? "online" : "offline"));
        } else {
            console.log("user " + userId + " not found");
        }
    }


    async removeUser(socketId: string) {
        const users = await Redis.client.hGetAll("users");

        const userIdToRemove = Object.keys(users).find(userId => {
            const userData = JSON.parse(users[userId]);
            return userData.socketId === socketId;
        });

        if (userIdToRemove) {
            await Redis.client.hDel("users", userIdToRemove);
            console.log("User with socketId " + socketId + " removed");
        } else {
            console.log("User with socketId " + socketId + " not found");
        }
    }


    async getPersonalChats(socketId: string, user_id: number) {
        let dto = [];
        const chats = await MyChatService.findMyChats(user_id);

        for (const myChat of chats) {
            const subChats = await SubChatService.findSubChatsByChatId(myChat.chat_id)

            for (const subChat of subChats) {
                const messages = await MessageService.findSubChatUnreadMessages(subChat.id, user_id)
                const lastMessage = await MessageService.findLastMessageInSubChat(subChat.id)
                dto.push({
                    myChat,
                    subChat,
                    messages,
                    lastMessage,
                })
            }
        }

        return dto
    }

    async sendGroupMessage(socket: Socket, data: CreateGroupMsgDto, io: Server) {
        const {text, photo, user_id, subChat_id, group_id, location_id} = data;
        const photoUrl = photo ? await ImageUploadService.uploadSinglePhotoBuffer(photo) : undefined;

        const dto: CreateMessageDto = {
            text,
            photo: photoUrl,
            user_id,
            subChat_id,
            location_id,
        };


        const subChat = await SubChatService.findSubChatById(subChat_id);
        const user = await UserService.findById(user_id);

        if (subChat?.isPinned && user?.role !== Roles.ADMIN) {
            throw new Error("subChat is pinned");
        }
        const newMessage = await MessageService.save(dto);
        const dtoMessage = await MessageService.findById(newMessage.id);
        if(subChat && dtoMessage) {
            const chat = await ChatService.findById(subChat.chat_id);
            if (chat) {
                await Promise.allSettled([
                    this.sendNotification(group_id, chat.id, dtoMessage, chat),
                    this.broadcastToGroup(group_id, dtoMessage, io)
                ]);
            }
        }

    }

    async sendNotification(groupId: number, chatId: number, dtoMessage: any, chat: Chat) {
        const groupMembers = await Redis.client.sMembers(`group:${groupId}`);

        const options = {
            where: {
                category_id: CategoryEnum.SUBSCRIBED,
                chat_id: chatId,
            },
        }
        const myChatsEntries = await MyChatService.findWithOptions(options);

        const usersToExclude = await Promise.all(
            groupMembers.map(async (socketId) => {
                const user = await this.getUserBySocketId(socketId);
                return user ? user.userId : null;
            })
        );

        const filteredUsers = myChatsEntries
            .map((entry) => entry.user_id)
            .filter((userId) => !usersToExclude.includes(userId));

        await Promise.all(
            filteredUsers.map(async (userId) => {
                const user = await UserService.findById(userId);
                if (user) {
                    console.log("Sending notification to:", user.id, user.name, user.device_token);
                    await MsgS.sendFcmNotification(user, dtoMessage, chat, null)
                }
            })
        );
    }


    async sendPersonalMessage(socket: Socket, data: CreatePersonalMsgDto, io: Server) {
        const {text, photo, user_id, subChat_id, receiver_id} = data;
        const photoUrl = photo ? await ImageUploadService.uploadSinglePhotoBuffer(photo) : undefined;

        const receiverSocketId = await this.getUser(receiver_id)
        const senderSocketId = await this.getUser(user_id)

        const dto: CreateMessageDto = {
            text,
            photo: photoUrl,
            user_id,
            subChat_id,
            isRead: receiverSocketId?.online,
        };


        const subChat = await SubChatService.findSubChatById(subChat_id);
        const user = await UserService.findById(user_id);

        if (subChat?.isPinned && user?.role !== Roles.ADMIN) {
            throw new Error("subChat is pinned");
        }
        const newMessage = await MessageService.save(dto);
        const dtoMessage = await MessageService.findById(newMessage.id)
        if(subChat && dtoMessage) {
            const chat = await ChatService.findById(subChat.chat_id);
            if (chat) {
                await Promise.allSettled([
                    this.sendPersonalNotification(dtoMessage, chat, receiver_id, user_id),
                    this.emitMessageToSocket(io, receiverSocketId?.socketId, dtoMessage),
                    this.emitMessageToSocket(io, senderSocketId?.socketId, dtoMessage),
                ]);
            }
        }
    }

    async emitMessageToSocket(io: Server, socketId: string | undefined, message: Message) {
        if (socketId) {
            io.to(socketId).emit("getMessage", message);
        }
    }

    async sendPersonalNotification(dtoMessage: any, chat: Chat, receiverId: number, senderId: number) {
        const userOnline = await this.getUser(receiverId);
        if (!userOnline || !userOnline?.online) {
            const receiver = await UserService.findById(receiverId);
            const sender = await UserService.findById(senderId);

            const options = {
                where: {
                    category_id: CategoryEnum.PERSONAL,
                    chat_id: chat.id,
                    is_notification: true,
                    receiver_id: receiverId,
                },
            }
            const myChatsEntries = await MyChatService.findWithOptions(options);

            if (myChatsEntries && receiver && sender) {
                console.log("Sending notification to: ", receiver)
                await MsgS.sendFcmNotification(receiver, dtoMessage, chat, sender)
            }
        }
    }
}

export default new SocketService()