import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository';
import { GetUserProfileUseCase } from '../getUserProfile';

export function makeGetUserProfileUseCase() {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new GetUserProfileUseCase(prismaUsersRepository);

    return registerUseCase;
}
