export abstract class ITranslator {
  abstract translate(text: string): Promise<string | void>;
}
