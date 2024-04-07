const fastify = require('fastify')();
const mysql = require('mysql');

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Register fastify-formbody to parse JSON request bodies
fastify.register(require('fastify-formbody'));

// Define route to handle POST request to save coordinates
fastify.post('/saveCoords', async (request, reply) => {
    const { latitude, longitude } = request.body;

    // Insert the coordinates into the database
    const sql = 'INSERT INTO coords_data (lat, lng) VALUES (?, ?)';
    db.query(sql, [latitude, longitude], (err, result) => {
        if (err) {
            console.error('Error saving coordinates:', err);
            reply.code(500).send({ error: 'Failed to save coordinates' });
            return;
        }
        console.log('Coordinates saved successfully');
        reply.code(200).send({ success: true });
    });
});

// Start the Fastify server
fastify.listen(3000, (err) => {
    if (err) throw err;
    console.log('Server is running on port 3000');
});
