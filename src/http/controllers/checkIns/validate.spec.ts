import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import { prisma } from '@/lib/prisma';

describe('Validate Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to validate a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const createdUser = await prisma.user.findFirstOrThrow();

        const createdGym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: 16.1471697,
                longitude: -40.2968506,
            },
        });

        let checkIn = await prisma.checkIn.create({
            data: {
                gym_id: createdGym.id,
                user_id: createdUser.id,
            },
        });

        const checkInValidateResponse = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id,
            },
        });

        expect(checkInValidateResponse.statusCode).toEqual(204);
        expect(checkIn.validated_at).toEqual(expect.any(Date));
    });
});
