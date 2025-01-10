import { Table, Column, DataType, Model, HasOne } from "sequelize-typescript";
import { User } from "../user/user.entity";

@Table({ tableName: "locations" })
export class Location extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING(80), allowNull: false })
  name!: string;

  @HasOne(() => User, "location_id")
  user!: User;
}
