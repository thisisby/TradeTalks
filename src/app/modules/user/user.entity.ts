import {BelongsTo, Column, DataType, ForeignKey, Model, Table,} from "sequelize-typescript";

import {Location} from "../location/location.entity";
import {Roles} from "./user.enum";

@Table({tableName: "users"})
export class User extends Model {
    @Column({primaryKey: true, autoIncrement: true, type: DataType.INTEGER})
    id!: number;

    @Column({type: DataType.STRING(50), allowNull: true})
    name?: string;

    @Column({type: DataType.STRING(20), unique: true, allowNull: false})
    phone!: string;

    @Column({type: DataType.STRING, allowNull: true})
    device_token?: string;

    @ForeignKey(() => Location)
    @Column({type: DataType.INTEGER, allowNull: true})
    location_id?: number;

    @BelongsTo(() => Location, {onDelete: "SET NULL"})
    location?: Location;

    @Column({ type: DataType.STRING, allowNull: true })
    avatar?: string;

    @Column({ type: DataType.ENUM(Roles.CLIENT, Roles.ADMIN), defaultValue: Roles.CLIENT })
    role!: Roles;

    @Column({ type: DataType.DATE, allowNull: true })
    signInTime!: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    blockedUntil?: Date;

    @Column({ type: DataType.STRING, allowNull: true })
    blockReason?: string;
}
