import { PrismaCheckInsRepository } from '@/repositories/prisma/prismaCheckInsRepository';
import { GetUserMetricsUseCase } from '../getUserMetrics';

export function makeGetUserMetricsUseCase() {
    const prismaCheckInsRepository = new PrismaCheckInsRepository();
    const registerUseCase = new GetUserMetricsUseCase(prismaCheckInsRepository);

    return registerUseCase;
}
