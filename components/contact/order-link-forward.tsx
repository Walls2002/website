"use client";

import { useEffect } from "react";

/**
 * The order form used to live at /contact#order, and old posts and bookmarks still
 * link there. A static export has no redirects (and a hash never reaches a server),
 * so the browser forwards that one link to /order, keeping any ?for= on it.
 */
export function OrderLinkForward() {
  useEffect(() => {
    if (window.location.hash === "#order") window.location.replace(`/order/${window.location.search}#order`);
  }, []);
  return null;
}
