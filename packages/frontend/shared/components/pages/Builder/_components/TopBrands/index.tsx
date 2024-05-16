type TopCategoryPropsType = {
  source: string;
  link: string;
};

const TopBrand: React.FC<TopCategoryPropsType> = ({ source, link }) => {
  return (
    <a
      href={link}
      className="h-[90px] w-[200px] min-w-[200px] items-center rounded-xl bg-[#f3f5f7] p-4"
    >
      <img
        src={source}
        alt="Top Brand"
        className="h-full w-full max-w-full object-contain object-center grayscale"
      />
    </a>
  );
};

const brands = [
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_canyon_0f9a549bc5.png',
    link: '/collections/canyon',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_specialized_a34b2d7dc0.webp',
    link: '/collections/specialized',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_scott_a37eaa0858.webp',
    link: '/collections/scott',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_garmin_45d60baebd.webp',
    link: '/collections/garmin',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_cube_27866ffe52.webp',
    link: '/collections/cube',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_giant_3553487242.webp',
    link: '/collections/giant',
  },
  {
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_cannondale_0dc4f80e7d.webp',
    link: '/collections/cannondale',
  },
];

const TopBrands: React.FC = () => {
  return (
    <div className="flex gap-2 overflow-x-scroll">
      {brands.map((brand, idx) => (
        <TopBrand
          key={idx}
          {...brand}
        />
      ))}
    </div>
  );
};

export default TopBrands;
