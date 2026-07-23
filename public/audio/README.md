Sound design assets go here. Each file is referenced by id in
src/lib/audio/sound-controller.ts:

  hover.mp3            short, soft tick (around 60 ms)
  click.mp3            crisp click (around 80 ms)
  submit-chime.mp3     warm one-shot chime
  whoosh-soft.mp3      short whoosh for transitions
  load-complete.mp3    one-shot tonal cue
  tick.mp3             very short tick for the split-flap counter
  title-card.mp3       single hit for the loader title cascade
  whoosh.mp3           medium whoosh for stamp animations

Until real audio is sourced, the controller logs a console warning once per
missing cue and the site continues silently. Source royalty-cleared assets
from a service that permits institutional use, such as the Adobe Audition
sound effects library, the BBC sound effects archive (BBC SFX terms apply),
or a licensed Soundsnap subscription. Save each file at the path above.
