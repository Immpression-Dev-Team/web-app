import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SETTLE_MS = 4000;
const STEP_MS = 150;

// Scrolls to the element named by the URL hash (e.g. /#how-it-works) after
// each navigation, clearing the fixed navbar. Target sections often render
// late, and content loading above them pushes them down, so for a few
// seconds it keeps the target aligned — until the visitor scrolls on their
// own, which takes priority.
export default function useHashScroll(navSelector = ".navbar-container") {
  const location = useLocation();

  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;

    const started = Date.now();
    let timer;
    let stopped = false;
    const stop = () => {
      stopped = true;
    };
    const userEvents = ["wheel", "touchstart", "keydown", "mousedown"];
    userEvents.forEach((e) => window.addEventListener(e, stop, { passive: true }));

    const align = () => {
      if (stopped) return;
      const el = document.getElementById(id);
      if (el) {
        const navHeight = document.querySelector(navSelector)?.offsetHeight || 0;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        if (Math.abs(window.scrollY - top) > 2) window.scrollTo(0, top);
      }
      if (Date.now() - started < SETTLE_MS) timer = setTimeout(align, STEP_MS);
    };
    timer = setTimeout(align, 0);

    return () => {
      clearTimeout(timer);
      userEvents.forEach((e) => window.removeEventListener(e, stop));
    };
  }, [location.key, location.hash, navSelector]);
}
