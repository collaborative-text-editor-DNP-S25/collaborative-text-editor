import { io, type Socket } from "socket.io-client";

import type { DocumentId } from "$lib/server/domain/entities/Document";
import type { ClientToServerEvents } from "$lib/server/domain/entities/events/ClientToServerEvents";
import type { ServerToClientEvents } from "$lib/server/domain/entities/events/ServerToClientEvents";
import type { Message } from "$lib/server/domain/repositories/SocketRepository";

type OnMessageCallback = (message: string) => void;

type GetAllDocumentsCallback = (documentIds: DocumentId[]) => void;

export class ClientApi {
  private io: Socket<ServerToClientEvents, ClientToServerEvents>;

  private onMessageCallbacks = new Map<string, OnMessageCallback>();
  private getAllDocumentsCallbacks = new Map<string, GetAllDocumentsCallback>();

  constructor(serverUrl: string) {
    this.io = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      transports: ["websocket"],
    });
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("sendMessage", (message) => {
      this.onMessageCallbacks.forEach((callback) => {
        callback(message);
      });
    });

    this.io.on("sendDocumentIds", (documentIds) => {
      this.getAllDocumentsCallbacks.forEach((callback) => {
        callback(documentIds)
      })
    });

    this.io.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });
  }

  public enterDocument(docId: DocumentId): void {
    this.io.emit("enterDocument", docId);
  }

  public exitDocument(docId: DocumentId): void {
    this.io.emit("exitDocument", docId);
  }

  public updateDocument(docId: DocumentId, newContent: Message): void {
    this.io.emit("updateDocument", docId, newContent);
  }

  public createDocument(): void {
    this.io.emit("createDocument");
  }

  public deleteDocument(docId: DocumentId): void {
    this.io.emit("deleteDocument", docId);
  }

  public undo(docId: DocumentId): void {
    this.io.emit("undo", docId);
  }

  public redo(docId: DocumentId): void {
    this.io.emit("redo", docId);
  }

  public getAllDocuments(callback: GetAllDocumentsCallback): () => void {
    const callbackId = crypto.randomUUID();
    this.getAllDocumentsCallbacks.set(callbackId, callback);

    return () => {
      this.getAllDocumentsCallbacks.delete(callbackId);
    }
  }

  public onMessage(callback: OnMessageCallback): () => void {
    const callbackId = crypto.randomUUID();
    this.onMessageCallbacks.set(callbackId, callback);

    return () => {
      this.onMessageCallbacks.delete(callbackId);
    };
  }
}
