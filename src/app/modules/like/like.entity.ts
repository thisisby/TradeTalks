import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { Profile } from "../profile/profile.entity";
import { User } from "../user/user.entity";

@Table({ tableName: "likes" })
export class Like extends Model {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @ForeignKey(() => Profile)
    @Column({ type: DataType.INTEGER, allowNull: false })
    profile_id!: number;

    @ForeignKey(() => Profile)
    profile!: Profile;

    @ForeignKey(() => User)
    user!: User;
}
