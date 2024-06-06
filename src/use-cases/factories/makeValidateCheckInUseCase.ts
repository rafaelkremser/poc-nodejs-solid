import { PrismaCheckInsRepository } from '@/repositories/prisma/prismaCheckInsRepository';
import { ValidateUseCase } from '../validateCheckIn';

export function makeValidateCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const useCase = new ValidateUseCase(checkInsRepository);

    return useCase;
}
