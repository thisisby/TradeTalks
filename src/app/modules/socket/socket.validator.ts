import {Socket} from "socket.io";
import {CreateGroupMsgDto, CreatePersonalMsgDto} from "./socket.interface";

class SocketValidator {
    createPersonalMsgValidator(socket: Socket, dto: CreatePersonalMsgDto) {
        const {text, user_id, subChat_id, receiver_id} = dto;

        if (!text) {
            socket.emit('error', {message: 'text is required'});
            return false;
        }
        if (!user_id) {
            socket.emit('error', {message: 'user_id is required'});
            return false;
        }
        if (!subChat_id) {
            socket.emit('error', {message: 'subChat_id is required'});
            return false;
        }
        if (!receiver_id) {
            socket.emit('error', {message: 'receiver_id is required'});
            return false;
        }

        return true;
    }

    createGroupMsgValidator(socket: Socket, dto: CreateGroupMsgDto) {
        const {text, user_id, subChat_id, group_id} = dto;

        if (!text) {
            socket.emit('error', {message: 'text is required'});
            return false
        }
        if (!user_id) {
            socket.emit('error', {message: 'user_id is required'});
            return false
        }
        if (!subChat_id) {
            socket.emit('error', {message: 'subChat_id is required'});
            return false
        }
        if (!group_id) {
            socket.emit('error', {message: 'group_id is required'});
            return false
        }

        return true

    }
}

export default new SocketValidator()