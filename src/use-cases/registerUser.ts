import { UsersRepository } from '@/repositories/usersRepository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError';
import { User } from '@prisma/client';

interface RegisterUserUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

interface RegisterUseCaseResponse {
    user: User;
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async handle({
        name,
        email,
        password,
    }: RegisterUserUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });

        return { user };
    }
}
