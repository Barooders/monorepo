import { customAlphabet } from 'nanoid';
// eslint-disable-next-line import/named
import { alphanumeric, uppercase } from 'nanoid-dictionary';

export const readableCode = customAlphabet(uppercase, 8);

export default customAlphabet(alphanumeric, 29);
