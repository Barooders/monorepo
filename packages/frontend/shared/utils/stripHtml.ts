const stripHtml = (html?: string): string | undefined =>
  html ? html.replace(/<[^>]*>?/gm, '') : undefined;

export default stripHtml;
