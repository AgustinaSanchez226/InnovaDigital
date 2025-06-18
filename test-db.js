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

        // Crear una colección de prueba
        const collection = db.collection("test");
        console.log("✅ Colección creada");

        // Insertar un documento de prueba
        const result = await collection.insertOne({ test: "conexión" });
        console.log("✅ Documento insertado:", result);

        // Leer el documento
        const findResult = await collection.findOne({ test: "conexión" });
        console.log("✅ Documento leído:", findResult);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        // Cerrar la conexión
        await client.close();
        console.log("✅ Conexión cerrada");
    }
}

testConnection(); 