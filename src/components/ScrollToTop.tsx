import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSmoothScroll } from "./motion/SmoothScroll";

/**
 * Resets the viewport on navigation — instantly, so the incoming page
 * transition never plays against a moving scroll position.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname, scrollTo]);

  return null;
}
