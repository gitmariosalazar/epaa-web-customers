import type { DocumentRepository } from '../../domain/repositories/DocumentRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';

/**
 * DocumentRepositoryImpl
 *
 * Implements the endpoint to download a document from the gateway.
 * GET /connection-documents/:documentId/download-file
 *
 * Clean Architecture: Infrastructure concern only.
 */
export class DocumentRepositoryImpl implements DocumentRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  /**
   * Fetches the document as a Blob for inline previewing.
   * GET /connection-documents/:documentId/preview
   */
  async preview(documentId: string): Promise<Blob> {
    const response = await this.client.get<Blob>(
      `/connection-documents/${documentId}/preview`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  /**
   * Downloads the document as a Blob (attachment).
   * GET /connection-documents/:documentId/download-file
   */
  async download(documentId: string): Promise<Blob> {
    const response = await this.client.get<Blob>(
      `/connection-documents/${documentId}/download-file`,
      { responseType: 'blob' }
    );
    return response.data;
  }
}
