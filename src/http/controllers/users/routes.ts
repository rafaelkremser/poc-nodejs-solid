import { FastifyInstance } from 'fastify';
import { registerUser } from './register';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { refresh } from './refresh';

export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', registerUser);
    app.post('/sessions', authenticate);

    app.patch('/token/refresh', refresh);

    // authenticated
    app.get('/me', { onRequest: [verifyJWT] }, profile);
}
