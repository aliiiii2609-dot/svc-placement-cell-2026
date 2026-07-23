import { lazy, type ComponentType } from 'react';

/**
 * Why this file exists
 * --------------------
 * App.tsx previously carried this note:
 *
 *   "Eager imports — every page ships in the main bundle. Total app code is
 *    small enough that lazy/Suspense added flake (chunk-load failures on some
 *    deploys showed an infinite spinner) without meaningful savings."
 *
 * The diagnosis was right about the symptom and wrong about the cause. The
 * flake was not lazy loading being unreliable. It was this specific sequence,
 * which every Vite SPA on a CDN hits eventually:
 *
 *   1. A visitor loads index.html. It references chunks hashed for deploy A.
 *   2. The cell pushes deploy B. Netlify replaces the assets. The old hashed
 *      filenames are gone.
 *   3. The visitor, still on the deploy-A page, navigates to a route whose
 *      chunk only ever existed in deploy A. The request 404s, the dynamic
 *      import rejects, and Suspense hangs forever with no error boundary
 *      underneath it. Hence the infinite spinner.
 *
 * The fix is to catch the rejection, force one hard reload to pick up the new
 * index.html (and therefore the new chunk names), and only surface a real
 * error if the reload also fails. A sessionStorage flag prevents a reload loop
 * when the chunk is genuinely missing rather than merely stale.
 *
 * The savings were also not "meaningless". Eagerly importing all 20 routes
 * dragged jspdf, html2canvas, docx, dompurify and file-saver onto the home
 * page for the benefit of the CV builder, which nobody visits first.
 */

const RELOAD_FLAG = 'svc-chunk-reloaded';

export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      const component = await factory();
      // Import succeeded, so any earlier stale-chunk state is resolved.
      try {
        window.sessionStorage.removeItem(RELOAD_FLAG);
      } catch {
        /* private mode, non-fatal */
      }
      return component;
    } catch (error) {
      let alreadyReloaded = false;
      try {
        alreadyReloaded = window.sessionStorage.getItem(RELOAD_FLAG) === '1';
      } catch {
        /* private mode, non-fatal */
      }

      if (!alreadyReloaded) {
        try {
          window.sessionStorage.setItem(RELOAD_FLAG, '1');
        } catch {
          /* private mode, non-fatal */
        }
        // Hard reload fetches a fresh index.html with the current chunk names.
        window.location.reload();
        // Never resolves; the reload wins the race. Prevents Suspense from
        // flashing an error state on the way out.
        return new Promise<{ default: T }>(() => {});
      }

      // Reload already tried and it still fails. This is a real error, so let
      // it reach AppErrorBoundary, which renders a recoverable message.
      throw error;
    }
  });
}
