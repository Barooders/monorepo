import { Injectable } from '@nestjs/common';
import { XMLProduct } from '../types';
import { XMLMapper } from '../xml.mapper';

@Injectable()
export class ZycloraMapper extends XMLMapper {
  getDescription({ tags, description }: XMLProduct): string {
    const videoLink = tags.find(({ key }) => key === 'url_video')?.value;

    if (!videoLink?.startsWith('https://')) return description;

    return `<a href=${videoLink} target="_blank" rel="noopener noreferrer">Voir la vidéo 360 de ce produit.</a><br>${description}`;
  }
}
