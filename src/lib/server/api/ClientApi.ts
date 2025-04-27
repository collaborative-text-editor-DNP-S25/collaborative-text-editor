import { io, type Socket } from "socket.io-client";

import type { DocumentId } from "$lib/server/domain/entities/Document";
import type { ClientToServerEvents } from "$lib/server/domain/entities/events/ClientToServerEvents";
import type { ServerToClientEvents } from "$lib/server/domain/entities/events/ServerToClientEvents";
import type { Message } from "$lib/server/domain/repositories/SocketRepository";

export class ClientApi {
  private io: Socket<ServerToClientEvents, ClientToServerEvents>;
  private callbacks = new Map<string, (message: string) => void>();

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
      this.callbacks.forEach((callback) => {
        callback(message);
      });
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

  public onMessage(callback: (message: string) => void): () => void {
    const callbackId = crypto.randomUUID();
    this.callbacks.set(callbackId, callback);

    return () => {
      this.callbacks.delete(callbackId);
    };
  }
}
