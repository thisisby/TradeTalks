import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { User } from "../user/user.entity";
import {Comment} from "../comment/comment.entity"
import {Like} from "../like/like.entity";
@Table({ tableName: "profiles" })
export class Profile extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: "main"})
    name!: string;

    @Column({ type: DataType.STRING(2048), allowNull: false })
    description!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    main_photo?: string;

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    additional_photos?: string[];

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @BelongsTo(() => User, {onDelete: "CASCADE"})
    user!: User;

    @HasMany(() => Comment)
    comments!: Comment[];

    @HasMany(() => Like)
    likes!: Like[];
}
