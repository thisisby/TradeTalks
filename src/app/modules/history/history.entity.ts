import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.entity";
import {Chat} from "../chat/chat.entity";

@Table({ tableName: "history" })
export class History extends Model {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId!: number;

    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.INTEGER, allowNull: false })
    chatId!: number;

    @BelongsTo(() => Chat)
    chat!: Chat;
}

