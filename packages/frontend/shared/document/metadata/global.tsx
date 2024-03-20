import { getDictionary } from '@/i18n/translate';
import mapValues from 'lodash/mapValues';
import { Viewport } from 'next';
import Head from 'next/head';
import React from 'react';

const dict = getDictionary('fr');

export const viewportConfig: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadataConfig = {
  metadataBase: new URL(
    `https://${process.env.NEXT_PUBLIC_FRONT_DOMAIN ?? 'https://barooders.com'}`,
  ),
  title: dict.homepage.head.title,
  manifest: '/manifest.json', //NOT WORKING
  description: dict.global.head.description,
  openGraph: {
    siteName: dict.homepage.head.title,
    url: 'https://barooders.com',
    type: 'website',
    description: dict.global.head.description,
    images: [
      {
        url: '/social-sharing.png',
        width: 1200,
        height: 628,
      },
    ],
  },
  icons: {
    icon: { url: '/barooders-picto.png', sizes: '48x48' },
    apple: '/apple-icon.png',
  },
  twitter: {
    title: dict.homepage.head.title,
    card: 'summary_large_image',
    description: dict.global.head.description,
  },
  appleWebApp: {
    title: dict.homepage.head.title,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'facebook-domain-verification': '2bg35dnysqlxefvuinoau11wvaj7fv',
    'google-site-verification': 'qGIr3PKT6jApsn_0VP2_vpU7yQeiqEylIUC8tDveYCQ',
    'theme-color': '#20292f',
  },
};

export const Metadata = () => {
  return (
    <Head>
      <title>{metadataConfig.title}</title>
      <link
        rel="icon"
        href={metadataConfig.icons.icon.url}
        sizes={metadataConfig.icons.icon.sizes}
      />
      <link
        href={metadataConfig.icons.apple}
        rel="apple-touch-icon"
      />
      <link
        rel="manifest"
        href={metadataConfig.manifest}
      />
      <meta
        name="viewport"
        key="viewport"
        content="width=device-width,initial-scale=1"
      />
      <meta
        content="yes"
        name="apple-mobile-web-app-capable"
        key="apple-mobile-web-app-capable"
      />
      {Object.values(
        mapValues(metadataConfig.other, (value, name) => (
          <meta
            name={name}
            key={name}
            content={value}
          />
        )),
      )}
      <meta
        name="description"
        key="description"
        content={metadataConfig.description}
      />
      <meta
        property="og:site_name"
        key="og:site_name"
        content={metadataConfig.openGraph.siteName}
      />
      <meta
        property="og:url"
        key="og:url"
        content={metadataConfig.openGraph.url}
      />
      <meta
        property="og:title"
        key="og:title"
        content={metadataConfig.openGraph.siteName}
      />
      <meta
        property="og:type"
        key="og:type"
        content={metadataConfig.openGraph.type}
      />
      <meta
        property="og:description"
        key="og:description"
        content={metadataConfig.openGraph.description}
      />
      {metadataConfig.openGraph.images.map((image) => (
        <React.Fragment key={image.url}>
          <meta
            property="og:image"
            key="og:image"
            content={image.url}
          />
          <meta
            property="og:image:secure_url"
            key="og:image:secure_url"
            content={image.url}
          />
          <meta
            property="og:image:width"
            key="og:image:width"
            content={image.width.toString()}
          />
          <meta
            property="og:image:height"
            key="og:image:height"
            content={image.height.toString()}
          />
        </React.Fragment>
      ))}
      <meta
        name="twitter:site"
        key="twitter:site"
        content="@"
      />
      <meta
        name="twitter:card"
        key="twitter:card"
        content={metadataConfig.twitter.card}
      />
      <meta
        name="twitter:title"
        key="twitter:title"
        content={metadataConfig.twitter.title}
      />
      <meta
        name="twitter:description"
        key="twitter:description"
        content={metadataConfig.twitter.description}
      />
    </Head>
  );
};
