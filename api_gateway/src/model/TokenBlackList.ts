import { Sequelize, DataTypes } from "sequelize";

export const TokenBlacklistModel = (sequelize: Sequelize) => {
        return sequelize.define('tokenblacklist', {
            token: DataTypes.STRING,
        })
    }
