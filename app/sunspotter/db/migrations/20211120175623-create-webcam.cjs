'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Webcams', {
      PKWebcam: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      webcamid: {
        type: Sequelize.STRING
      },
      imgurlLowRes: {
        type: Sequelize.STRING(1000)
      },
      imgurlMedRes: {
        type: Sequelize.STRING(1000)
      },
      imgurlHighRes: {
        type: Sequelize.STRING(1000)
      },
      title: {
        type: Sequelize.STRING(500)
      },
      location: {
        type: Sequelize.GEOMETRY('POINT', 4326)
      },
      city: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      countryCode: {
        type: Sequelize.STRING(2)
      },
      region: {
        type: Sequelize.STRING
      },
      regionCode: {
        type: Sequelize.STRING(10)
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Webcams');
  }
};