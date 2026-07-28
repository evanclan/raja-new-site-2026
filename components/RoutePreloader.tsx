"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Preloader } from "./Preloader";
import { useLoading } from "./LoadingProvider";

/**
 * Mounts the brand preloader on the homepage only.
 *
 * Every other route skips the choreography — but the loading phase still
 * has to reach "ready" immediately, because Nav, CampaignBadge and the
 * hero reveal all key off `loaded`/`done`. Once the phase is "ready"
 * (either path), the preloader never mounts again for the session, so
 * client-side navigation back to "/" doesn't replay it — it's a
 * first-visit brand moment, and mounting <Preloader/> in the "ready"
 * phase would lock scroll behind an overlay that never exits.
 */
export function RoutePreloader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { done, markReady } = useLoading();

  useEffect(() => {
    if (!isHome && !done) markReady();
  }, [isHome, done, markReady]);

  if (!isHome || done) return null;
  return <Preloader />;
}
