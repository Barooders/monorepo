'use client';

import { ImageType } from '@/types';
import Image, { getUrlByFormat } from '@/components/atoms/Image';
import { KeenSliderPlugin, useKeenSlider } from 'keen-slider/react';
import { useEffect, useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { CardLabel } from '../types';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { getDictionary } from '@/i18n/translate';
import ProductLabel from './ProductLabel';

const dict = getDictionary('fr');

type PropsType = {
  images: ImageType[];
  labels: CardLabel[];
  isSoldOut: boolean;
};

const WheelControls: KeenSliderPlugin = (slider) => {
  let touchTimeout: ReturnType<typeof setTimeout>;
  let position: {
    x: number;
    y: number;
  };
  let wheelActive: boolean;

  function dispatch(e: WheelEvent, name: string) {
    position.x -= e.deltaX;
    position.y -= e.deltaY;
    slider.container.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          x: position.x,
          y: position.y,
        },
      }),
    );
  }

  function wheelStart(e: WheelEvent) {
    position = {
      x: e.pageX,
      y: e.pageY,
    };
    dispatch(e, 'ksDragStart');
  }

  function wheel(e: WheelEvent) {
    dispatch(e, 'ksDrag');
  }

  function wheelEnd(e: WheelEvent) {
    dispatch(e, 'ksDragEnd');
  }

  function eventWheel(e: WheelEvent) {
    e.preventDefault();
    if (!wheelActive) {
      wheelStart(e);
      wheelActive = true;
    }
    wheel(e);
    clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
      wheelActive = false;
      wheelEnd(e);
    }, 50);
  }

  slider.on('created', () => {
    slider.container.addEventListener('wheel', eventWheel, {
      passive: false,
    });
  });
};

const ProductGallery: React.FC<PropsType> = ({
  images,
  labels = [],
  isSoldOut,
}) => {
  const [loaded, setLoaded] = useState(images.map((_, index) => index === 0));
  const [firstLoad, setFirstLoad] = useState(true);
  const [thumbnailsCreated, setThumbnailsCreated] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: selectedSlideIndex,
    animationEnded: (slider) => {
      setSelectedSlideIndex(slider.track.details.rel);
    },
  });
  const [thumbnailRef, thumbnailInstanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: selectedSlideIndex,
      vertical: true,
      mode: 'free-snap',
      slides: {
        perView: 5,
        spacing: 10,
      },
      created() {
        setThumbnailsCreated(true);
      },
    },
    [WheelControls],
  );

  const canGoNext =
    sliderInstanceRef.current?.track?.details &&
    selectedSlideIndex !== sliderInstanceRef.current.track.details.maxIdx;
  const canGoPrevious = selectedSlideIndex !== 0;

  const goNext = () => {
    if (!canGoNext) return;
    setSelectedSlideIndex(selectedSlideIndex + 1);
  };

  const goPrevious = () => {
    if (!canGoPrevious) return;
    setSelectedSlideIndex(selectedSlideIndex - 1);
  };

  useEffect(() => {
    sliderInstanceRef.current?.moveToIdx(selectedSlideIndex);
    thumbnailInstanceRef.current?.moveToIdx(selectedSlideIndex);
    const newLoaded = [...loaded];
    newLoaded[selectedSlideIndex] = true;
    setLoaded(newLoaded);
  }, [selectedSlideIndex]);

  useEffect(() => {
    let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
      gallery: '#photoswipe-barooders',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    return () => {
      if (lightbox) lightbox.destroy();
      lightbox = null;
    };
  }, []);

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    thumbnailInstanceRef.current?.update();
  }, [firstLoad]);

  return (
    <div className="flex h-full w-full gap-1">
      <div className="hidden h-full w-24 flex-shrink-0 sm:block">
        <div
          className="keen-slider h-full"
          ref={thumbnailRef}
        >
          {!firstLoad &&
            images.map((image: ImageType, index: number) => (
              <div
                onClick={() => setSelectedSlideIndex(index)}
                key={index}
                className={`keen-slider__slide cursor-pointer ${
                  index === selectedSlideIndex
                    ? 'rounded border-2 border-black'
                    : ''
                }`}
              >
                {thumbnailsCreated && (
                  <Image
                    src={image.src}
                    format="thumbnail"
                    altText={image.altText}
                    className="mb-1"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="relative h-full flex-grow overflow-hidden">
        <div
          id="photoswipe-barooders"
          className="pswp-gallery keen-slider h-full cursor-grab"
          ref={sliderRef}
        >
          {images.map((image: ImageType, index: number) => (
            <a
              href={getUrlByFormat(image.src, 'full')}
              data-pswp-width={image.width}
              data-pswp-height={image.height}
              key={'photoswipe-barooders-' + index}
              target="_blank"
              rel="noreferrer"
              className={`keen-slider__slide ${
                firstLoad && index !== 0 ? 'hidden' : ''
              }`}
            >
              {loaded[index] ? (
                <Image
                  src={image.src}
                  format="medium"
                  altText={image.altText}
                />
              ) : (
                <Image
                  src={image.src}
                  format="thumbnail"
                  altText={image.altText}
                  blurred
                />
              )}
            </a>
          ))}
        </div>
        {sliderInstanceRef.current?.track?.details && (
          <>
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-0 bottom-0 my-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white disabled:cursor-default disabled:opacity-70"
                  onClick={goPrevious}
                  disabled={!canGoPrevious}
                >
                  <HiOutlineChevronLeft />
                </button>
                <button
                  className="absolute right-3 top-0 bottom-0 my-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white disabled:cursor-default disabled:opacity-70"
                  onClick={goNext}
                  disabled={!canGoNext}
                >
                  <HiOutlineChevronRight />
                </button>
              </>
            )}

            <div className="absolute top-2 left-2 md:top-3 md:left-3">
              {labels
                .filter((label) => label.position === 'left')
                .map((label, index) => (
                  <ProductLabel
                    key={index}
                    label={label}
                  />
                ))}
            </div>
            <div className="absolute top-2 right-2 md:top-3 md:right-3">
              {labels
                .filter((label) => label.position === 'right')
                .map((label, index) => (
                  <ProductLabel
                    key={index}
                    label={label}
                  />
                ))}
            </div>
            <div className="absolute bottom-4 right-0 left-0 mx-auto flex flex-wrap justify-center gap-2 px-4 sm:hidden">
              {[
                ...Array(
                  sliderInstanceRef.current.track.details.slides.length,
                ).keys(),
              ].map((idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sliderInstanceRef.current?.moveToIdx(idx);
                    }}
                    className={
                      'h-2 w-2 rounded-full border border-slate-200 ' +
                      (selectedSlideIndex === idx ? 'bg-blue-300' : 'bg-white')
                    }
                  ></button>
                );
              })}
            </div>
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-300 bg-opacity-30">
                <p className="outlined-text -rotate-12 text-6xl font-bold text-primary-600">
                  {dict.components.productCard.soldOut}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
