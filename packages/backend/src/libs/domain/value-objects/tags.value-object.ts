import { ValueObject } from './value-object.base';

export interface TagsProps {
  tags: Record<string, string | string[]>;
}

export class Tags extends ValueObject<TagsProps> {
  get tags(): Record<string, string> {
    return Object.entries(this.props.tags).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? value[0] : value,
      }),
      {},
    );
  }

  get tagsArray(): string[] {
    return Object.entries(this.props.tags).flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}:${v}`);
      }
      return `${key}:${value}`;
    });
  }

  get tagsObjectWithArrays(): Record<string, string[]> {
    return Object.entries(this.props.tags).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? value : [value],
      }),
      {},
    );
  }

  protected validate(_props: TagsProps): void {
    //TODO: add validation
  }
}
