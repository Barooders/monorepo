import GoodImage from '@/assets/imageAdvices/good-image.jpg';
import BadImage1 from '@/assets/imageAdvices/bad-image-1.jpg';
import BadImage2 from '@/assets/imageAdvices/bad-image-2.jpg';
import BadImage3 from '@/assets/imageAdvices/bad-image-3.jpg';
import BadImage4 from '@/assets/imageAdvices/bad-image-4.jpg';
import BadImage5 from '@/assets/imageAdvices/bad-image-5.jpg';
import { FaCheckCircle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { Fragment } from 'react';
import { StaticImageData } from 'next/image';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');
const imageAdviceLabels = dict.sellingForm.imageStep.advisePopup;

const sectionsDatas = [
  {
    title: imageAdviceLabels.doNotCutTitle,
    goodImage: GoodImage,
    badImage: BadImage1,
    description: imageAdviceLabels.doNotCutDescription,
  },
  {
    title: imageAdviceLabels.cleanBackgroundTitle,
    goodImage: GoodImage,
    badImage: BadImage2,
    description: imageAdviceLabels.cleanBackgroundDescription,
  },
  {
    title: imageAdviceLabels.showDefaultsTitle,
    goodImage: BadImage3,
    badImage: GoodImage,
    description: imageAdviceLabels.showDefaultsDescription,
  },
  {
    title: imageAdviceLabels.yourPictureTitle,
    goodImage: GoodImage,
    badImage: BadImage4,
    description: imageAdviceLabels.yourPictureDescription,
  },
  {
    title: imageAdviceLabels.singleProductTitle,
    goodImage: GoodImage,
    badImage: BadImage5,
    description: imageAdviceLabels.singleProductDescription,
  },
];

const SellFormImagesAdvices = () => {
  const adviceSection = (
    title: string,
    goodImage: StaticImageData,
    badImage: StaticImageData,
    description: string,
  ) => (
    <div className="my-6 px-4">
      <p className="text-lg font-bold">{title}</p>
      <div className="mt-3 flex w-full flex-row">
        <div className="bg-background relative mr-2 h-[200px] w-1/2 flex-1 rounded-lg">
          <div className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#1B74E4]">
            <FaCheckCircle className="text-white" />
          </div>
          <img
            src={goodImage.src}
            className="h-full w-full flex-1 rounded-lg object-cover"
          />
        </div>

        <div className="bg-background relative ml-2 h-[200px] w-1/2 flex-1 rounded-lg">
          <div className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#DE350B]">
            <MdClose
              width={20}
              height={20}
              color="white"
            />
          </div>
          <img
            src={badImage.src}
            className="h-full w-full flex-1 rounded-lg object-cover"
          />
        </div>
      </div>

      <p className="text-secondary-content mt-3 text-sm">{description}</p>
    </div>
  );

  return (
    <>
      <h1>Astuces photos</h1>

      <div className="pb-20">
        {sectionsDatas.map(
          (
            item: {
              title: string;
              description: string;
              goodImage: StaticImageData;
              badImage: StaticImageData;
            },
            index: number,
          ) => {
            const { title, description, goodImage, badImage } = item;
            return (
              <Fragment key={index}>
                {adviceSection(title, goodImage, badImage, description)}
              </Fragment>
            );
          },
        )}
      </div>
    </>
  );
};

export default SellFormImagesAdvices;
