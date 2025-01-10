import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Chat} from "../chat/chat.entity";
import {User} from "../user/user.entity";
import {Category} from "../category/category.entity";

@Table({ tableName: "my-chats" })
export class MyChats extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    is_notification!: boolean;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.INTEGER, allowNull: false})
    chat_id!: number;

    @BelongsTo(() => Chat,  { onDelete: "CASCADE" })
    chat!: Chat;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false})
    user_id!: number;

    @BelongsTo(() => User, { foreignKey: 'user_id', as: 'user', onDelete: "CASCADE"})
    user!: User;

    @ForeignKey(() => Category)
    @Column({ type: DataType.INTEGER, allowNull: true})
    category_id!: number;

    @BelongsTo(() => Category, {onDelete: "SET NULL"})
    category!: Category;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true})
    receiver_id!: number;

    @BelongsTo(() => User, { foreignKey: 'receiver_id', as: 'receiver' })
    receiver!: User;
}
