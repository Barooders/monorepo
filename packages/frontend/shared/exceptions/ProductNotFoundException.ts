export class ProductNotFoundException extends Error {
  constructor(productId: string) {
    super(
      `Product ${productId} not found in GraphQL API. You might want to check if it is published on Hasura sales channel`,
    );
  }
}
