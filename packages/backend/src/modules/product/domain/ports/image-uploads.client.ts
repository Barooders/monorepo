export abstract class IImageUploadsClient {
  abstract uploadImages(urls: string[]): Promise<string[]>;
}
