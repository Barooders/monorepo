import { Amount } from '@libs/domain/value-objects';

const fr = {
  priceOffer: {
    newPriceOffer: (sellerName: string | null, newPrice: Amount) =>
      `${sellerName ?? 'On'} fait une offre :\n\n*${newPrice.formattedAmount}*`,
    canceledPriceOffer: (priceOfferAmount: Amount) =>
      `La proposition à ${priceOfferAmount.formattedAmount} a été annulée.`,
    declinedPriceOffer: (priceOfferAmount: Amount) =>
      `La proposition à ${priceOfferAmount.formattedAmount} n'est pas acceptée.`,
    acceptedPriceOffer: (priceOfferAmount: Amount, originalAmount: Amount) =>
      `La proposition est acceptée ! Nouveau prix : \n\n~${originalAmount.formattedAmount}~ *${priceOfferAmount.formattedAmount}*`,
    discountCode: (discountCode: string) =>
      `Utilisez le code promotion *${discountCode}* dans votre panier au moment de votre commande pour en profiter.\n\nAttention, l’offre n’est valable que 7 jours.`,
  },
};

export default fr;
