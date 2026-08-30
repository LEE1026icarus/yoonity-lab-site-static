type AnalyticsEnvironment = {
  NEXT_PUBLIC_GTM_CONTAINER_ID?: string;
};

const CONTAINER_ID_PATTERN = /^GTM-[A-Z0-9]+$/i;

export function getGoogleTagManagerContainerId(
  env: AnalyticsEnvironment = {
    NEXT_PUBLIC_GTM_CONTAINER_ID: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
  },
) {
  const containerId = env.NEXT_PUBLIC_GTM_CONTAINER_ID?.trim();
  return containerId && CONTAINER_ID_PATTERN.test(containerId)
    ? containerId
    : undefined;
}
