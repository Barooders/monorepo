import { ImageComponent } from '@/components/molecules/MegaMenu/shared/types/strapi/components/Image.types'

export interface MegaMenuChunk {
    items: MegaMenuItem[],
    pinnedItems?: MegaMenuItem[],
    cards?: MegaMenuCardType[]
}

export interface MegaMenuItem {
    id: number,
    title: string,
    url: string,
    target: string | null,
    children?: MegaMenuChunk,
    // Only present for menu items of level 1
    maxNestingLvl?: number,
    isBackbone: boolean,
    isHiddenInMenu: boolean,
		mobileHeaderOrder: number,
}

export interface MegaMenuCardType extends MegaMenuItem {
    id: number,
    button_text: string | null,
    image: ImageComponent,
    image_mobile?: ImageComponent,
}
