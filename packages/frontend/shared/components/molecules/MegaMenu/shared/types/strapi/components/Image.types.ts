export interface ImageFormatData {
    ext: string,
    hash: string,
    height: number,
    width: number,
    mime: string,
    path: string | null,
    size: number,
    url: string
}

export type ImageFormatKey =
    'thumbnail'
    | 'small'
    | 'medium'
    | 'large'

export interface ImageComponent {
    id: number,
    attributes: {
        alternativeText: string,
        caption: string,
        createdAt: Date,
        ext: string,
        formats: {
            [key in ImageFormatKey]: ImageFormatData
        },
        hash: string,
        height: number,
        mime: string,
        name: string,
        previewUrl: string | null,
        provider: string,
        provider_metadata: string,
        size: number,
        updatedAt: Date,
        url: string,
        width: number
    }
}