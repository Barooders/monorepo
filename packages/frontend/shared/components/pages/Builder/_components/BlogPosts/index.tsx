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
    source: 'assurance_velo_f4c84eb0aa.jpg',
  },
  {
    title: 'Pression de Pneu de Vélo : Quelle Pression Adopter',
    description:
      'Une pression de pneu de vélo adéquate est cruciale pour une sortie sûre et performante.',
    link: 'https://barooders.com/blogs/infos/pression-pneu-velo',
    source: 'pression_pneu_velo_18194743b3.jpg',
  },
  {
    title: 'Comment choisir la taille de son vélo ?',
    description:
      'Vous ne savez pas quelle taille de vélo choisir ? Barooders vous explique tout sur la bonne taille et comment trouver : taille de cadre, mesures, etc.',
    link: 'https://barooders.com/blogs/infos/comment-choisir-taille-velo',
    source: 'Capture_d_ecran_2023_05_25_a_14_18_21_73a77c843e.png',
  },
  {
    title: "Prime Vélo Électrique 2023 : Toutes les Aides d'Achat",
    description:
      "Besoin d'une aide à l’achat de vélo électrique en 2023 ? Bonus vélo, prime de conversion, on vous explique tout sur les primes de vélo électrique !",
    link: 'https://barooders.com/blogs/infos/aide-achat-velo-electrique',
    source: 'Capture_d_ecran_2023_06_20_a_18_17_45_e635c9b702.png',
  },
];

const BlogPost: React.FC<BlogPostPropsType> = ({
  source,
  title,
  description,
  link,
}) => {
  return (
    <div className="flex max-w-[200px] flex-col rounded border border-slate-200 md:max-w-[300px] md:gap-2">
      <div className="h-[120px] w-[200px] md:h-[160px] md:w-[300px]">
        <img
          src={`${process.env.NEXT_PUBLIC_PUBLIC_BUCKET_URL}/${source}`}
          srcSet={
            `${process.env.NEXT_PUBLIC_PUBLIC_BUCKET_URL}/thumbnail_${source} 245w,` +
            `${process.env.NEXT_PUBLIC_PUBLIC_BUCKET_URL}/small_${source} 500w,` +
            `${process.env.NEXT_PUBLIC_PUBLIC_BUCKET_URL}/medium_${source} 750w,` +
            `${process.env.NEXT_PUBLIC_PUBLIC_BUCKET_URL}/${source}`
          }
          sizes="(max-width: 400px) 245w,  (max-width: 800px) 500w, 750w"
          className="h-full w-full overflow-hidden object-cover"
        />
      </div>
      <div className="grid gap-2 p-4">
        <span className="text-sm font-semibold md:text-xl">{title}</span>
        <span className="text-xs leading-normal text-slate-600 md:text-sm">
          {description}
        </span>

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
