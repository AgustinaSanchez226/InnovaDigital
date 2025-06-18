const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        // Conectar a MongoDB
        await client.connect();
        console.log("✅ Conectado a MongoDB");

        // Seleccionar la base de datos
        const db = client.db("innova_digital");
        console.log("✅ Base de datos seleccionada");

        // Crear un usuario de prueba
        const usersCollection = db.collection("users");
        const testUser = {
            name: "Usuario Prueba",
            email: "test@test.com",
            password: "test123",
            createdAt: new Date()
        };

        // Insertar usuario de prueba
        const result = await usersCollection.insertOne(testUser);
        console.log("✅ Usuario de prueba creado:", result);

        // Verificar que el usuario se creó
        const user = await usersCollection.findOne({ email: "test@test.com" });
        console.log("✅ Usuario encontrado:", user);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
        console.log("✅ Conexión cerrada");
    }
}

testConnection(); 