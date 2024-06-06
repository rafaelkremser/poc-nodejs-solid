import { PrismaGymsRepository } from '@/repositories/prisma/prismaGymsRepository';
import { FetchNearbyGymsUseCase } from '../fetchNearbyGyms';

export function makeFetchNearbyGymsUseCase() {
    const gymsRepository = new PrismaGymsRepository();
    const useCase = new FetchNearbyGymsUseCase(gymsRepository);

    return useCase;
}
