const { MongoClient } = require('mongodb');

async function main() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('homestay_booking');
        const homestays = database.collection('homestays');

        const result = await homestays.deleteMany({});
        console.log(`Deleted ${result.deletedCount} homestays successfully.`);
    } finally {
        await client.close();
    }
}

main().catch(console.dir);
