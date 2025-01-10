import {Server, Socket} from "socket.io";
import SocketValidator from "./socket.validator";
import {CreateGroupMsgDto, CreatePersonalMsgDto, UserStatus} from "./socket.interface"
import SocketService from "./socket.service";


class SocketController {
    private readonly io: Server;

    constructor(io: Server) {
        this.io = io;
        this.initializeSocket();
    }

    private initializeSocket() {
        this.io.on('connection', (socket: Socket) => {
            console.log(`${socket.id} connected.`);

            socket.on("addUser", (userId: number) => this.handleAddUser(socket, userId));
            socket.on("sendPersonalMessage", (data: CreatePersonalMsgDto) => this.handleSendPersonalMessage(socket, data));
            socket.on("sendGroupMessage", (data: CreateGroupMsgDto) => this.handleSendGroupMessage(socket, data));
            socket.on("joinGroup", (groupId: number) => this.handleJoinGroup(socket, groupId));
            socket.on("leaveGroup", (groupId: number) => this.handleLeaveGroup(socket, groupId));

            socket.on("requestPersonalChats", (userId: number) => this.handleGetPersonalChats(socket, userId));
            socket.on("setStatus", (data: UserStatus) => this.handleStatus(socket, data));

            socket.on('disconnect', () => this.handleDisconnect(socket));
        });
    }

    private async handleAddUser(socket: Socket, userId: number) {
        try {
            await SocketService.addUser(userId, socket.id)
        } catch (e) {
            socket.emit('error', {message: e});
        }
    }

    private async handleSendPersonalMessage(socket: Socket, data: CreatePersonalMsgDto) {
        try {
            const isValidRequest = SocketValidator.createPersonalMsgValidator(socket, data)

            if (isValidRequest) {
                await SocketService.sendPersonalMessage(socket, data, this.io)
            }
        } catch (e) {
            console.error(e);
            socket.emit('error', {message: e});
        }
    }

    private async handleSendGroupMessage(socket: Socket, data: CreateGroupMsgDto) {
        try {
            const isValidRequest = SocketValidator.createGroupMsgValidator(socket, data)
            if (isValidRequest) {
                await SocketService.sendGroupMessage(socket, data, this.io)
            }

        } catch (e) {
            console.error(e);
            socket.emit('error', {message: e});
        }
    }

    private async handleJoinGroup(socket: Socket, group_id: number) {
        try {
            await SocketService.joinGroup(socket.id, group_id)
        } catch (e) {
            socket.emit('error', {message: e});
        }
    }

    private async handleLeaveGroup(socket: Socket, group_id: number) {
        try {
            await SocketService.leaveGroup(socket.id, group_id)

        } catch (e) {
            socket.emit('error', {message: e});

        }

    }

    private async handleDisconnect(socket: Socket) {
        try {
            await SocketService.removeUser(socket.id);
            await SocketService.leaveAllGroups(socket.id)
        } catch (e) {
            socket.emit('error', {message: e});
        }
    }

    private async handleGetPersonalChats(socket: Socket, userId: number) {
        try {
            const dto = await SocketService.getPersonalChats(socket.id, userId);
            const user = await SocketService.getUser(userId)

            if (user) {
                this.io.to(user?.socketId).emit("getPersonalChats", dto);
            }
        } catch (e) {
            socket.emit('error', {message: e});
        }

    }

    private async handleStatus(socket: Socket, data: UserStatus) {
        try {
            await SocketService.updateUserStatus(data.userId, data.status)
            console.log(`user: ${data.userId} is going online`)
        } catch (e) {
            socket.emit('error', {message: e});
        }
    }
}

export default SocketController;
