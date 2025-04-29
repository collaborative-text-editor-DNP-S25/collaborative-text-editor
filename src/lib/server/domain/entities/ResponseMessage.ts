import type { DocumentContent } from "./DocumentEntity";

export type ResponseMessage = Success | Error;

interface Success {
  ok: true;
  data: DocumentContent;
}

interface Error {
  ok: false;
}
