const { MongoClient } = require('mongodb');

async function seedDatabase() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("innova_digital");

        // Insertar productos de prueba
        const products = [
            {
                name: "Teclado Mecánico",
                price: 89.99,
                description: "Teclado mecánico gaming RGB",
                category: "perifericos",
                image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
                stock: 10
            },
            {
                name: "Mouse Gaming",
                price: 49.99,
                description: "Mouse gaming RGB",
                category: "perifericos",
                image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
                stock: 15
            }
        ];

        await db.collection("products").insertMany(products);
        console.log("✅ Productos de prueba insertados");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
    }
}

seedDatabase(); 