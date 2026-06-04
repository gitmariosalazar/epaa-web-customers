/**
 * DocumentRepository
 *
 * Interface representing the domain model for Document Operations.
 * Clean Architecture: Domain concerns only.
 */
export interface DocumentRepository {
  /**
   * Fetches the document as a Blob to be previewed inline.
   * GET /connection-documents/:documentId/preview
   */
  preview(documentId: string): Promise<Blob>;

  /**
   * Downloads the document as a Blob (attachment content disposition).
   * GET /connection-documents/:documentId/download-file
   */
  download(documentId: string): Promise<Blob>;
}
