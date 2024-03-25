import Link from '@/components/atoms/Link';
import { OrderStatus } from '@/components/pages/Account/types';
import { ShipmentTimeframe } from '@/config';
import { AccountSections, ProductStatus } from '@/types';
import { RiMoneyEuroCircleLine } from 'react-icons/ri';

const fr = {
  components: {
    yesNoSelector: {
      yes: 'Oui',
      no: 'Non',
    },
    chatPanel: {
      buyNow: 'Acheter',
      acceptPriceOffer: 'Accepter',
      cancelPriceOffer: 'Annuler votre offre',
      declinePriceOffer: 'Refuser',
      acceptedPriceOffer: "L'offre est utilisable avec le code",
    },
    trustpilot: {
      excellentRate: 'Excellent',
      since: ({ daysCount }: { daysCount: number }) => (
        <>Il y a {daysCount} jours</>
      ),
      basedOnReviews: ({ reviewCount }: { reviewCount: number }) => (
        <>
          Sur la base de{' '}
          <span className="font-semibold underline">{reviewCount} avis</span>.
        </>
      ),
    },
    sellerNameInput: {
      errors: {
        forbiddenCharacters: 'Ce nom contient des caractères interdits.',
        idAlreadExists: 'Ce nom est déjà pris.',
      },
    },
    blockEllipsis: {
      seeMore: 'Voir plus',
      seeLess: 'Voir moins',
    },
    productCard: {
      description: 'Description',
      soldOut: 'Produit épuisé',
      technicalCharacteristics: 'Caractéristiques techniques',
      soldBy: 'Vendu par',
      seeDetails: 'Voir détails',
      buyNow: 'Acheter',
      chatNow: 'Contacter le vendeur',
      labels: {
        pro: 'PRO',
        refurbished: 'RECONDITIONNÉ',
        subvention: () => (
          <>
            <RiMoneyEuroCircleLine />
            Prime à l&apos;achat
          </>
        ),
      },
      conditionKey: 'État',
      getConditionLabel: (condition: string) => {
        switch (condition.toLowerCase().trim()) {
          case 'as_new':
            return 'Neuf';
          case 'very_good':
            return 'Très bon état';
          case 'good':
            return 'Bon état';
          default:
            return '';
        }
      },
      getFacetValueLabel: (facetValue: string) => {
        switch (facetValue.toLowerCase().trim()) {
          case 'as_new':
          case 'very_good':
          case 'good':
            return fr.components.productCard.getConditionLabel(facetValue);
          case 'child':
            return 'Enfant';
          case 'b2c':
            return 'Professionnels';
          case 'c2c':
            return 'Particuliers';
          case 'true':
            return 'Oui';
          case 'false':
            return 'Non';
          default:
            return undefined;
        }
      },
      securedPayment: 'Paiement sécurisé',
      delivery: {
        title: 'Livraison',
        disclaimer: (
          <>
            Délai d&apos;expédition indicatif.
            <br />
            <br />
            La livraison prend généralement 2 à 5 jours ouvrés suivant
            l&apos;expédition
          </>
        ),
        getShipmentTimeframeSentence: (
          shipmentTimeframe: ShipmentTimeframe | null,
        ) => {
          switch (shipmentTimeframe) {
            case ShipmentTimeframe.SAME_DAY:
              return 'Expédié le jour même.';
            case ShipmentTimeframe.TWO_DAYS:
              return 'Expédié sous 2 jours.';
            case ShipmentTimeframe.THREE_DAYS:
              return 'Expédié sous 3 à 5 jours.';
            case ShipmentTimeframe.FOUR_DAYS:
              return 'Expédié sous 4 à 6 jours.';
            case ShipmentTimeframe.FIVE_DAYS:
              return 'Expédié sous 5 à 7 jours.';
            case ShipmentTimeframe.THREE_WEEKS:
              return 'Expédié sous 3 semaines.';
            default:
              return 'Expédié sous 10 jours.';
          }
        },
      },
      support: {
        catchphrase: 'Nos experts sont là pour vous aider !',
        content: () => (
          <p>
            Contactez nous : <br />
            📞{' '}
            <Link href="tel:+33189713290">
              <strong>+33 1 89 71 32 90</strong>
            </Link>
            <br />
            💬 Chat en bas de page <br />
          </p>
        ),
      },
      commissionDetails: {
        title: 'Frais de Protection acheteur',
        proSubtitle: 'Produit vendu par un professionnel',
        description:
          'Pour tout achat effectué, nous appliquons des frais couvrant notre protection acheteurs avec les avantages suivants :',
        verifiedOffers: () => (
          <>
            Annonces vérifiées - <span className="font-medium">100%</span>
          </>
        ),
        freeRefund: (duration = 4) => (
          <>
            Satisfait ou remboursé -{' '}
            <span className="font-medium">{duration}j</span>
          </>
        ),
        securedPayment: () => <>Paiement sécurisé</>,
        clientService: () => (
          <>
            Conseils d&apos;expert - <span className="font-medium">7j/7</span>
          </>
        ),
      },
      guarantees: {
        christmasDelivery: () => (
          <div className="flex gap-2">
            <p>🎄 Livré chez vous avant Noël !</p>
            <span>-</span>
            <p className="font-semibold">Livraison 72h</p>
          </div>
        ),
        verifiedOffers: () => (
          <>
            Annonces
            <br />
            <span className="font-medium">100% vérifiées</span>
          </>
        ),
        ratings: () => (
          <>
            +100 000 avis
            <br />
            <span className="font-medium">Excellent 9/10</span>
          </>
        ),
        securedPayment: () => (
          <>
            Paiements sécurisées
            <br />
            <span className="font-medium">en plusieurs fois</span>
          </>
        ),
        clientService: () => (
          <>
            Conseils d&apos;expert
            <br />
            <span className="font-medium">7j/7</span>
          </>
        ),
      },
      splitPayment: {
        result: ({ amount }: { amount: number }) => (
          <>
            à partir de <span className="font-semibold">{amount}€</span> / mois
          </>
        ),
        withFirstTime: ({
          firstPayment,
          duration,
          recurringPayment,
        }: {
          firstPayment: number;
          duration: number;
          recurringPayment: number;
        }) => (
          <>
            <span className="font-semibold">{firstPayment}€</span> puis{' '}
            {duration - 1}x{recurringPayment}€
          </>
        ),
        providers: {
          floa: {
            conditionsTitle: "Conditions d'utilisation du paiement Floa",
            conditions: () => (
              <>
                <p className="text-base text-slate-600">
                  Un crédit vous engage et doit être remboursé.
                </p>
                <p className="text-sm text-slate-600">
                  Vérifiez vos capacités de remboursement avant de vous engager.
                  Offre de crédit à partir de 200 €. Sous réserve d’acceptation
                  par FLOA. Vous disposez d’un délai de rétractation.
                  <br />
                  <br />
                  <Link
                    className="text-slate-500 underline"
                    href="https://barooders.com/policies/terms-of-service"
                  >
                    Consultez les conditions ici.
                  </Link>
                </p>
              </>
            ),
          },
        },
      },
      offers: {
        offered: 'Offerts',
        promoCode: ({ code }: { code: string }) => <>avec le code {code}</>,
        promoCodeExplanation: ({ code }: { code: string }) => (
          <>Sur votre première commande avec le code {code}</>
        ),
        subventionTitle: "Prime à l'achat",
        subventionExplanation: ({ amount }: { amount: number }) => (
          <>
            Économisez <span className="font-semibold">jusqu’à {amount}€</span>{' '}
            sur ce vélo grâce à la prime à l’achat
          </>
        ),
        subventionLink: () => (
          <>
            Des questions à ce sujet ?{' '}
            <span className="underline">Contactez nous !</span>
          </>
        ),
        subventionContactUs:
          'Pour toutes questions vous pouvez nous contacter :',
        byMail: 'Par email',
        byChat: 'Par chat',
        byPhone: 'Par téléphone',
      },
      free: 'Gratuit',
      commissionIncluded: 'Protection acheteur incluse',
      yearLabel: 'Année',
      sizeLabel: 'Taille',
      sizeGuide: 'Guide des tailles',
      favoriteButtonTitle: 'Ajouter aux favoris',
      recommendations: 'Produits recommandés',
      reviews: {
        reviewCount: ({ reviewCount }: { reviewCount: number }) => (
          <>{reviewCount} avis</>
        ),
        vendorTitle: 'Vendeur',
        vendorSince: ({ date }: { date: string }) => (
          <>Vendeur depuis le {date}</>
        ),
        seeReviews: 'Voir les avis',
      },
      discount: {
        remaining: 'Plus que ',
        mainPrice: 'Prix Barooders',
        reduction: 'Réduction',
        commission: 'Garantie Acheteur',
        total: 'Montant Total',
        beforeDiscount: 'Avant Remise',
        savingsMade: 'Économies réalisées',
        compareAt: 'Comparaison avec le prix neuf constaté',
        shortCompareAt: 'Prix neuf',
        so: 'soit',
        saved: "d'économies",
        withCode: 'Code',
        discountCode: 'Code promo',
      },
    },
  },
  global: {
    locale: 'fr',
    errors: {
      pageNotFound: 'Impossible de trouver cette page',
      title: "Oups, une erreur s'est produite.",
      invalidRequest: "Votre demande n'est pas valide !",
      description: 'Veuillez réessayer plus tard.',
      unauthorized:
        "Vous n'êtes pas autorisé à accéder à cette page, vous pouvez essayer de vous déconnecter et reconnecter",
      unknownError:
        "Une erreur s'est produite, merci de réessayer plus tard ou de contacter le support (support@barooders.com)",
      sendEmail:
        "Nous n'avons pas réussi à envoyer l'email, merci de réessayer plus tard.",
      invalidEmail:
        'Cet email ne semble pas associé à un compte utilisateur Barooders',
      resetPassword:
        "Nous n'avons pas réussi à modifier votre mot de passe, merci de réessayer plus tard.",
      signup:
        'Impossible de créer un compte, vous avez peut-être déjà un compte à cette adresse',
      lightSignup:
        'Impossible de mettre à jour vos informations, merci de modifier les informations renseignées ou de réessayer plus tard.',
      productNotFoundError:
        "Ce produit n'a plus l'air d'être diponible sur notre site",
      collectionNotFoundError:
        "Cette collection n'a pas l'air d'exister sur notre site",
      orderNotFoundError:
        "Cette commande n'est pas disponible, merci de réessayer plus tard.",
      backToHome: "Retourner à l'accueil",
    },
    success: {
      sendResetPassword:
        'Si cette adresse email existe chez nous, nous vous enverrons un email pour réinitialiser votre mot de passe.',
      sentEmail: 'Email envoyé :)',
      savedSuccessfully: 'Modifications effectuées !',
    },
    forms: {
      required: 'Ce champs est obligatoire.',
      error: 'Ce champs est invalide.',
      passwordIsTooShort:
        "Le mot de passe n'est pas assez long (8 caractères min.)",
      emailNotValid: "L'email renseigné n'est pas valide.",
      cancel: 'Annuler',
      submit: 'Valider',
      phoneNumberInvalid: 'Veuillez entrer un numéro de téléphone valide',
    },
    loader: 'Chargement...',
    head: {
      description:
        'Barooders est la plateforme dédiée aux vélos et équipements de sport reconditionnés et d’occasion. Achetez votre vélo auprès d’un de nos 500 reconditionneurs en Europe. Vendez votre vélo auprès de notre communauté.',
    },
    date: {
      ago: (durationText: string) => `Il y a ${durationText}`,
    },
  },
  homepage: {
    mainTitle: 'Le meilleur du Sport de Seconde Main',
    head: {
      title: "Barooders | N°1 du Vélo & Équipements de Sport d'Occasion",
    },
    mainSlideAltText: 'Vente flash',
    mobileSection: {
      title: 'L’application Barooders est disponible !',
      subtitle: 'Vendre et acheter un vélo n’a jamais été aussi facile',
      downloadApp: 'Télécharger l’application',
      since: ({ daysCount }: { daysCount: number }) => (
        <>Il y a {daysCount} jours</>
      ),
    },
  },
  header: {
    logo: {
      title: 'Barooders',
    },
    search: {
      placeholder: 'Rechercher un article',
    },
    sell: {
      buttonLabel: 'Vendre',
    },
    menu: {
      backbone: 'Sports',
      myAccount: 'Mon compte',
      mySpace: 'Mon espace',
      categories: 'Catégories',
      messages: 'Messagerie',
      favorites: 'Favoris',
      sellButton: 'Vendre un produit',
      alerts: 'Alertes',
    },
    icons: {
      favorites: 'Vos favoris',
      messages: 'Vos messages',
      account: 'Votre compte',
    },
    announcementItems: [
      '100% Annonces vérifiées',
      'Satisfait ou remboursé',
      'Paiement en 4X',
      'Service client 7j/7',
    ],
  },
  vendorShop: {
    title: 'La boutique de ',
  },
  contactUs: {
    title: 'Nous contacter',
  },
  login: {
    head: {
      title: 'Compte - Barooders',
    },
    inputs: {
      title: 'Connexion',
      email: {
        label: 'Email',
        placeholder: 'Votre email',
      },
      password: {
        label: 'Mot de passe',
        placeholder: 'Votre mot de passe',
      },
    },
    errors: {
      incorrectLoginOrPassword: 'E-mail ou mot de passe incorrect.',
      unverifiedUser:
        "Votre email n'a pas été validé, vérifiez vos emails ou contactez le support.",
    },
    social: {
      google: {
        login: 'Se connecter avec Google',
        signup: 'Créer un compte avec Google',
      },
      apple: {
        login: 'Se connecter avec Apple',
        signup: 'Créer un compte avec Apple',
      },
    },
    resetPasswordLink: 'Mot de passe oublié ?',
    sendVerifyEmailLink:
      'ou cliquez ici pour renvoyer le lien de vérification.',
    signupLink: 'Créer mon compte',
    submit: 'Envoyer',
  },
  signup: {
    head: {
      title: 'Compte - Barooders',
    },
    title: 'Créer un compte',
    inputs: {
      firstname: {
        label: 'Prénom',
        placeholder: 'Mike',
      },
      lastname: {
        label: 'Nom',
        placeholder: 'Horn',
      },
      login: {
        label: "Nom d'utilisateur (visible par les autres utilisateurs)",
        placeholder: 'PolarBear38',
      },
      email: {
        label: 'Email',
        placeholder: 'mike.horn@gmail.com',
      },
      password: {
        label: 'Mot de passe',
        placeholder: '',
      },
      cgu: {
        label: () => (
          <span>
            J’accepte les{' '}
            <Link
              className="underline"
              href="/policies/terms-of-service"
            >
              Conditions Générales de Vente
            </Link>{' '}
            et la{' '}
            <Link
              className="underline"
              href="/policies/refund-policy"
            >
              Politique de Remboursement
            </Link>
          </span>
        ),
      },
    },
    submit: 'Créer votre compte',
    alreadyHaveAnAccount: 'Vous avez déjà un compte ?',
    redirectToLogin: 'Connectez-vous',
  },
  lightSignup: {
    head: {
      title: 'Compte - Barooders',
    },
    title: 'Bienvenue sur Barooders !',
    description: 'Il reste quelques informations à entrer pour être paré.',
    inputs: {
      firstname: {
        label: 'Prénom',
        placeholder: 'Mike',
      },
      lastname: {
        label: 'Nom',
        placeholder: 'Horn',
      },
      login: {
        label: "Nom d'utilisateur (visible par les autres utilisateurs)",
        placeholder: 'PolarBear38',
      },
    },
    submit: 'Confirmer',
  },
  resetPassword: {
    intro: {
      title: 'Réinitialiser votre mot de passe',
      description:
        'Nous vous ferons parvenir un email pour réinitialiser votre mot de passe.',
    },
    inputs: {
      email: {
        label: 'Votre email',
        placeholder: '',
      },
      newPassword: {
        label: 'Votre nouveau mot de passe',
        placeholder: '',
      },
    },
    errors: {
      invalidLink:
        'Désolé mais ce lien est non valide, vous pouvez essayer de refaire un mot de passe oublié ou de contacter le support technique',
    },
    submit: 'Valider',
  },
  footer: {
    about: {
      title: 'A propos',
      links: {
        mission: 'Notre mission',
        howItWorks: 'Fonctionnement',
        press: 'Presse',
        ambassadors: 'Nos ambassadeurs',
        blog: 'Blog',
        joinUs: 'Rejoignez-nous !',
        myAccount: 'Mon compte',
      },
    },
    sell: {
      title: 'Vendre',
      links: {
        advice: 'Nos conseils',
        iSell: 'Je vends!',
        qnaSeller: 'FAQ Vendeur',
        deposit: 'Dépôt-vente',
        collect: 'Collecte à domicile',
        becomePartner: 'Devenir Vendeur Partenaire',
        festivalBoulder: 'Festival Oh My Bloc',
      },
    },
    buyer: {
      title: 'Acheter',
      links: {
        qnaBuyer: 'FAQ Acheteur',
        giftCard: 'Offre une carte cadeau!',
      },
    },
    help: {
      title: 'Aide',
      links: {
        qna: 'FAQ',
        legalMentions: 'Mentions légales',
        privacy: 'Politique de confidentialité',
        refunding: 'Politique de remboursement',
        generalConditions: 'C.G.V',
      },
    },
    contactUs: {
      title: 'Entrer en contact',
      links: {
        email: 'Envoyez-nous un email',
      },
    },
    followUs: { title: 'Suivez nous' },
    payment: { title: 'Nous acceptons' },
    application: {
      title: "Télécharger l'Application",
      links: {
        apple: 'Apple',
        android: 'Android',
      },
    },
  },
  blog: {
    blogBreadcrumb: 'Blog',
    blogName: 'Barooders Blog',
    explore: 'Explorer plus',
    moreArticles: 'Plus de',
  },
  chat: {
    title: 'Messagerie',
    warning: {
      button: 'Restez vigilants',
      content: () => (
        <>
          <p className="mb-3 text-xl font-semibold text-slate-800">
            🛡 Restez Vigilants
          </p>
          <p className="text-sm font-light text-slate-500">
            Nous garantissons la sécurité de vos échanges sur cette messagerie,
            et la sécurité de toutes les transactions financières réalisées via
            la plateforme. En communiquant, ou en effectuant des transactions en
            dehors de notre plateforme, vous prenez le risque d’être victime
            d’une arnaque.
            <br />
            <br />
            C’est pourquoi nous vous conseillons de rester sur cette messagerie,
            et d’utiliser notre solution de paiements sécurisés pour vos
            transactions.
            <br />
            <br />
            Pensez à nous signaler tout message qui vous semble suspect pour
            nous aider à lutter contre les tentatives de fraude.
          </p>
        </>
      ),
    },
    errors: {
      tooMany:
        "Vous avez envoyé trop de messages pour aujourd'hui. Réessayez demain.",
      unknown:
        "Nous n'avons pas pu démarrer votre nouvelle conversation, contactez le support pour obtenir de l'aide.",
    },
  },
  search: {
    innerPageBanner: {
      moreDetails: "J'en profite",
      noel10: '-10€ dès 200€ d’achat : Code NOEL10',
      noel25: '-25€ dès 500€ d’achat : Code NOEL25',
      noel10p: '-10% sur une sélection de produits : Code 10%NOEL',
      christmas: 'MERRY B-XMAS !',
    },
    refurbished: "d'occasion",
    results: 'résultats',
    resultsFor: 'Résultats pour',
    allResults: 'Tous les résultats',
    noResults: {
      title: 'Désolé, aucun résultat',
      subtitle:
        "Nous n'avons encore aucune annonce correspondant à votre recherche",
    },
    sortBy: {
      title: 'Trier par',
      options: {
        relevance: 'Pertinence',
        priceAsc: 'Les moins chers',
        priceDesc: 'Les plus chers',
        dateDesc: 'Les plus récents',
        discountDesc: 'Les bonnes affaires',
      },
    },
    filters: {
      showMore: 'Voir plus',
      showLess: 'Voir moins',
      search: 'Rechercher',
      validate: 'Appliquer',
    },
    clearAllFilters: 'Tout supprimer',
    filtersTitle: 'Filtres',
    relatedCollectionsTitle: 'Collections associées',
    descriptionTitle: "Plus d'infos sur ce produit",
    shopOf: 'La boutique de ',
    showMore: 'Lire la suite',
    showLess: 'Voir moins',
    contact: 'Contacter',
    facets: {
      price: 'Prix',
      'array_tags.alimentation': 'Alimentation',
      condition: 'État',
      'array_tags.marque': 'Marque',
      'array_tags.taille': 'Taille',
      'array_tags.taille-textile': 'Taille Textile',
      'array_tags.taille-ski': 'Taille ski (cm)',
      'array_tags.taille-helmet': 'Taille Casque',
      'array_tags.taille-montre': 'Taille montre',
      'array_tags.taille-mp': 'Taille mp',
      'array_tags.taille-pointure': 'Pointure',
      'array_tags.taille-velo': 'Taille vélo détaillée',
      'array_tags.formatted-bike-size': 'Taille vélo',
      is_refurbished: 'Reconditionné',
      'array_tags.groupe-transmission-velos': 'Transmission',
      'array_tags.taille-wing': 'Taille voile',
      'meta.barooders.owner': 'Type de vendeurs',
      'meta.barooders.product_discount_range': 'Réduction',
      product_type: 'Catégorie',
    },
  },
  searchAlerts: {
    buttonLabel: 'Créer une alerte',
    title: 'Créer une alerte',
    description:
      'Soyez les premiers informés des plus belles pépites correspondant à votre recherche !',
    form: {
      nameInputLabel: "Titre d'alerte",
      namePlaceholder: 'VTT taille M',
      alertLabel: 'Ma recherche',
      validate: 'Créer l’alerte',
      modify: 'Modifier les filtres',
      error: "Une erreur s'est produite",
    },
    successToaster: 'Alerte créée',
  },
  savedSearches: {
    title: 'Vos recherches enregistrées',
    deleteButton: "Supprimer l'alerte",
    link: 'Voir les résultats',
  },
  account: {
    signedSinceThe: 'Inscrit depuis le',
    signedSince: 'Inscrit depuis',
    vendorSince: 'Vendeur depuis',
    buyerSince: 'Acheteur depuis',
    seeProduct: 'Voir la fiche produit',
    shippingAddress: 'Adresse de livraison',
    seeMyShop: 'Voir ma boutique',
    walletBalance: 'Solde disponible',
    connectMyWallet: 'Connecter mon porte-monnaie',
    support: 'Support client',
    sendMessageToSupport: 'Envoyer un message',
    myInfo: {
      title: 'Mes informations',
      phoneNumberLabel: 'Votre numéro de téléphone',
      negociationAgreement: {
        title: 'Mes préférences de vente',
        refusedNegociation: "Vous n'avez pas activé la négociation.",
        hasAgreedToNegociation: (maxAmountPercent: number) =>
          `J'accepte de négocier le prix de mes annonces jusqu'à -${maxAmountPercent}%`,
        maxAmountPercentLabel: 'Fourchette de négociation',
        maxAmountPercentDescription:
          "Les acheteurs ne pourront pas faire d'offres en dessous de la limite fixée.",
        openToNegoLabel:
          'J’accepte de négocier le prix de mes annonces via le chat Barooders.',
      },
    },
    productStatus: {
      [ProductStatus.DRAFT]: 'En pause',
      [ProductStatus.ACTIVE]: 'Actif',
      [ProductStatus.ARCHIVED]: 'Archivé',
      unknown: 'Statut inconnu',
    },
    orderStatus: {
      [OrderStatus.PAID]: {
        short: 'Payée',
        long: 'La commande a été payée',
        since: 'Payée le',
      },
      [OrderStatus.SHIPPED]: {
        short: 'Expédiée',
        long: 'La commande a été expédiée',
        since: 'Expédiée le',
      },
      [OrderStatus.DELIVERED]: {
        short: 'Livrée',
        long: 'La commande a été livrée',
        since: 'Livrée le',
      },
      [OrderStatus.CANCELED]: {
        short: 'Annulée',
        long: 'La commande a été annulée',
        since: 'Annulée le',
      },
      [OrderStatus.RETURNED]: {
        short: 'Retournée',
        long: 'La commande a été retournée',
        since: 'Retournée le',
      },
      [OrderStatus.PAID_OUT]: {
        short: 'Payée',
        long: 'Le vendeur a été payé',
        since: 'Payée le',
      },
      [OrderStatus.LABELED]: {
        short: 'Prête à être expédiée',
        long: 'La commande va bientôt être expédiée',
        since: 'Prête à être expédiée le',
      },
      [OrderStatus.CREATED]: {
        short: 'Créée',
        long: 'La commande a été créée',
        since: 'Créée le',
      },
      unknown: {
        short: 'Inconnu',
        long: 'Statut inconnu',
        since: '',
      },
    },
    sections: {
      [AccountSections.ORDERS]: {
        label: 'Mes ventes',
        emptyTexts: {
          title: 'Aucune vente en cours',
          description: `Vos ventes s'afficheront ici.`,
        },
        action: {
          label: 'Voir mes ventes',
          link: '/account/catalog?tab=orders',
        },
      },
      [AccountSections.ONLINE_PRODUCTS]: {
        label: 'Mes annonces',
        emptyTexts: {
          title: 'Aucune annonce créée',
          description: `Vos annonces s'afficheront ici.`,
        },
        action: {
          label: 'Voir mes annonces',
          link: '/account/catalog?tab=onlineProducts',
        },
      },
      [AccountSections.PURCHASES]: {
        label: 'Mes achats',
        emptyTexts: {
          title: 'Aucun achat en cours',
          description: `Vos achats s'afficheront ici`,
        },
        action: {
          label: 'Voir mes achats',
          link: '/account/purchases',
        },
      },
      [AccountSections.FAVORITES]: {
        label: 'Articles favoris',
        emptyTexts: {
          title: 'Aucun article favori',
          description: `Vos favoris s'afficheront ici`,
        },
        action: {
          label: 'Voir mes favoris',
          link: '/pages/favoris',
        },
      },
    },
    tables: {
      searchPlaceholder: {
        onlineProduct: 'Rechercher une annonce',
        order: 'Rechercher une commande',
      },
      columns: {
        label: 'Annonce',
        price: 'Prix',
        numberOfViews: 'Nombre de vues',
        orderDate: 'Date de commande',
        orderName: 'Numéro de commande',
        status: 'Statut',
        actions: 'Actions',
      },
      actions: {
        edit: 'Modifier',
        delete: 'Supprimer',
        pause: 'Mettre en pause',
        activate: 'Activer',
      },
    },
    menuBlocks: {
      chat: {
        title: 'Messagerie',
      },
      personalInfos: {
        title: 'Mes préférences de vente',
      },
      security: {
        title: 'Sécurité et connexion',
      },
      alerts: {
        title: 'Alertes',
      },
      logout: {
        title: 'Déconnexion',
      },
      faq: {
        title: 'Consulter notre FAQ',
      },
    },
    order: {
      orderedOn: 'Commandé le',
      orderNumber: 'N° de commande',
      orderHistory: 'Suivi de la commande',
      contactVendor: 'Contacter le vendeur',
      contactBuyer: `Contacter l'acheteur`,
      downloadShippingLabel: {
        button: "Télécharger le bordereau d'expédition",
      },
      cancel: {
        button: 'Annuler la commande',
        form: {
          title: 'Etes-vous sûr de vouloir annuler cette commande ?',
          description: `L'acheteur sera remboursé et vous ne pourrez pas revenir en arrière.`,
          actions: {
            confirm: 'Confirmer',
            cancel: 'Annuler',
          },
          cancelSuccess: 'La commande a bien été annulée.',
          cancelError: `Une erreur s'est produite, merci de réessayer plus tard.`,
        },
      },
      shipping: {
        title: 'Expédition',
        description: `Vous avez expédié le produit au client? N'oubliez pas de renseigner le lien de suivi:`,
        noTrackingUrl: `Je ne connais pas le lien de suivi`,
        helper: {
          title: 'Je ne connais pas le lien de suivi',
          input: 'N° de suivi:',
          actions: {
            confirm: 'Valider',
          },
        },
        actions: {
          confirm: `Valider l'expédition de la commande`,
        },
        fulfillment: {
          success: 'Bien reçu, nous allons prévenir le client.',
        },
        errors: {
          generic: `Oups, une erreur s'est produite. Merci de contacter le support technique.`,
          valueCantHaveSpaces: `La valeur ne peut pas contenir d'espaces.`,
        },
        trackingUrl: 'Lien de suivi',
      },
      contact: 'Contacter',
      price: 'Prix',
      totalPrice: 'Total',
      priceDetail: {
        PRODUCT_PRICE: 'Article',
        PRODUCT_DISCOUNT: 'Remise client',
        BUYER_SHIPPING: 'Livraison',
        BUYER_COMMISSION: 'Garantie Barooders',
        BUYER_DISCOUNT: 'Réduction',
        VENDOR_SHIPPING: 'Frais de livraison',
        VENDOR_COMMISSION: 'Frais Barooders',
      },
    },
  },
  catalog: {
    title: 'Mon catalogue',
    update: {
      askForProductUpdateConfirmation: (action: string) =>
        `Etes-vous sûr de vouloir ${action.toLowerCase()} cet article ?`,
      yes: 'Oui',
      no: 'Annuler',
      successToaster: `Message reçu, nous allons mettre à jour votre annonce`,
      errorToaster: `Une erreur s'est produite, merci de réessayer plus tard`,
    },
  },
  purchases: {
    title: 'Mes achats',
  },
  favorites: {
    title: 'Mes articles favoris',
    emptyList: () => (
      <span>
        Vous n&apos;avez pas encore rajouté de produits en favoris ! Rendez vous
        sur une{' '}
        <Link
          href="/collections/velos"
          className="underline"
        >
          page collection
        </Link>{' '}
        pour trouver votre vélo préféré.
      </span>
    ),
  },
  makeOffer: {
    openModal: 'Faire une offre',
    fillYourOfferTitle: 'Renseignez votre offre',
    rulePriceExplanation: (maxAmountPercent: number) =>
      `Dans la limite des ${maxAmountPercent}% d’écarts du prix affiché`,
    rulePriceCancel:
      'Tout offre dépassant cette limite ne sera pas envoyée au vendeur',
    emergency: 'N’oubliez pas, cette pépite peut partir vite !',
    send: 'Envoyer',
    offerSentTitle: 'Offre envoyée',
    offerHasBeenSent: 'Votre offre à bien été envoyée au vendeur',
    quickResponse: 'Vous recevrez une réponse dans les meilleurs délais',
    backToSite: 'Retour au site',
    goToChat: 'Ouvrir la messagerie',
    customerService: 'Une question ? Contactez notre service client',
    newPricePlaceholder: '€',
    newPriceLabel: 'Prix proposé',
    ongoinPriceOffer: 'Vous avez une offre en cours',
    seePriceOffer: "Voir l'offre",
    maxPriceError:
      "Vous ne pouvez pas faire une offre au dessus du prix d'achat",
    minPriceError: (maxAmountPercent: number) =>
      `Vous ne pouvez pas proposer une réduction de plus de ${maxAmountPercent.toString()}%`,
    originalPrice: (originalPrice: number) => (
      <>
        Le prix actuel est de{' '}
        <span className="font-semibold">{originalPrice.toString()}€</span>
      </>
    ),
  },
  ski: {
    mondopointSizeTitle: 'Guide des tailles',
    mondopointSizeDescription:
      'Ci-dessous la correspondance des tailles de pieds Mondopoint et pointure européenne',
  },
  discounts: {
    blackFriday: 'Black Friday',
    freeShipping: 'Livraison Offerte',
    loweringPrice: 'Prix en baisse',
  },
  sellingForm: {
    updateLatencyTitle: 'Délai de prise en compte',
    updateLatencyDescription:
      '15min pour la page produit / 1h pour les pages collections',
    addNewBrand: (brand: string) => `Ajoutez la marque "${brand}"`,
    addNewModel: (model: string) => `Ajoutez le modèle "${model}"`,
    unknownModel: 'Je ne connais pas le modèle',
    createMainTitle: 'Vendre un article',
    chooseProductType: 'Choisissez votre type de produit',
    chooseBrandTitle: 'De quelle marque ?',
    chooseModelTitle: 'De quel modèle ?',
    updateMainTitle: 'Compléter les informations',
    productTypeSearchPlaceholder: 'VTT, Vélo de route, Ski...',
    stepToComplete: (plural: boolean) =>
      plural ? 'étapes restantes' : 'étape restante',
    validate: 'Valider',
    informationStep: {
      stepTitle: 'Informations',
    },
    imageStep: {
      stepTitle: 'Photos',
      refresh: 'Recharger',
      imagePlaceholderData: {
        addPicture: 'Ajouter une photo',
        front: 'Vue de face',
        side: 'Vue de profil',
        back: 'Vue arrière',
        logo: 'Marque/Logo',
        details: 'Détails',
        rightProfile: 'Vue profil droit',
        leftProfile: 'Vue profil gauche',
        direction: 'Cintre / guidon',
        frontDerailleur: 'Dérailleur avant',
        rearDerailleur: 'Dérailleur arrière',
        fork: 'Fourche',
      },
      insertPictures: 'Insérer vos photos',
      addAPicture: 'Ajouter une photo',
      minimumPictures: '3 minimum',
      advisePopup: {
        buttonTitle: 'Nos conseils',
        buttonSubtitle: 'Pour prendre de meilleures photos',
        doNotCutTitle: 'Ne coupez pas votre article',
        doNotCutDescription:
          'Prenez une photo de votre article en entier pour donner une vision d’ensemble.',
        cleanBackgroundTitle: 'Soignez l’arrière-plan',
        cleanBackgroundDescription:
          'Optez pour un fond clair et épuré afin de mettre en valeur l’article.',
        showDefaultsTitle: 'Montrez les défauts',
        showDefaultsDescription:
          'Pour prévenir l’acheteur, ajoutez dès à présent des photos des défauts ou signes d’usure.',
        yourPictureTitle: 'Prenez vous même les photos',
        yourPictureDescription:
          'Nous n’acceptons pas les photos importées depuis internet car elles ne nous permettent pas de connaître l’état réel de votre article.',
        singleProductTitle: 'Postez une annonce par article',
        singleProductDescription:
          'Par soucis de clarté, nous vous demandons de créer une annonce par article que vous souhaitez vendre.',
      },
    },
    conditionAndPriceStep: {
      stepTitle: 'État et prix',
      stateInputLabel: 'État',
      stateInputContent: 'État de votre produit',
      priceInputLabel: 'Prix',
      priceInputContent: 'Prix de vente',
      priceAdvised: 'Prix recommandé',
      unknownNewPrice: 'Je ne connais pas le prix neuf.',
      newPriceLabel: 'Prix neuf',
      priceAdvices: {
        ideal: `Prix idéal pour cet article ! Votre article trouvera une seconde vie en un rien de temps.`,
        correct: `La recommandation se fonde sur l'état de votre article et sur le prix neuf, avec ce prix vous optimisez la vitesse de vente.`,
        lower: `Pensez à baisser le prix de votre article. La recommandation se fonde sur l'état de votre article et sur le prix neuf, avec ce prix vous optimisez la vitesse de vente.`,
        impossible: `Le prix de vente ne peut pas être supérieur au prix neuf.`,
      },
      states: {
        new: {
          title: 'Neuf',
          description:
            "Article neuf, jamais utilisé avec étiquette ou dans son emballage d'origine.",
        },
        veryGood: {
          title: 'Très bon état',
          description:
            'Article très peu utilisé, qui peut avoir de légères imperfections, mais qui reste en très bon état.',
        },
        good: {
          title: 'Bon état',
          description:
            "Article utilisé quelques fois, qui peut montrer des imperfections et des signes d'usure.",
        },
      },
    },
    personalInfoStep: {
      stepTitle: 'Mes informations',
      phoneNumberLabel: 'Numéro de téléphone',
      handDeliveryLabel: "J'accepte la remise en main propre.",
      handDeliveryPostalCodeLabel: 'Code postal',
      handDeliveryPostalCodeExample: '38100',
    },
    descriptionStep: {
      stepTitle: 'Description',
      describeArticle: 'Décris ton article',
      minimumCharacters: '20 caractères minimum',
      placeholder: 'Ex: utilisé une saison, taille correctement',
    },
    validated: {
      mainTitle: 'Annonce soumise avec succès',
      listingPublished: 'Votre annonce a été publiée',
      moderationTitle:
        'Nous allons vérifier les critères suivants et revenir vers vous dans les 24h',
      validationSteps: {
        quality: 'Son authenticité et sa qualité',
        state: 'Que son état est conforme à notre charte d’utilisation',
        pictures: 'La qualité des photos',
      },
      findYourListing:
        "Vous pourrez voir votre annonce d'ici 15min dans l’espace",
      myShop: 'Ma boutique',
      addAnother: 'Ajouter un autre produit',
    },
  },
  productPage: {
    clickHere: 'Cliquez ici',
    ownerBanner: {
      title: 'Vendeur',
      warning:
        '⚠️ Un délai de 15min est nécessaire pour que vos modifications soient prises en compte sur cette page',
      editProduct: 'Modifier',
    },
  },
  b2b: {
    unauthorizedUser: 'Vous n’êtes pas autorisé à accéder à cette page',
    proPage: {
      title: 'Vos résultats',
      saveSearch: {
        buttonLabel: 'Enregistrer',
        successToaster: 'Recherche enregistrée',
        title: 'Enregistrer mes préférences',
        subTitle: 'Mes critères',
        description:
          'Sauvegardez vos critères de recherche pour les retrouver plus tard',
        modify: 'Modifier',
        validate: 'Valider',
      },
    },
    productCard: {
      makeAnOffer: 'Faire une offre',
      availableQuantity: 'Quantité disponible',
      largestBundlePrice: 'P.U. pour le lot complet',
    },
  },
};

export default fr;
