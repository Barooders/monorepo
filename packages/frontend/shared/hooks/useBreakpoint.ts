import { createBreakpoint } from 'react-use';

export enum Breakpoint {
  XXL = 'XXL',
  XL = 'XL',
  LG = 'LG',
  MD = 'MD',
  SM = 'SM',
}

export const useBreakpoint = createBreakpoint({
  [Breakpoint.XXL]: 1536,
  [Breakpoint.XL]: 1280,
  [Breakpoint.LG]: 1024,
  [Breakpoint.MD]: 768,
  [Breakpoint.SM]: 640,
});
