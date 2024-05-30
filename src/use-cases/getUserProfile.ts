import { UsersRepository } from '@/repositories/usersRepository';
import { User } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';

interface GetUserProfileUseCaseRequest {
    userId: string;
}

interface GetUserProfileUseCaseResponse {
    user: User;
}

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async handle({
        userId,
    }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        return {
            user,
        };
    }
}
