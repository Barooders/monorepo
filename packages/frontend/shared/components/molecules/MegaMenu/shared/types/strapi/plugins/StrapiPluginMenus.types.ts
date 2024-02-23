import { ImageComponent } from '@/components/molecules/MegaMenu/shared/types/strapi/components/Image.types'

export interface StrapiPluginMenu {
    data: {
        id: number,
        attributes: {
            title: string,
            slug: string,
            createdAt: Date,
            updatedAt: Date
            items: {
                data: StrapiPluginMenuItem[]
            }
        }
    },
    meta: unknown
}

export interface StrapiPluginMenuItem {
    id: number,
    attributes: {
        order: number,
        title: string,
        url: string,
        target: string | null,
        item_type: StrapiPluginMenuItemType,
        is_pinned: boolean | null,
				is_hidden_in_menu: boolean | null,
				mobile_header_order: number | null,
				is_sport_section: boolean | null,
        button_text: string | null,
        is_default: boolean | null,
        createdAt: Date,
        updatedAt: Date,
        card_image: {
            data: ImageComponent | null
        },
        children: {
            data: StrapiPluginMenuItem[]
        }
    }
}

enum StrapiPluginMenuItemType {
    Link = 'link',
    Card = 'card'
}