import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import { prisma } from '@/lib/prisma';

describe('Create Check-In (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to create a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const createdGym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: 16.1471697,
                longitude: -40.2968506,
            },
        });

        const createCheckInResponse = await request(app.server)
            .post(`/gyms/${createdGym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                userLatitude: 16.1471697,
                userLongitude: -40.2968506,
            });

        expect(createCheckInResponse.statusCode).toEqual(201);
    });
});
