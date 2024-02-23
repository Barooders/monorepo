import React, { useId } from 'react';

import styles from './Icon.module.scss';

type IconSource =
  | React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  | string;

type Props = {
  source: IconSource;
  accessibilityLabel?: string;
  color?: string;
};

interface CssCustomProps {
  paddingTop: string;
  width: string;
  fill?: string;
}

const Icon = ({ source, accessibilityLabel, color }: Props) => {
  const uid = useId().replaceAll(':', '');

  const SourceComponent = source;

  let cssCustomProps: CssCustomProps | undefined = undefined;

  // Since using dom manipulation with useEffect causes display issue with
  // vite-plugin-ssr,
  // we need to parse viewBox from the source itself
  // We convert the source to a string, and do some ugly manipulation to
  // retrieve viewBox value
  const getViewBoxFromString = (str: string): string | null => {
    const fragments = str.split('viewBox:');

    if (fragments.length > 1) {
      const viewBoxFraments = fragments[1].trim().split('",');

      if (viewBoxFraments.length > 1) return viewBoxFraments[0];
    }

    return null;
  };

  const getAspectRatio = () => {
    const sourceAsString = source.toString();
    const viewBox = getViewBoxFromString(sourceAsString);

    if (viewBox) {
      const viewBoxDimensions = viewBox.split(' ').slice(2, 4);

      const dimensions = {
        paddingTop: '100%',
        width: '100%',
      };

      // If addPadding > 100 we must cap it a 100 and reduce width
      // so that svg won't go off div
      const ratio =
        parseFloat(viewBoxDimensions[1]) / parseFloat(viewBoxDimensions[0]);
      const neededPadding = ratio * 100;

      if (neededPadding > 100) {
        dimensions.paddingTop = '100%';
        dimensions.width = `${Math.ceil((100 * 100) / neededPadding).toFixed(
          2,
        )}%`;
      } else dimensions.paddingTop = `${neededPadding.toFixed(2)}%`;

      return dimensions;
    }
  };

  const getColor = () => {
    const fillColor = {
      fill: 'inherit',
    };

    if (color) fillColor.fill = color;

    return fillColor;
  };

  if (!cssCustomProps) {
    const iconDimensions = getAspectRatio();
    const iconColor = getColor();

    cssCustomProps = {
      ...iconDimensions,
      ...iconColor,
    } as CssCustomProps;
  }

  return (
    <i
      id={`Icon-${uid}`}
      className={styles['Icon']}
      style={cssCustomProps}
    >
      {accessibilityLabel?.length && (
        <span className={styles['AccessibilityLabel']}>
          {accessibilityLabel}
        </span>
      )}
      <SourceComponent
        focusable="false"
        aria-hidden="true"
      />
    </i>
  );
};

export default Icon;
