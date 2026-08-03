import type { ClientDashboardResponse } from '@/modules/connections/domain/models/view-dashboard.response';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class GetDashboardGlobalClientIdUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(clientId: string): Promise<ClientDashboardResponse | null> {
    return await this.connectionRepository.getDashboardGlobalClientId(clientId);
  }
}
