import { app } from './app';

// Configure le serveur Express
const port = process.env.PORT || 3000;

// Lance le serveur Express
app.listen(port, () => {
    console.log(`SpecCraft backend is listening on port ${port}`)
})