import { FastifyInstance } from 'fastify';
import { registerUser } from './controllers/register';
import { authenticateUser } from './controllers/authenticate';
import { profile } from './controllers/profile';

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', registerUser);
    app.post('/sessions', authenticateUser);

    // authenticated
    app.get('/me', profile);
}
