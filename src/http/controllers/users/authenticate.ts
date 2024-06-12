import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { InvalidCredentialsError } from '@/use-cases/errors/invalidCredentialsError';
import { makeAuthenticateUseCase } from '@/use-cases/factories/makeAuthenticateUseCase';

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestBodyResponse = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    const { email, password } = requestBodyResponse.parse(request.body);

    try {
        const authenticateUseCase = makeAuthenticateUseCase();

        const { user } = await authenticateUseCase.handle({ email, password });

        const token = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                },
            }
        );

        const refreshToken = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d',
                },
            }
        );

        return reply
            .status(200)
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                httpOnly: true,
            })
            .send({ token });
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: err.message });
        }

        throw err;
    }
}
