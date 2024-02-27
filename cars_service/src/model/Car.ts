import { Sequelize, DataTypes } from "sequelize";

export const CarModel = (sequelize: Sequelize) => {
    return sequelize.define('car', {
        marque: DataTypes.STRING,
        modele: DataTypes.STRING,
        year: DataTypes.INTEGER,
        color: DataTypes.STRING,
    }, {
        timestamps: false,
    })
}