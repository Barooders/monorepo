import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type AmbassadorProps = {
  source: string;
  name: string;
  title: string;
  link: string | undefined;
};

const Ambassador = ({ source, name, title, link }: AmbassadorProps) => {
  return (
    <div className="flex min-w-[190px] shrink-0 flex-col items-center rounded border border-slate-100 px-3 py-4 sm:min-w-[220px]">
      <img
        className="h-[100px] w-[100px] rounded-full object-cover sm:h-[120px] sm:w-[120px]"
        src={source}
        alt={name}
      />
      <span className="mt-2 text-center text-base font-semibold md:text-lg">
        {name}
      </span>
      <span className="text-center text-xs md:text-sm">{title}</span>
      <Button
        size="small"
        href={link}
        intent="secondary"
        className="mt-4"
      >
        {link
          ? dict.homepage.ambassadors.link.seeShop
          : dict.homepage.ambassadors.link.comingSoon}
      </Button>
    </div>
  );
};

const ambassadors = [
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_horn_5348cb69fd.webp',
    name: 'Mike Horn',
    title: dict.homepage.ambassadors.explorer,
    link: 'https://barooders.com/collections/vendors?q=Mike%20Horn',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_karabatic_04a747ff12.webp',
    name: 'Nikola Karabatic',
    title: dict.homepage.ambassadors.handballer,
    link: 'https://barooders.com/collections/vendors?q=Nikola%20Karabatic',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_horn_anninka_b5cb2fc87b.webp',
    name: 'Annika Horn',
    title: dict.homepage.ambassadors.sportswoman,
    link: 'https://barooders.com/collections/vendors?q=Annika%20Horn',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_cuvet_004cb78815.jpg',
    name: 'Olivier Cuvet',
    title: dict.homepage.ambassadors.cyclist,
    link: 'https://barooders.com/collections/vendors?refinementList%5Bvendor%5D%5B0%5D=Olivier%20Cuvet&q=Olivier%20Cuvet',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_kayser_f4a7c70f8c.webp',
    name: 'Benjamin Kayser',
    title: dict.homepage.ambassadors.commentator,
    link: 'https://barooders.com/collections/vendors?q=Benjamin%20Kayser',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_marchand_98f96233a9.webp',
    name: 'Julien Marchand',
    title: dict.homepage.ambassadors.rugbyman,
    link: undefined,
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_fickou_a78d34799d.webp',
    name: 'Gael Fickou',
    title: dict.homepage.ambassadors.rugbyman,
    link: undefined,
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_penaud_df2d2def2b.webp',
    name: 'Damian Penaud',
    title: dict.homepage.ambassadors.rugbyman,
    link: undefined,
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_soudee_4eb115b49c.webp',
    name: 'Guirec Soudée',
    title: dict.homepage.ambassadors.navigator,
    link: 'https://barooders.com/collections/vendor?q=Guirec20Soudee',
  },
];

const Ambassadors = () => {
  return (
    <div className="flex w-full gap-4 overflow-auto">
      {ambassadors.map((ambassador, index) => (
        <Ambassador
          key={index}
          {...ambassador}
        />
      ))}
    </div>
  );
};

export default Ambassadors;
