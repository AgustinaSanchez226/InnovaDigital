const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = "mongodb://127.0.0.1:27017";
const dbName = "innova_digital";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
});

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Conectado a MongoDB");
        
        const db = client.db(dbName);
        
        // Verificar la conexión
        await db.command({ ping: 1 });
        console.log("✅ Ping exitoso a la base de datos");
        
        return db;
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
        throw error;
    }
}

// Función para cerrar la conexión
async function closeConnection() {
    try {
        await client.close();
        console.log("✅ Conexión cerrada");
    } catch (error) {
        console.error("❌ Error cerrando la conexión:", error);
    }
}

module.exports = { connectDB, closeConnection, client }; 