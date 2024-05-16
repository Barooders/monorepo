type TopCategoryPropsType = {
  source: string;
  link: string;
  title: string;
};

const TopCategory: React.FC<TopCategoryPropsType> = ({
  source,
  link,
  title,
}) => {
  return (
    <a
      href={link}
      className="flex flex-col items-center rounded-xl bg-[#f3f5f7] p-4"
    >
      <img
        src={source}
        alt="Top Category"
        className="h-[128px] max-h-[128px] min-h-[128px] w-[128px] min-w-[20px] max-w-[128px] object-contain object-center grayscale"
      />
      <span className="overflow-hidden whitespace-nowrap text-center font-bold">
        {title}
      </span>
    </a>
  );
};

const categories = [
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_vtt_0dfe4680f7.png',
    link: '/collections/vtt',
    title: 'VTT',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_emtb_cfbe46de4f.png',
    link: '/collections/vtt-electriques',
    title: 'VTT électriques',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_ecitybike_2ec3522015.png',
    link: '/collections/velos-de-ville-electriques',
    title: 'Vélos de ville électriques',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_etrekking_2ad5bbfa6f.png',
    link: '/collections/velos-de-trekking-tout-chemin',
    title: 'Vélos de trekking',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_gravel_779bdfa493.png',
    link: '/collections/gravel',
    title: 'Gravel',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_hollandais_1d5805b2c3.png',
    link: '/collections/velos-urbains-et-hollandais',
    title: 'Vélos hollandais',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/homepage_road_65f959a456.png',
    link: '/collections/velos-de-route',
    title: 'Vélos de route',
  },
];

const TopCategories: React.FC = () => {
  return (
    <div className="flex gap-2 overflow-x-scroll">
      {categories.map((category, idx) => (
        <TopCategory
          key={idx}
          {...category}
        />
      ))}
    </div>
  );
};

export default TopCategories;
