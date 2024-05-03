export type CustomerRequestCreationRequest = {
  quantity: number;
  description: string;
  budgetMinInCents?: number;
  budgetMaxInCents?: number;
  neededAtDate: Date;
};
