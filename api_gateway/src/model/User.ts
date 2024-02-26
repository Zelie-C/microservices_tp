import { Sequelize, DataTypes } from "sequelize";

export const UserModel = (sequelize: Sequelize) => {
    return sequelize.define('user', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
    }, {
        timestamps: false,
    })
}