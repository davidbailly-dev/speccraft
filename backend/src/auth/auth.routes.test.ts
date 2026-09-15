import { app } from '../app';
import { pool } from '../config/db';
import request from 'supertest';
import { memoryStore, RATE_LIMIT } from './auth.rateLimit';
import { MSG_WRONG_EMAIL_OR_PASSWORD } from './auth.routes';

//
// Tests '/auth/register'
//

describe('POST /auth/register', function() {
    it('Inscription réussie -> 201, body contient user.id et user.email', function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";

        return request(app)
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });
    });

    it('Email ou mot de passe absent/mauvais type -> 400', function() {
        const password = 'abc123';

        return request(app)
            .post('/auth/register')
            .send({
                password,
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    errors: expect.arrayContaining([expect.any(String)])
                });
            });
    });

    it('Email au format invalide -> 400', function() {
        const email = 'fakeemail';
        const password = '1234abC!';

        return request(app)
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    errors: expect.arrayContaining([expect.any(String)])
                });
            });
    });

    it('Mot de passe invalide -> 400', function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = 'abc';

        return request(app)
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    errors: expect.arrayContaining([expect.any(String)])
                });
            });
    });

    it('Email déjà utilisé -> 409', async function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";

        // Crée un utilisateur
        await request(app)
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        // Tente de créer un utilisateur avec le même email
        return request(app)
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(409)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    errors: expect.arrayContaining([expect.any(String)])
                });
            });
    });

    it('Inscription réussie, session utilisateur créée', async function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";

        // Crée un agent pour conserver le cookie sid reçu
        // dans la réponse de "/auth/register" pour tester la session avec "/auth/me"
        const agent = request.agent(app);

        // Crée un utilisateur
        await agent
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        // Vérifie la route /auth/me qui confirme si la session a bien été créée
        return agent
            .get('/auth/me')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });
    });
})

//
// Tests '/auth/login'
//

describe('POST /auth/login', function() {
    it('Connexion réussie', async function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";

        // Crée un utilisateur
        await request(app)
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        // Connecte l'utilisateur
        return request(app)
            .post('/auth/login')
            .send({
                email,
                password,
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });
    });

    it('Email inconnu', async function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";

        return request(app)
            .post('/auth/login')
            .send({
                email,
                password,
            })
            .expect(401)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    errors: [MSG_WRONG_EMAIL_OR_PASSWORD]
                });
            });
    });

    it('Mot de passe incorrect', async function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";
        const agent = request.agent(app);

        // Crée un utilisateur
        await agent
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        const wrongPassword = "uvwxyZ9?";

        // Tente de connecter l'utilisateur avec un mot de passe incorrect
        return agent
            .post('/auth/login')
            .send({
                email,
                password: wrongPassword,
            })
            .expect(401)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    errors: [MSG_WRONG_EMAIL_OR_PASSWORD]
                });
            });
    });

    it('Connexion réussie, session utilisateur créée', async function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";
        const agent = request.agent(app);

        // Crée un utilisateur
        await agent
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        // Connecte l'utilisateur
        await agent
            .post('/auth/login')
            .send({
                email,
                password,
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        // Vérifie si la session utilisateur a bien été créée
        return agent
            .get('/auth/me')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });
    });

    it('Nombre de tentatives de connexion dépassée', async function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";
        const agent = request.agent(app);

        // Crée un utilisateur
        await agent
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        // Met à zéro le rate limit éventuellement incrémenté
        // par d'autres tests dans ce fichier
        memoryStore.resetAll();

        const wrongPassword = "uvwxyZ9?";

        // Tente de connecter l'utilisateur avec un mot de passe incorrect
        for (let attempts = 1; attempts <= RATE_LIMIT; attempts++) {
            await agent
                .post('/auth/login')
                .send({
                    email,
                    password: wrongPassword,
                })
                .expect(401)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).toEqual({
                        errors: expect.arrayContaining([expect.any(String)])
                    });
                });
        }

        // Tente de connecter l'utilisateur avec le bon mot de passe
        return agent
            .post('/auth/login')
            .send({
                email,
                password,
            })
            .expect(429)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    errors: expect.arrayContaining([expect.any(String)])
                });
            });
    }, 10000); // On définit une marge de 10 000 ms de timeout par sécurité pour passer les tests locaux sur un ordinateur peu performant

    it('La session existante a bien été regénérée', async function() {
        const email = crypto.randomUUID() + '@fakeemail.com';
        const password = "abcdeF1!";
        const agent = request.agent(app);

        let cookieBefore: String | null = null;
        let cookieAfter: String | null = null;

        // Met à zéro le rate limit éventuellement incrémenté
        // par d'autres tests dans ce fichier
        memoryStore.resetAll();

        // Crée un utilisateur
        await agent
            .post('/auth/register')
            .send({
                email,
                password,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                cookieBefore = response.headers['set-cookie'];

                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        // Vérifie la route /auth/me qui confirme si la session a bien été créée
        await agent
            .get('/auth/me')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });

        // Connecte l'utilisateur pour générer une nouvelle session
        await agent
            .post('/auth/login')
            .send({
                email,
                password,
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                cookieAfter = response.headers['set-cookie'];

                // Le cookie initial et le nouveau doivent être différents
                // pour prouver la génération d'une nouvelle session
                expect(cookieBefore).not.toEqual(cookieAfter);

                expect(response.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: expect.any(String)
                    },
                });
            });
    });
});

// Coupe les connections en pooling avec les DB Neon
// pour éviter une erreur console Jest à la fin des tests
afterAll(async () => {
    await pool.end();
});