import { PrismaGymsRepository } from '@/repositories/prisma/prismaGymsRepository';
import { SearchGymsUseCase } from '../searchGyms';

export function makeSearchGymsUseCase() {
    const gymsRepository = new PrismaGymsRepository();
    const useCase = new SearchGymsUseCase(gymsRepository);

    return useCase;
}
