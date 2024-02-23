import { BinaryToTextEncoding, createHmac, timingSafeEqual } from 'crypto';

export const validateHmacSignature = (
  payload: string | Buffer,
  secret: string,
  hashToValidate: string,
  encoding: BinaryToTextEncoding = 'base64',
) => {
  const generatedHash = createHmac('sha256', secret)
    .update(payload)
    .digest(encoding);

  const generatedHashBuffer = Buffer.from(generatedHash);
  const hmacBuffer = Buffer.from(hashToValidate);

  return (
    generatedHashBuffer.length === hmacBuffer.length &&
    timingSafeEqual(generatedHashBuffer, hmacBuffer)
  );
};
