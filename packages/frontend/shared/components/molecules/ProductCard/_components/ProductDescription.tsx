import BlockEllipsis from '@/components/atoms/BlockEllipsis';
import { getDictionary } from '@/i18n/translate';
import capitalize from 'lodash/capitalize';
import toPairs from 'lodash/toPairs';
import { ProductMultiVariants } from '../types';

const dict = getDictionary('fr');

const PINNED_TAGS = ['marque', 'modele', 'taille', 'genre', 'année'];
type TagPairsType = [string, string][];

const ProductDescription: React.FC<{
  description: string | undefined;
  tags: ProductMultiVariants['tags'];
  variantCondition: ProductMultiVariants['variantCondition'];
  isTitle?: boolean;
}> = ({ description, tags, variantCondition, isTitle = false }) => {
  const tagPairs = toPairs(tags);
  const tagsToDisplay = [
    ...([
      [
        dict.components.productCard.conditionKey,
        dict.components.productCard.getConditionLabel(variantCondition),
      ],
    ] as TagPairsType),
    ...(PINNED_TAGS.map((name) => [name, tags[name] ?? '-']) as TagPairsType),
    ...tagPairs.filter(
      ([name]) => !PINNED_TAGS.includes(name) && name !== 'état',
    ),
  ];
  const TitleWrapper = isTitle ? 'h2' : 'p';
  return (
    <>
      {description && (
        <>
          <TitleWrapper className="mb-3 font-semibold">
            {dict.components.productCard.description}
          </TitleWrapper>
          <BlockEllipsis>
            <div
              className="product-description__content text-sm"
              dangerouslySetInnerHTML={{
                __html: /<[^>]*>/.test(description)
                  ? description
                  : description.replaceAll('\n', '<br>'),
              }}
            />
          </BlockEllipsis>
        </>
      )}
      <TitleWrapper className="mb-3 font-semibold">
        {dict.components.productCard.technicalCharacteristics}
      </TitleWrapper>
      <BlockEllipsis>
        <table className="table-auto">
          <tbody>
            {tagsToDisplay.map(([name, value]) => (
              <tr key={name}>
                <td className="pr-5 text-slate-500">
                  {capitalize(name.replaceAll('-', ' '))}
                </td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </BlockEllipsis>
    </>
  );
};

export default ProductDescription;
