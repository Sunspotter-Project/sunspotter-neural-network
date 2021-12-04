'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Webcam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Webcam.init({
    PKWebcam: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    webcamid: DataTypes.STRING,
    imgurlLowRes: DataTypes.STRING,
    imgurlMedRes: DataTypes.STRING,
    imgurlHighRestitle: DataTypes.STRING,
    title: DataTypes.STRING,
    location: DataTypes.GEOMETRY('POINT', 4326),
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    countryCode: DataTypes.STRING,
    region: DataTypes.STRING,
    regionCode: DataTypes.STRING,
    status: DataTypes.STRING 
  }, {
    sequelize,
    modelName: 'Webcam',
  });
  return Webcam;
};