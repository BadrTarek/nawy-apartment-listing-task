import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

console.log(`\n\n\n\n ${process.env.NODE_ENV} \n\n\n\n`);

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hello from Node.js Backend!');
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});