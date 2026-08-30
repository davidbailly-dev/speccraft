import express from 'express';

const app = express();
const port = process.env.port || 3000;

app.get('/', (req, res) => {
    res.send('Success !');
})

app.listen(port, () => {
    console.log(`SpecCraft backend in listening on port ${port}`)
})