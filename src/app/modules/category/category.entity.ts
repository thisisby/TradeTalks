import {Column, DataType, Model, Table} from "sequelize-typescript";
@Table({ tableName: "categories" })
export class Category extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false})
    name!: string;
}
