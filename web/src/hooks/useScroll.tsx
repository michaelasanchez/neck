
import * as React from 'react';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export const useScroll = (
  containerRef: MutableRefObject<HTMLDivElement>,
  topRef: MutableRefObject<HTMLDivElement>,
  bottomRef: MutableRefObject<HTMLDivElement>,
  autoScroll: boolean,
) => {

  // Browser scroll position
  useEffect(() => {
    if (!!containerRef?.current && !!topRef?.current) {
      const first = topRef.current;
      const last = !!bottomRef?.current
        ? (bottomRef.current)
        : first;

      const main = containerRef.current;

      const scrollPadding = 100;

      const top = first.offsetTop - scrollPadding;
      const bottom = last.offsetTop + last.offsetHeight + scrollPadding;

      let scrollPosition;
      if (top < main.scrollTop) {
        scrollPosition = top;
      } else if (bottom > main.scrollTop + main.offsetHeight) {
        scrollPosition = bottom - main.offsetHeight;
      }

      if (scrollPosition !== undefined && !!autoScroll)
        main.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  }, [topRef, bottomRef, /*mode,*/ autoScroll]);

  return {}
}