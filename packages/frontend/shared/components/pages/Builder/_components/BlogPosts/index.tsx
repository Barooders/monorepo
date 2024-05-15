import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type BlogPostPropsType = {
  source: string;
  title: string;
  description: string;
  link: string;
};

const posts: BlogPostPropsType[] = [
  {
    title: 'Assurance Vélo et Vélo Électrique',
    description:
      "L'assurance vélo / VAE offre une protection idéale en cas de vol ou d'accident. Barooders vous explique tout sur le contrat de vélo !",
    link: 'https://barooders.com/blogs/infos/assurance-velo-electrique',
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F1ae5bd2b7bdc404baf86bf570cd13d68',
  },
  {
    title: 'Pression de Pneu de Vélo : Quelle Pression Adopter',
    description:
      'Une pression de pneu de vélo adéquate est cruciale pour une sortie sûre et performante.',
    link: 'https://barooders.com/blogs/infos/pression-pneu-velo',
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fdde32d18165b4181a9cc0417a71f75f3',
  },
  {
    title: 'Comment choisir la taille de son vélo ?',
    description:
      'Vous ne savez pas quelle taille de vélo choisir ? Barooders vous explique tout sur la bonne taille et comment trouver : taille de cadre, mesures, etc.',
    link: 'https://barooders.com/blogs/infos/comment-choisir-taille-velo',
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F69780453e3ff4a3989ecd0f12d60ab23',
  },
  {
    title: "Prime Vélo Électrique 2023 : Toutes les Aides d'Achat",
    description:
      "Besoin d'une aide à l’achat de vélo électrique en 2023 ? Bonus vélo, prime de conversion, on vous explique tout sur les primes de vélo électrique !",
    link: 'https://barooders.com/blogs/infos/aide-achat-velo-electrique',
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F88a456044d3545bdab06447456b196c5',
  },
];

const BlogPost: React.FC<BlogPostPropsType> = ({
  source,
  title,
  description,
  link,
}) => {
  return (
    <div className="grid max-w-[300px] gap-2 rounded border border-slate-200">
      <div className="h-[160px] w-[300px]">
        <img
          src={source}
          className="h-full w-full overflow-hidden object-cover"
        />
      </div>
      <div className="grid gap-2 p-4">
        <span className="text-xl font-semibold">{title}</span>
        <span className="text-sm text-slate-600">{description}</span>

        <Button
          className="font-base mt-4 h-fit w-fit self-end"
          href={link}
          intent="tertiary"
        >
          {dict.homepage.blog.readMore}
        </Button>
      </div>
    </div>
  );
};

const BlogPosts: React.FC = () => {
  return (
    <div className="flex gap-2 overflow-x-scroll">
      {posts.map((post, idx) => (
        <BlogPost
          key={idx}
          {...post}
        />
      ))}
    </div>
  );
};

export default BlogPosts;
