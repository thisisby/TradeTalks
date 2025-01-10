import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { User } from "../user/user.entity";
import {SubChat} from "../sub-chat/sub-chat.entity";
import {Location} from "../location/location.entity"
@Table({ tableName: "messages" })
export class Message extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING(1000), allowNull: false })
    text!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    photo?: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRead!: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    user_id!: number;

    @BelongsTo(() => User, {onDelete: "SET NULL"})
    user!: User;

    @ForeignKey(() => SubChat)
    @Column({ type: DataType.INTEGER, allowNull: false })
    subChat_id!: number;

    @BelongsTo(() => SubChat, {onDelete: "CASCADE"})
    subChat!: SubChat;

    @ForeignKey(() => Location)
    @Column({ type: DataType.INTEGER, allowNull: true })
    location_id!: number;

    @BelongsTo(() => Location, {onDelete: "CASCADE"})
    location!: Location;
}
