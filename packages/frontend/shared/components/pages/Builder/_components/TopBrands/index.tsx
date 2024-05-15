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
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F18b768ca3ec44395bcae39399e1db252',
    link: '/collections/canyon',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fd81a7ee10d8343fb9222df6deb564bba',
    link: '/collections/specialized',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fd81a7ee10d8343fb9222df6deb564bba',
    link: '/collections/scott',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fd81a7ee10d8343fb9222df6deb564bba',
    link: '/collections/garmin',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fd81a7ee10d8343fb9222df6deb564bba',
    link: '/collections/cube',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fd81a7ee10d8343fb9222df6deb564bba',
    link: '/collections/giant',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fd81a7ee10d8343fb9222df6deb564bba',
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
