const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('<h1>SIT323 Task 2.1P: Node.js and Express</h1>');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});