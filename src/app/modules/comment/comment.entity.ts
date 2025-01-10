import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { Profile } from "../profile/profile.entity";
import { User } from "../user/user.entity";

@Table({ tableName: "comments" })
export class Comment extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    text!: string;

    @ForeignKey(() => Profile)
    @Column({ type: DataType.INTEGER, allowNull: false })
    profile_id!: number;

    @BelongsTo(() => Profile)
    profile!: Profile;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @BelongsTo(() => User, {onDelete: "CASCADE"})
    user!: User;
}
