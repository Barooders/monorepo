import Button from '@/components/atoms/Button';
import { HiTrash, HiX } from 'react-icons/hi';
import {
  useClearRefinements,
  useCurrentRefinements,
} from 'react-instantsearch-hooks-web';
import { getFacetValueLabel } from './utils/getFacetLabel';

const ActiveFilters = (props: {
  includedAttributes?: string[];
  excludedAttributes?: string[];
  buttonSize: 'medium' | 'small';
}) => {
  const { items, refine } = useCurrentRefinements(props);
  const { refine: clearRefine } = useClearRefinements(props);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-3">
        <ul className="flex flex-grow items-center gap-2 overflow-x-auto lg:flex-wrap">
          {items.length > 0 && (
            <li className="shrink-0">
              <Button
                onClick={() => clearRefine()}
                intent="primary"
                className="h-full py-2 text-sm"
                size={props.buttonSize}
              >
                <HiTrash className="text-white" />
              </Button>
            </li>
          )}
          {items.map((item) =>
            item.refinements.map((refinement) => (
              <li
                key={`${item.label} - ${refinement.label}`}
                className="shrink-0"
              >
                <Button
                  onClick={() => refine(refinement)}
                  intent="tertiary"
                  className="text-sm"
                  size={props.buttonSize}
                >
                  <div className="flex items-center gap-2 text-gray-800">
                    <HiX />{' '}
                    {getFacetValueLabel(refinement.attribute, refinement.label)}
                  </div>
                </Button>
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
};

export default ActiveFilters;
