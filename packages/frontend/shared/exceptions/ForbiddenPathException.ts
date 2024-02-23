export class ForbiddenPathException extends Error {
  constructor(path: string) {
    super(`Path ${path} is forbidden`);
  }
}
