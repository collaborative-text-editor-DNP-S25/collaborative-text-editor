import type { DocumentId } from "$lib/common/entities/Document";
import type DocumentRepository from "$lib/server/domain/repositories/DocumentRepository";
import {type Document} from "$lib/common/entities/Document";

export default class GetDocumentUseCase {
  constructor(private documentRepo: DocumentRepository) {}
  async invoke(docId: DocumentId): Promise<Document | undefined> {
    const doc = await this.documentRepo.getDocument(docId);
    if (doc == null){
        return undefined;
    } else {
        return doc;
    }
  }
}