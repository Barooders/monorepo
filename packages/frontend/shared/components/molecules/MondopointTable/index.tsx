import { getDictionary } from '@/i18n/translate';
import Table from '../../atoms/Table';

const dict = getDictionary('fr');

const skiSizes = [
  ['europe', 'mondopoint'],
  ['23', '14.5'],
  ['24', '15'],
  ['25', '15.5'],
  ['25.5', '16'],
  ['26', '16.5'],
  ['27', '17'],
  ['27.5', '17.5'],
  ['28', '18'],
  ['29', '18.5'],
  ['30', '19'],
  ['31', '19.5'],
  ['32', '20'],
  ['33', '21'],
  ['34', '21.5'],
  ['34.5', '21.5'],
  ['35', '22'],
  ['36', '22.5'],
  ['37', '23.5'],
  ['37.5', '23.5'],
  ['38', '24'],
  ['39', '24.5'],
  ['39.5', '25'],
  ['40', '25.5'],
  ['41', '26'],
  ['41.5', '26.5'],
  ['42', '27'],
  ['43', '27.5'],
  ['43.5', '27.5'],
  ['44', '28'],
  ['44.5', '28.5'],
  ['45', '29'],
  ['46', '29.5'],
  ['47', '30'],
  ['47.5', '30.5'],
  ['48', '31'],
  ['49', '31.5'],
  ['50', '32'],
];

const MondopointTable = () => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-semibold">{dict.ski.mondopointSizeTitle}</p>
      <p className="text-sm text-gray-500">
        {dict.ski.mondopointSizeDescription}
      </p>
      <div className="mt-3">
        <Table rows={skiSizes} />
      </div>
    </div>
  );
};

export default MondopointTable;
