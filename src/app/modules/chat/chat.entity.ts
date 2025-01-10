import {BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, Table} from "sequelize-typescript";
import { User } from "../user/user.entity";
import {ChatType} from "../chat-type/chat-type.entity";
import {Location} from "../location/location.entity"
import {SubChat} from "../sub-chat/sub-chat.entity";
@Table({ tableName: "chats" })
export class Chat extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false})
    @Index
    title!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    photo?: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    @Index
    user_id!: number;

    @BelongsTo(() => User, {onDelete: "SET NULL"})
    user!: User;

    @ForeignKey(() => ChatType)
    @Column({ type: DataType.INTEGER, allowNull: true })
    @Index
    type_id!: number;

    @BelongsTo(() => ChatType, {onDelete: "SET NULL"})
    type!: ChatType;

    @ForeignKey(() => Location)
    @Column({ type: DataType.INTEGER, allowNull: true })
    @Index
    location_id?: number;

    @BelongsTo(() => Location, {onDelete: "SET NULL"})
    location!: Location;

    @HasMany(() => SubChat)
    subChats!: SubChat[];

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isPersonal!: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isLocationPinned!: boolean;


}
