import { UsersRepository } from '@/repositories/usersRepository';
import { InvalidCredentialsError } from '@/use-cases/errors/invalidCredentialsError';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
    user: User;
}

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async handle({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doestPasswordMatches = await compare(
            password,
            user.password_hash
        );

        if (!doestPasswordMatches) {
            throw new InvalidCredentialsError();
        }

        return {
            user,
        };
    }
}
