import type { Howl as HowlType } from 'howler';

/**
 * Sound design controller for the Placement Cell site.
 *
 * Behaviour:
 *   - Disabled by default. The user must enable sound via the footer toggle.
 *   - All cues are short, refined, and rate-gated (one per cue per 2.5s).
 *   - Audio files live at /public/audio/<id>.mp3 once sourced.
 *   - Until audio files are sourced, calls are no-ops, the site still runs.
 *
 * Loading:
 *   Howler is imported dynamically, and only on the first play() call made
 *   while sound is enabled. Previously it was a static import, so every
 *   visitor downloaded and parsed the whole library on first paint to support
 *   a feature that is off by default AND has no audio files behind it yet
 *   (/public/audio contains only a README). It now costs nothing until a
 *   visitor actively turns sound on.
 *
 * To wire real audio:
 *   1. Drop royalty-cleared audio clips into /public/audio matching the
 *      filenames in CUES below.
 *   2. Confirm Howl initialises without 404s in browser console.
 *   3. Enable the footer toggle to test.
 */

export type SoundCue =
  | 'hover'
  | 'click'
  | 'submit'
  | 'transition'
  | 'load-complete'
  | 'counter-tick'
  | 'title-card'
  | 'whoosh';

const CUES: Record<SoundCue, { src: string; volume: number; minIntervalMs: number }> = {
  hover: { src: '/audio/hover.mp3', volume: 0.18, minIntervalMs: 90 },
  click: { src: '/audio/click.mp3', volume: 0.3, minIntervalMs: 120 },
  submit: { src: '/audio/submit-chime.mp3', volume: 0.5, minIntervalMs: 2000 },
  transition: { src: '/audio/whoosh-soft.mp3', volume: 0.35, minIntervalMs: 600 },
  'load-complete': { src: '/audio/load-complete.mp3', volume: 0.45, minIntervalMs: 5000 },
  'counter-tick': { src: '/audio/tick.mp3', volume: 0.18, minIntervalMs: 80 },
  'title-card': { src: '/audio/title-card.mp3', volume: 0.5, minIntervalMs: 3000 },
  whoosh: { src: '/audio/whoosh.mp3', volume: 0.4, minIntervalMs: 600 },
};

type HowlCtor = typeof import('howler').Howl;

class SoundController {
  private enabled = false;
  private howls: Partial<Record<SoundCue, HowlType>> = {};
  private lastPlayed: Partial<Record<SoundCue, number>> = {};
  private warned = new Set<SoundCue>();
  private HowlRef: HowlCtor | null = null;
  private loading: Promise<HowlCtor> | null = null;

  /** Dynamically pull in Howler the first time it is actually needed. */
  private async ensureHowler(): Promise<HowlCtor> {
    if (this.HowlRef) return this.HowlRef;
    if (!this.loading) {
      this.loading = import('howler').then((mod) => {
        this.HowlRef = mod.Howl;
        return mod.Howl;
      });
    }
    return this.loading;
  }

  /**
   * Warm the library ahead of the first cue. Called by the footer toggle at
   * the moment the visitor opts in, so the very first hover tick is not late.
   */
  preload(): void {
    if (this.enabled) void this.ensureHowler();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
    if (value) void this.ensureHowler();
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('svc-sound-enabled', value ? '1' : '0');
      } catch {
        /* non-fatal */
      }
    }
  }

  loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      this.enabled = window.localStorage.getItem('svc-sound-enabled') === '1';
    } catch {
      /* non-fatal */
    }
  }

  play(cue: SoundCue): void {
    if (!this.enabled) return;
    const def = CUES[cue];
    const now = Date.now();
    const last = this.lastPlayed[cue] ?? 0;
    if (now - last < def.minIntervalMs) return;
    this.lastPlayed[cue] = now;

    // Fire and forget. play() stays synchronous for every call site; the
    // await only ever costs anything on the very first enabled cue.
    void this.playAsync(cue, def);
  }

  private async playAsync(
    cue: SoundCue,
    def: { src: string; volume: number; minIntervalMs: number },
  ): Promise<void> {
    let Howl: HowlCtor;
    try {
      Howl = await this.ensureHowler();
    } catch {
      return; /* library failed to load, stay silent */
    }
    if (!this.enabled) return;

    let howl = this.howls[cue];
    if (!howl) {
      howl = new Howl({
        src: [def.src],
        volume: def.volume,
        preload: false,
        onloaderror: () => {
          if (!this.warned.has(cue)) {
            this.warned.add(cue);
            // eslint-disable-next-line no-console
            console.warn(`[sound] missing ${def.src}. Drop the file at /public${def.src} when ready.`);
          }
        },
      });
      this.howls[cue] = howl;
    }
    try {
      howl.play();
    } catch {
      /* non-fatal */
    }
  }
}

export const sound = new SoundController();
