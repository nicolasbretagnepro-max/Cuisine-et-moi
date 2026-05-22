export function registerServiceWorker(): void {
  if (!import.meta.env.PROD) return;
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const baseUrl = import.meta.env.BASE_URL || './';
    const serviceWorkerUrl = `${baseUrl}sw.js`;

    navigator.serviceWorker.register(serviceWorkerUrl).catch((error: unknown) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}
