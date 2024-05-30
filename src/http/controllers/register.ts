import { UserAlreadyExistsError } from '@/use-cases/errors/userAlreadyExistsError';
import { makeRegisterUseCase } from '@/use-cases/factories/makeRegisterUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function registerUser(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestBodyResponse = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = requestBodyResponse.parse(request.body);

    try {
        const registerUseCase = makeRegisterUseCase();

        await registerUseCase.handle({ name, email, password });
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: err.message });
        }

        throw err;
    }

    return reply.status(201).send();
}
