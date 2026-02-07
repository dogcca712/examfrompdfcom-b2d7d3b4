import { useEffect } from "react";

export function useNoIndex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    
    if (meta) {
      meta.content = "noindex, nofollow";
    } else {
      meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, nofollow";
      document.head.appendChild(meta);
    }

    return () => {
      // Remove noindex on unmount so other pages can be indexed
      if (meta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      }
    };
  }, []);
}
