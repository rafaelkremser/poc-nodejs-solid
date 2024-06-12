import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';

describe('Create Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const createGymResponse = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: null,
                phone: null,
                latitude: 16.1471697,
                longitude: -40.2968506,
            });

        expect(createGymResponse.statusCode).toEqual(201);
    });
});
