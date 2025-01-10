import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Chat} from "../chat/chat.entity";
import {Profile} from "../profile/profile.entity";
import {Message} from "../message/message.entity";

@Table({ tableName: "sub-chats" })
export class SubChat extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false})
    title!: string;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.INTEGER, allowNull: false})
    chat_id!: number;

    @BelongsTo(() => Chat, {onDelete: "CASCADE"})
    chat!: Chat;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isPinned!: boolean;

    @HasMany(() => Message, "subChat_id")
    messages!: Message[]
}
