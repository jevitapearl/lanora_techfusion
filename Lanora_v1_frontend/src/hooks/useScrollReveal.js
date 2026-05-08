import { useEffect, useRef, useState } from "react";

export function useScrollReveal(options = { threshold: 0.1, rootMargin: "0px" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // observer.unobserve(entry.target); // keep tracking if we want to reverse or just reveal once? usually reveal once is fine, let's keep it one way.
        if (ref.current) observer.unobserve(ref.current);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return { ref, isVisible };
}
