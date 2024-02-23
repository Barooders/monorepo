import { IoIosStar } from 'react-icons/io';

type PropsType = {
  rating: number;
  className?: string;
};

const MAX_RATING = 5;

const ReviewStars: React.FC<PropsType> = ({ rating, className }) => {
  return (
    <div className={`flex ${className}`}>
      {[...Array(Math.round(MAX_RATING))].map((_, idx) => (
        <IoIosStar
          key={idx}
          className={`${rating > idx ? 'text-[#fbbd05]' : 'text-slate-200'}`}
        />
      ))}
    </div>
  );
};

export default ReviewStars;
