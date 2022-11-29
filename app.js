const express = require('express');

const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send('Hello From the server Side!!');
})

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})