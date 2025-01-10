import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../user/user.entity";
import { Message } from "../message/message.entity";
import { Chat } from "../chat/chat.entity";
import { Profile } from "../profile/profile.entity";
import { Comment } from "../comment/comment.entity";
import {ComplaintEnum} from "./complaint.enum";

@Table({ tableName: "complaints" })
export class Complaint extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING(1000), allowNull: false })
    text!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @BelongsTo(() => User, {onDelete: "CASCADE"})
    user!: User;

    @Column({ type: DataType.ENUM('MESSAGE', 'CHAT', 'COMMENT', 'PROFILE'), allowNull: true })
    entity_type?: ComplaintEnum;

    @ForeignKey(() => Message)
    @Column({ type: DataType.INTEGER, allowNull: true })
    message_id?: number;

    @BelongsTo(() => Message)
    message?: Message;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.INTEGER, allowNull: true })
    chat_id?: number;

    @BelongsTo(() => Chat, {onDelete: "CASCADE"})
    chat?: Chat;

    @ForeignKey(() => Profile)
    @Column({ type: DataType.INTEGER, allowNull: true })
    profile_id?: number;

    @BelongsTo(() => Profile, {onDelete: "CASCADE"})
    profile?: Profile;

    @ForeignKey(() => Comment)
    @Column({ type: DataType.INTEGER, allowNull: true })
    comment_id?: number;

    @BelongsTo(() => Comment, {onDelete: "CASCADE"})
    comment?: Comment;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    target_id!: number;

    @BelongsTo(() => User, {onDelete: "CASCADE"})
    target!: User;
}
