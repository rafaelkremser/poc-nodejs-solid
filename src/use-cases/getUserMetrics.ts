import { CheckInsRepository } from '@/repositories/checkInsRepository';

interface GetUserMetricsRequest {
    userId: string;
}

interface GetUserMetricsResponse {
    checkInsCount: number;
}

export class GetUserMetrics {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async handle({
        userId,
    }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
        const checkInsCount = await this.checkInsRepository.countByUserId(
            userId
        );

        return {
            checkInsCount,
        };
    }
}
