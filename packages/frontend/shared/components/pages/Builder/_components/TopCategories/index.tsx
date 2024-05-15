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
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F86f8fd365ff7485d96ead455e4189365',
    link: '/collections/vtt',
    title: 'VTT',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F5600fbec4b2b4cd58fa29616c9b6598a',
    link: '/collections/vtt-electriques',
    title: 'VTT électriques',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fcd5ca92c50af42e48bc2ca91df8d2ffc',
    link: '/collections/velos-de-ville-electriques',
    title: 'Vélos de ville électriques',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fde77485e38f44cb5a467ef3bcaaa2fb1',
    link: '/collections/velos-de-trekking-tout-chemin',
    title: 'Vélos de trekking',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F903031cb603d4636a3d08afc3ff1a971',
    link: '/collections/gravel',
    title: 'Gravel',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fde77485e38f44cb5a467ef3bcaaa2fb1',
    link: '/collections/velos-urbains-et-hollandais',
    title: 'Vélos hollandais',
  },
  {
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F8d080d94f2394268b4bf1f79a7ffbea6',
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
