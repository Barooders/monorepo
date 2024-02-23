// components/builder.tsx
'use client';

import FullPageIframe from '@/components/atoms/FullPageIframe';
import { Builder, BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { builder, BuilderContent } from '@builder.io/sdk';
import DefaultErrorPage from 'next/error';
import SimpleCollapse from '../../atoms/Collapse/simple';
import HorizontalImageList from '../../atoms/HorizontalImageList';
import CollectionPreview from './_components/CollectionPreview';
import MainHeader from './_components/MainHeader';
import MobileAppAd from './_components/MobileAppAd';
import PanelsInTabs, { AvailableIcons } from './_components/PanelsInTabs';
import Trustpilot from './_components/Trustpilot';

interface BuilderPageProps {
  content?: BuilderContent;
}

Builder.registerComponent(Trustpilot, {
  name: 'Trustpilot',
});

Builder.registerComponent(MobileAppAd, {
  name: 'MobileAppAd',
  inputs: [
    {
      type: 'list',
      name: 'reviews',
      subFields: [
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'content',
          type: 'string',
        },
        {
          name: 'author',
          type: 'string',
        },
        {
          name: 'since',
          type: 'string',
        },
      ],
    },
  ],
  image: 'https://cdn-icons-png.flaticon.com/256/13/13398.png',
});

Builder.registerComponent(PanelsInTabs, {
  name: 'PanelsInTabs',
  inputs: [
    {
      type: 'list',
      name: 'tabs',
      subFields: [
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'panels',
          type: 'list',
          subFields: [
            {
              name: 'icon',
              type: 'string',
              enum: Object.values(AvailableIcons),
            },
            {
              name: 'title',
              type: 'string',
            },
            {
              name: 'content',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
  image: 'https://static.thenounproject.com/png/658625-200.png',
});

Builder.registerComponent(HorizontalImageList, {
  inputs: [
    {
      type: 'list',
      name: 'items',
      subFields: [
        {
          name: 'pictureUrl',
          type: 'string',
        },
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'link',
          type: 'string',
        },
      ],
    },
  ],
  name: 'HorizontalImageList',
  image: 'https://static.thenounproject.com/png/658625-200.png',
});

Builder.registerComponent(CollectionPreview, {
  inputs: [{ name: 'collectionHandle', type: 'string' }],
  name: 'CollectionPreview',
  image: 'https://static.thenounproject.com/png/658625-200.png',
});

Builder.registerComponent(FullPageIframe, {
  inputs: [{ name: 'iframeUrl', type: 'string' }],
  name: 'FullPageIframe',
  image: 'https://static.thenounproject.com/png/658625-200.png',
});

Builder.registerComponent(SimpleCollapse, {
  inputs: [
    { name: 'title', type: 'string' },
    { name: 'content', type: 'string' },
  ],
  name: 'Collapse',
  image: 'https://static.thenounproject.com/png/658625-200.png',
});

const slideTypeDefinition = [
  {
    name: 'image',
    type: 'file',
  },
  {
    name: 'link',
    type: 'string',
  },
];

Builder.registerComponent(MainHeader, {
  inputs: [
    {
      type: 'object',
      name: 'mainSlide',
      subFields: slideTypeDefinition,
    },
    {
      type: 'list',
      name: 'desktopSlides',
      subFields: slideTypeDefinition,
    },
    {
      type: 'list',
      name: 'mobileSlides',
      subFields: slideTypeDefinition,
    },
  ],
  name: 'MainHeader',
  image: 'https://static.thenounproject.com/png/658625-200.png',
});

builder.init(process.env.NEXT_PUBLIC_BUILDER_IO_API_KEY ?? '');

export function RenderBuilderContent({ content }: BuilderPageProps) {
  // Call the useIsPreviewing hook to determine if
  // the page is being previewed in Builder
  const isPreviewing = useIsPreviewing();
  // If `content` has a value or the page is being previewed in Builder,
  // render the BuilderComponent with the specified content and model props.
  if (content || isPreviewing) {
    return (
      <BuilderComponent
        content={content}
        model="page"
      />
    );
  }
  // If the `content` is falsy and the page is
  // not being previewed in Builder, render the
  // DefaultErrorPage with a 404.
  return <DefaultErrorPage statusCode={404} />;
}
