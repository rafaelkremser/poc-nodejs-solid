import { makeSearchGymsUseCase } from '@/use-cases/factories/makeSearchGymsUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    });

    const { query, page } = searchGymsQuerySchema.parse(request.body);

    const searchGymUseCase = makeSearchGymsUseCase();

    const { gyms } = await searchGymUseCase.handle({ query, page });

    return reply.status(201).send({ gyms });
}
