export abstract class EmailRepository {
  abstract sendSearchAlertResults(
    toEmail: string,
    payload: {
      alertName: string;
      countResults: number;
      resultsUrl: string;
      searchFilters: string;
      results: {
        imageUrl: string;
        brand: string;
        handle: string;
        characteristics: string;
        price: string;
        compareAtPrice: string;
        discount: string;
      }[];
    },
  ): Promise<void>;
}
