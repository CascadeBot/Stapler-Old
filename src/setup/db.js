const { MongoClient } = require('mongodb');

class Database {
    constructor(url) {
        this.rootClient = new MongoClient(url, {
            useUnifiedTopology: true
        });
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.rootClient.connect((err, client) => {
                this.client = client;
                if (err) return reject("Failed to connect to Mongodb");
                console.log("Connected successfully to server");
    
                this.db = client.db(process.env.DB_NAME);
                this.users = this.db.collection(process.env.DB_COLLECTION_USER);
                this.sessions = this.db.collection(process.env.DB_COLLECTION_SESSION);
                this.bot = this.db.collection(process.env.DB_COLLECTION_BOT);

                resolve(this);
            });
        })
    }
}

let database;

function getDB() {
    return database;
}

async function setupDB() {
    database = new Database(process.env.MONGO_CONNECTION_STRING);
    await database.connect();
}

module.exports = {
    setupDB,
    getDB
};
