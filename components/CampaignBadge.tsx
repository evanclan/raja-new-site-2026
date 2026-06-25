"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLoading } from "./LoadingProvider";
import { useI18n } from "@/lib/i18n";

// Keep in sync with PROJECT.id in components/forgood/campaign.ts. Keying the
// dismissal to the campaign id lets a future campaign re-surface the badge
// without a code change (and never re-nags a user who closed this one).
const CAMPAIGN_ID = "1003662";
const DISMISS_KEY = "raja:forgood-campaign-dismissed";
const ARTICLE_PATH = "/news/forgood-ib-campaign";

// Tiny external store over localStorage so the dismissed flag reads correctly
// on the client (and stays `false` during SSR → no hydration mismatch, and no
// flash since the entrance is gated on `loaded` behind the preloader anyway).
const dismissListeners = new Set<() => void>();
function subscribeDismiss(cb: () => void) {
  dismissListeners.add(cb);
  return () => dismissListeners.delete(cb);
}
function getDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === CAMPAIGN_ID;
  } catch {
    return false; // storage blocked (private mode) → show
  }
}
function dismissCampaign() {
  try {
    localStorage.setItem(DISMISS_KEY, CAMPAIGN_ID);
  } catch {
    // ignore — private mode, just won't persist this session
  }
  dismissListeners.forEach((l) => l());
}

/**
 * A quiet, fixed right-middle card that signals the crowdfunding campaign is
 * live and links to the on-site article. The campaign key visual leads, with a
 * readable cream footer ("● Campaign live") so the message never depends on the
 * busy image. It grows on larger screens via the fluid-rem system, fades in
 * after the preloader like the Nav, is dismissible (remembered locally), and
 * hides itself on the campaign article it points to. z-30 keeps it under the
 * Nav (z-40) and the mobile drawer (z-48/49).
 */
export function CampaignBadge() {
  const pathname = usePathname();
  const { loaded } = useLoading();
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const dismissed = useSyncExternalStore(
    subscribeDismiss,
    getDismissed,
    () => false, // server snapshot — render the badge during SSR
  );

  // Pointing a "go here" badge at the page you're already on is noise.
  if (pathname === ARTICLE_PATH) return null;

  const show = !dismissed;
  const x = prefersReduced ? 0 : 24;

  return (
    <AnimatePresence>
      {show && (
        // Outer wrapper owns the fixed right-middle position + vertical centering,
        // so the inner card is free to animate its own transform (slide-in) without
        // fighting the -translate-y-1/2 centering.
        <div className="group pointer-events-none fixed right-3 top-1/2 z-30 -translate-y-1/2 md:right-5">
          <motion.div
            className="pointer-events-auto relative"
            initial={{ opacity: 0, x }}
            animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : x }}
            exit={{ opacity: 0, x }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          >
            <Link
              href={ARTICLE_PATH}
              aria-label={t.campaignBadge.aria}
              className="block w-[6.5rem] overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-18px_rgba(32,35,58,0.5)] ring-1 ring-[color:rgba(32,35,58,0.08)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-18px_rgba(32,35,58,0.6)] focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-leaf)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[8rem] md:w-[9.5rem] lg:w-[11rem] xl:w-[12.5rem]"
            >
              {/* Campaign key visual */}
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src="/floating-campaign.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 200px, (min-width: 1024px) 176px, (min-width: 768px) 152px, 104px"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
                <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" aria-hidden="true" />
              </div>

              {/* Cream footer — the readable "live" message, independent of the image */}
              <div className="flex items-center gap-1.5 bg-[var(--color-cream)] px-2.5 py-1.5">
                <span className="relative inline-flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
                  <span className="campaign-ping absolute inset-0 rounded-full bg-[var(--color-leaf)] opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-leaf)]" />
                </span>
                <span className="whitespace-nowrap font-display text-2xs font-medium tracking-tight text-[var(--color-ink-soft)] md:text-xs">
                  {t.campaignBadge.label}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto translate-x-0 text-[var(--color-peach)] opacity-0 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:opacity-100"
                >
                  →
                </span>
              </div>
            </Link>

            {/* Dismiss — sibling of the Link (never nested in the anchor), so
                clicking it never navigates. Reachable via Tab; visible on intent. */}
            <button
              type="button"
              onClick={dismissCampaign}
              aria-label={t.campaignBadge.dismiss}
              className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full border border-[color:rgba(32,35,58,0.1)] bg-[var(--color-cream)] text-[var(--color-ink-soft)] opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-leaf)]"
            >
              <svg width="9" height="9" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
