import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://examfrompdf.com";

export function useCanonical() {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = `${BASE_URL}${location.pathname === "/" ? "" : location.pathname}`;
    
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (link) {
      link.href = canonicalUrl;
    } else {
      link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonicalUrl;
      document.head.appendChild(link);
    }

    return () => {
      // Reset to base URL on unmount if needed
    };
  }, [location.pathname]);
}
