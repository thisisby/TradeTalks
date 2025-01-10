import {Column, DataType, Model, Table} from "sequelize-typescript";
@Table({ tableName: "chat-types" })
export class ChatType extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false})
    title!: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isEditable!: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    isAvailable!: boolean;
}
