import type { ConnectionDashboardResponse } from '../../domain/models/view-dashboard.response';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class GetDashboardConnectionsByClientIdUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(clientId: string): Promise<ConnectionDashboardResponse[]> {
    return await this.connectionRepository.getDashboardConnectionsByClientId(
      clientId
    );
  }
}
