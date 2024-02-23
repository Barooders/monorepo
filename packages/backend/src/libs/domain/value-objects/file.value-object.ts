import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class InvalidFileName extends ExceptionBase {
  code = 'INVALID_FILENAME';
  constructor(fileName: any, fileType: any) {
    super(
      `File name (${fileName}) should end with valid extension for its type (${fileType})`,
    );
  }
}

export enum FileTypes {
  PDF = 'pdf',
}

export interface FileProps {
  fileName: string;
  fileContent: string;
  fileType: FileTypes;
}

export class File extends ValueObject<FileProps> {
  get fileName(): string {
    return this.props.fileName;
  }
  get fileContent(): string {
    return this.props.fileContent;
  }

  protected validate(props: FileProps): void {
    // TODO: Extend this validation when adding new file types
    if (props.fileType === FileTypes.PDF && !props.fileName.endsWith('.pdf')) {
      throw new InvalidFileName(props.fileName, props.fileType);
    }
  }
}
