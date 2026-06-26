import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Legacy-URL redirect layer for the WordPress → Next.js migration.
 *
 * The old raja-international.com (WordPress) had ~70+ indexed URLs across
 * /academy, /preschool, /clab, /home and post slugs. The new site folds all
 * of that into a single homepage with section anchors, so we 301 every old
 * URL to its closest matching section (better UX + SEO than dumping all to /).
 * Anything we don't recognise falls back to the homepage so nothing 404s.
 *
 * To revert to "everything → homepage", delete SECTION_REDIRECTS and always
 * use "/". To soften during cutover, change 301 → 302 (temporary, not cached).
 */

// The new site's OWN routes — never redirect these.
const NEW_ROUTES = [
  "/news",
  "/preview-clab",
  "/preview-english",
  "/preview-study-abroad",
];

// Old WordPress URL prefixes → closest section on the new single-page site.
// Tested in order against the decoded pathname; first match wins.
const SECTION_REDIRECTS: Array<{ test: RegExp; to: string }> = [
  { test: /^\/academy-news/, to: "/#news" },
  { test: /^\/academy/, to: "/#academy" },
  { test: /^\/(clab|c-lab|clabeducation|edu-)/, to: "/#clab" },
  { test: /^\/preschool/, to: "/#preschool" },
  { test: /^\/international-studies/, to: "/#study-abroad" },
  { test: /^\/home\/留学/, to: "/#study-abroad" },
  { test: /^\/home\/習い事/, to: "/#english" },
  { test: /^\/home\/インターナショナル/, to: "/#academy" },
  { test: /^\/home\/学童/, to: "/#clab" },
  { test: /^\/home\/about/, to: "/#intro" },
  { test: /^\/home\/(問い合わせ|recruit|スタッフ|留意)/, to: "/#inquiry" },
  { test: /^\/(問い合わせ|contact)/, to: "/#inquiry" },
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Already on the homepage — nothing to do.
  if (pathname === "/") return NextResponse.next();

  // Let the new site's real routes through untouched.
  if (NEW_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Match old sections (decode so Japanese slugs compare correctly).
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    /* malformed encoding — fall back to raw pathname */
  }

  const match = SECTION_REDIRECTS.find((r) => r.test.test(decoded));
  const destination = match ? match.to : "/";

  return NextResponse.redirect(new URL(destination, req.url), 301);
}

export const config = {
  // Run on all paths EXCEPT Next internals, API routes, and files with an
  // extension (sitemap.xml, robots.txt, images, /_next assets, favicon...).
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
