import {
  MegaMenuCardType,
  MegaMenuChunk,
  MegaMenuItem,
} from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { ImageComponent } from '@/components/molecules/MegaMenu/shared/types/strapi/components/Image.types';
import {
  StrapiPluginMenu,
  StrapiPluginMenuItem,
} from '@/components/molecules/MegaMenu/shared/types/strapi/plugins/StrapiPluginMenus.types';

/**
 * It checks whether a given string is a valid URL or not.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - Returns whether the URL is valid or not.
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);

    return true;
  } catch (err) {
    return false;
  }
};

/**
 * It parses a strapi link into an internal url string
 * @param {string} url - The URL to validate.
 * @returns {string} - Returns the parsed url
 */
export const parseUrl = (strapiUrl: string): string => {
  if (!isValidUrl(strapiUrl)) return '#';

  const url = new URL(strapiUrl);

  return url.host === 'barooders.com' ? url.pathname : strapiUrl;
};

/**
 * Capitalize a given string
 * @param {string} text - The string to capitalize
 * @returns {string} - The capitalized string
 */
export const capitalize = (text: string): string => {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
};

/**
 * It takes Strapi API response and parses it into a JSON object that is
 * easier to consume from our front end.
 *
 * The function itself (maybe) could have been developed in a cleaner
 * way (recursive or such), however the behavior of one menu level is so
 * specific regarding another one that I decided to keep it that way.
 *
 * @param {StrapiPluginMenu} strapiMenu - Strapi response from
 * `/api/menus/:menuId` GET request.
 */
export const parseMegaMenu = (strapiMenu: StrapiPluginMenu): MegaMenuChunk => {
  /**
   * It parses a strapi card link item into a MegaMenuItem.
   * @param {StrapiPluginMenuItem} item - A strapi (link) menu item.
   * @returns {MegaMenuItem} - The parsed card data.
   */
  const parseMegaMenuLink = (item: StrapiPluginMenuItem): MegaMenuItem => ({
    id: item.id,
    title: item.attributes.title,
    url: parseUrl(item.attributes.url),
    target: item.attributes.target,
    isBackbone: !!item.attributes.is_sport_section,
    mobileHeaderOrder: item.attributes.mobile_header_order ?? 0,
    isHiddenInMenu: !!item.attributes.is_hidden_in_menu,
  });

  /**
   * It parses a strapi card menu item into a MegaMenuCard.
   * @param {StrapiPluginMenuItem} item - A strapi (card) menu item.
   * @returns {MegaMenuCard} - The parsed card data.
   */
  const parseMegaMenuCard = (item: StrapiPluginMenuItem): MegaMenuCardType => ({
    id: item.id,
    title: item.attributes.title,
    url: parseUrl(item.attributes.url),
    target: item.attributes.target,
    button_text: item.attributes.button_text,
    image: item.attributes.card_image.data as ImageComponent,
    isBackbone: !!item.attributes.is_sport_section,
    mobileHeaderOrder: item.attributes.mobile_header_order ?? 0,
    isHiddenInMenu: !!item.attributes.is_hidden_in_menu,
  });

  /**
   * It takes a strapi menu item and get its maximum nesting level.
   * @param {StrapiPluginMenuItem} item - The current menu item being
   * processed.
   * @param {number} nestingLvl - The current nesting level.
   * @returns {number} - The max nesting level of a menu item of
   * lvl 1.
   */
  const getMaxNestingLvl = (
    item: StrapiPluginMenuItem,
    nestingLvl = 0,
  ): number => {
    nestingLvl += 1;

    if (item.attributes.children.data.length) {
      const itemsNestingLvl = item.attributes.children.data.map((subItem) =>
        getMaxNestingLvl(subItem, nestingLvl),
      );

      return Math.max(...itemsNestingLvl);
    }

    return nestingLvl;
  };

  /**
   * It parses Strapi plugin menus items of level 1 into an array
   * of item modeled in the way they are expected.
   * @param {StrapiPluginMenuItem[]} items - Strapi plugin menus
   * items.
   * @returns {MegaMenuChunk} - The parsed menu items of level 1.
   */
  const parseMegaMenuItems = (
    strapiItems: StrapiPluginMenuItem[],
    parentCards: MegaMenuCardType[] = [],
    maxNestingLvl: number | undefined = undefined,
    currentLvl = 0,
  ): MegaMenuChunk => {
    currentLvl += 1;

    const cards: MegaMenuCardType[] = parentCards || [];

    const items: MegaMenuItem[] = strapiItems.flatMap((strapiItem) => {
      if (
        strapiItem.attributes.item_type === 'card' &&
        strapiItem.attributes.is_default
      ) {
        // Parse `card` item
        const card = parseMegaMenuCard(strapiItem);

        if (currentLvl === 0) cards.push(card);
        else cards.unshift(card);

        return [];
      }

      // Parse `link` item
      const item: MegaMenuItem = parseMegaMenuLink(strapiItem);

      if (currentLvl === 1) {
        item.maxNestingLvl = getMaxNestingLvl(strapiItem);
      }

      // Parse children
      if (strapiItem.attributes.children.data.length) {
        item.children = parseMegaMenuItems(
          strapiItem.attributes.children.data,
          cards,
          item.maxNestingLvl,
          currentLvl,
        );

        // Pin items of level 3 and 4 to items of level 2
        if (currentLvl === 2 && maxNestingLvl === 4)
          item.children.pinnedItems = getPinnedItems(strapiItem);
      }

      return item;
    });

    return {
      items,
      cards,
    };
  };

  /**
   * It gets items of level 3 and 4 that are pinned.
   * A pinned item is an item that should show up in a 'highlight'
   * menu sort of under item of level 2.
   * @param {StrapiPluginMenuItem} item - A strapi plugin menu item.
   * @param {MegaMenuItem[]} pinnedItems - The parsed pinned items.
   * @returns {MegaMenuItem[]} - It returns the parsed pinned items.
   */
  const getPinnedItems = (
    item: StrapiPluginMenuItem,
    pinnedItems: MegaMenuItem[] = [],
  ): MegaMenuItem[] => {
    if (item.attributes.children.data.length) {
      item.attributes.children.data.forEach((subItem) => {
        if (subItem.attributes.is_pinned && isValidUrl(subItem.attributes.url))
          pinnedItems.push(parseMegaMenuLink(subItem));

        if (subItem.attributes.children.data.length)
          getPinnedItems(subItem, pinnedItems);
      });
    }

    return pinnedItems;
  };

  const parsedMenu = parseMegaMenuItems(strapiMenu.data.attributes.items.data);

  return parsedMenu;
};

/**
 * It locks user scroll by applying a hidden overflow on html tag.
 * @returns {void}
 */
export const lockScroll = () => {
  const html = document.querySelector('html');

  if (!html) return;

  html.style.overflowY = 'hidden';
};

/**
 * It unlocks user scroll by removing a hidden overflow on html tag.
 * @returns {void}
 */
export const unlockScroll = () => {
  const html = document.querySelector('html');

  if (!html) return;

  html.style.overflowY = 'initial';
};
