import { makeGetUserProfileUseCase } from '@/use-cases/factories/makeGetUserProfileUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const getUserProfile = makeGetUserProfileUseCase();

    const { user } = await getUserProfile.handle({
        userId: request.user.sub,
    });

    return reply
        .status(200)
        .send({ user: { ...user, password_hash: undefined } });
}
