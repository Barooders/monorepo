import NoSSR from '@/components/atoms/NoSSR';
import { getDictionary } from '@/i18n/translate';
import { FaCheck } from 'react-icons/fa';
import TrustpilotWidget from './TrustpilotWidget';

type Props = {
  className: string;
};

const Ellipse: React.FC<Props> = ({ className }) => (
  <svg
    width="86"
    height="21"
    viewBox="0 0 86 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      id="Ellipse 1"
      d="M-41.958 -52.642C-43.5325 -41.6096 -42.1989 -30.3573 -38.0892 -19.9985C-33.9796 -9.63979 -27.2363 -0.533698 -18.5267 6.41865C-9.81703 13.371 0.55702 17.9286 11.5689 19.6405C22.5808 21.3523 33.8489 20.1591 44.2581 16.1789C54.6672 12.1987 63.8567 5.56943 70.917 -3.05285C77.9774 -11.6751 82.664 -21.9916 84.513 -32.9813C86.362 -43.971 85.3093 -55.2531 81.4592 -65.711C77.609 -76.169 71.0948 -85.4404 62.5612 -92.6077L54.7164 -83.2674C61.6236 -77.4661 66.8963 -69.9618 70.0127 -61.4969C73.129 -53.0321 73.9811 -43.9003 72.4845 -35.0051C70.9879 -26.1099 67.1945 -17.7596 61.4797 -10.7806C55.765 -3.80161 48.3269 1.56419 39.9016 4.78583C31.4763 8.00747 22.3558 8.97328 13.4426 7.58767C4.52942 6.20206 -3.86747 2.51308 -10.9172 -3.11424C-17.9668 -8.74156 -23.425 -16.1122 -26.7514 -24.4966C-30.0778 -32.8811 -31.1572 -41.9889 -29.8828 -50.9187L-41.958 -52.642Z"
      fill="white"
      fillOpacity="0.1"
    />
  </svg>
);

const AnnouncementBar = () => {
  const dict = getDictionary('fr');

  return (
    <div className="bg-secondary-900 relative hidden h-9 w-full text-white lg:block">
      <Ellipse className="absolute left-0 top-0" />
      <div className="max-w-page-content mx-auto flex h-full items-center justify-between">
        <div>
          <NoSSR>
            <TrustpilotWidget />
          </NoSSR>
        </div>
        <div className="flex gap-12">
          {dict.header.announcementItems.map((item) => (
            <div
              key={item}
              className="flex flex-row items-center text-sm"
            >
              <div className="rounded-2xl bg-white bg-opacity-10 p-1">
                <FaCheck />
              </div>
              <span className="ml-3">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <Ellipse className="absolute bottom-0 right-0 rotate-180" />
    </div>
  );
};

export default AnnouncementBar;
