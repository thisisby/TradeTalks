import {Column, DataType, Model, Table,} from 'sequelize-typescript';

@Table({tableName: 'tokens'})
export class Token extends Model {
    @Column({primaryKey: true, autoIncrement: true, type: DataType.INTEGER})
    id!: number;

    @Column({type: DataType.STRING, allowNull: false})
    token!: string;

    @Column({type: DataType.INTEGER, allowNull: false})
    user_id!: number;
}