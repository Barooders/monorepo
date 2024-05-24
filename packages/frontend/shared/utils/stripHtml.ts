const stripHtml = (html?: string): string | undefined =>
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  html ? html.replace(/<[^>]*>?/gm, '') : undefined;

export default stripHtml;
