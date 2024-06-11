import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import { prisma } from '@/lib/prisma';

describe('Check-In History (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to list the history of check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const createdUser = await prisma.user.findFirstOrThrow();

        const createdGym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: 16.1471697,
                longitude: -40.2968506,
            },
        });

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: createdGym.id,
                    user_id: createdUser.id,
                },
                {
                    gym_id: createdGym.id,
                    user_id: createdUser.id,
                },
            ],
        });

        const checkInsHistoryResponse = await request(app.server)
            .get('/check-ins/history')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(checkInsHistoryResponse.statusCode).toEqual(200);
        expect(checkInsHistoryResponse.body.checkIns).toHaveLength(2);
    });
});
