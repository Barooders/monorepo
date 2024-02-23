export abstract class IDescriptionParser {
  abstract getTechnicalCharacteristicsFromText(
    desiredParsedKeys: string[],
    text: string,
  ): Promise<Record<string, any>>;
}
