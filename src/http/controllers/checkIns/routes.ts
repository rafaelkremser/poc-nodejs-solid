import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { create } from './create';
import { validate } from './validate';
import { metrics } from './metrics';
import { history } from './history';
import { verifyUserRole } from '@/http/middlewares/verifyUserRole';

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT);

    app.post('/gyms/:gymId/check-ins', create);

    app.get('/check-ins/history', history);
    app.get('/check-ins/metrics', metrics);

    app.patch(
        '/check-ins/:checkInId/validate',
        { onRequest: verifyUserRole('ADMIN') },
        validate
    );
}
