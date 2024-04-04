import { Injectable } from '@nestjs/common';
import { RateLimitedPrestashopClient } from './rate-limited.client';

@Injectable()
export class FreeglisseClient extends RateLimitedPrestashopClient {}
