import { Sequelize } from 'sequelize';

class Database {
    
    static sequelize = null;

    static async init(dbname, username, password) {
        Database.sequelize = new Sequelize(dbname, username, password, {
            host: 'localhost',
            dialect: 'postgres'
        });
        await Database.sequelize.authenticate();
    }
}

export { Database };

