/**
 * Smooth-scroll hook — intentionally a no-op.
 *
 * We previously mounted Lenis, which hijacks the wheel/trackpad and drives the
 * whole page from its own requestAnimationFrame loop. On trackpads and
 * mid-range laptops that continuous loop is a classic source of scroll stutter
 * and input latency: every wheel tick is intercepted, eased, and re-applied a
 * frame late. Native browser scrolling is smoother and costs zero main-thread
 * work when the user is idle.
 *
 * The hook name and signature are kept so callers (App.tsx) keep compiling; it
 * simply does nothing now. Global smoothness, when wanted, is handled with the
 * CSS `scroll-behavior` property instead of a JS loop.
 */
export function useLenis() {
  // No Lenis instance, no rAF loop, no wheel hijacking. Native scroll only.
}
