import { GymsRepository } from '@/repositories/gymsRepository';
import { Gym } from '@prisma/client';

interface SearchGymsUseCaseRequest {
    query: string;
    page: number;
}

interface SearchGymsUseCaseResponse {
    gyms: Gym[];
}

export class SearchGymsUseCase {
    constructor(private gymsRepository: GymsRepository) {}

    async handle({
        query,
        page,
    }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
        const gyms = await this.gymsRepository.searchMany(query, page);

        return {
            gyms,
        };
    }
}
