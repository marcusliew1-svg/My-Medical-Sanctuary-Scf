export const CONTROLLED_PUBLIC_LAUNCH_MODE = "informational";

// This is intentionally the smallest publishable surface. Additional informational
// routes move here only after their route-level content and asset evidence is approved.
export const controlledPublicRouteAllowlist = [
  "/",
  "/contact",
  "/book-appointment",
  "/online-doctor",
  "/privacy-disclaimer",
  "/privacy-pdpa",
  "/privacy-policy",
  "/cookie-notice",
  "/terms",
  "/terms-of-use",
] as const;

export const controlledPublicIndexableRoutes = ["/"] as const;

const controlledPublicRouteSet = new Set<string>(controlledPublicRouteAllowlist);

export function isControlledPublicLaunch(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VERCEL_ENV === "production"
    && env.MMS_PRODUCTION_LAUNCH_MODE?.trim().toLowerCase() === CONTROLLED_PUBLIC_LAUNCH_MODE;
}

export function isControlledPublicRouteAllowed(pathname: string): boolean {
  return controlledPublicRouteSet.has(pathname === "" ? "/" : pathname.replace(/\/$/, "") || "/");
}

export function controlledPublicRouteUnavailable(
  pathname: string,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (!isControlledPublicLaunch(env)) return false;
  return !isControlledPublicRouteAllowed(pathname);
}
