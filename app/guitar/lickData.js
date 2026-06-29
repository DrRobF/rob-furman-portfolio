const basePatterns = {
  bluesTurn: [
    ['G', 5, 0.5], ['G', 6, 0.5], ['B', 5, 0.5], ['B', 8, 1], ['B', 5, 0.5], ['G', 6, 0.5], ['G', 5, 0.5], ['D', 7, 1],
  ],
  bluesBox: [
    ['B', 8, 0.75], ['B', 5, 0.5], ['G', 7, 0.5], ['G', 5, 0.5], ['G', 6, 0.75], ['D', 7, 0.5], ['D', 5, 0.5], ['A', 7, 1],
  ],
  rockClimb: [
    ['A', 5, 0.5], ['A', 7, 0.5], ['D', 5, 0.5], ['D', 7, 0.5], ['G', 5, 0.5], ['G', 7, 0.5], ['D', 7, 0.5], ['A', 7, 1],
  ],
  rockFall: [
    ['B', 8, 0.5], ['B', 5, 0.5], ['G', 7, 0.5], ['G', 5, 0.5], ['D', 7, 0.5], ['D', 5, 0.5], ['A', 7, 0.5], ['A', 5, 1],
  ],
  majorSweet: [
    ['G', 6, 0.5], ['B', 5, 0.5], ['B', 7, 0.5], ['e', 5, 0.75], ['B', 7, 0.5], ['B', 5, 0.5], ['G', 6, 0.5], ['D', 7, 1],
  ],
  majorSixth: [
    ['D', 7, 0.5], ['G', 6, 0.5], ['G', 9, 0.5], ['B', 7, 0.75], ['B', 5, 0.5], ['G', 6, 0.5], ['D', 7, 0.5], ['A', 7, 1],
  ],
  countrySnap: [
    ['G', 4, 0.5], ['G', 6, 0.5], ['B', 5, 0.5], ['B', 7, 0.5], ['e', 5, 0.75], ['B', 7, 0.5], ['B', 5, 0.5], ['G', 6, 1],
  ],
  countrySkip: [
    ['e', 5, 0.5], ['B', 7, 0.5], ['G', 6, 0.5], ['D', 7, 0.5], ['G', 4, 0.5], ['G', 6, 0.5], ['D', 7, 0.5], ['A', 7, 1],
  ],
};

const makeLick = (id, title, style, difficulty, mood, tempo, chordType, techniques, caged, pattern, why, steps) => ({
  id,
  title,
  style,
  difficulty,
  mood,
  tempo,
  chordType,
  techniques,
  caged,
  baseKey: 'A',
  noteEvents: basePatterns[pattern].map(([string, fret, beats]) => ({ string, fret, beats })),
  why,
  steps,
});

export const guitarLicks = [
  makeLick('blues-01', 'Porch Light Turnaround', 'Blues', 'Beginner', 'Gritty', 78, '7', ['slide', 'bend'], 'E-shape', 'bluesTurn', 'Slides into the major third, brushes the minor color, and resolves to a dominant-chord target.', ['Count two beats before starting.', 'Slide into the first chord tone.', 'Keep the bend narrow and vocal.', 'Resolve with space.']),
  makeLick('blues-02', 'River Bend Reply', 'Blues', 'Easy', 'Smoky', 82, '7', ['bend', 'vibrato'], 'E-shape', 'bluesBox', 'A compact call-and-response phrase that turns minor pentatonic into a dominant blues sound.', ['Play it without bends first.', 'Add slow vibrato to the last note.', 'Loop over a shuffle.', 'Answer it with a chord stab.']),
  makeLick('blues-03', 'Blue Door Rake', 'Blues', 'Intermediate', 'Greasy', 72, '7', ['rake', 'hammer-on'], 'E-shape', 'bluesBox', 'The half-step move makes the blues scale lean into the chord instead of floating over it.', ['Mute with both hands.', 'Rake softly into the first note.', 'Delay the hammer-on.', 'Land firmly on the root.']),
  makeLick('blues-04', 'Delta Door Knock', 'Blues', 'Intermediate', 'Raw', 90, '7', ['release', 'hammer-on'], 'E-shape', 'bluesTurn', 'A vocal release followed by a chord-tone slide gives the line an old-school blues finish.', ['Pre-hear the release.', 'Use a light pick attack.', 'Keep eighth notes even.', 'Play it after bar four.']),
  makeLick('blues-05', 'Lantern Shuffle Tag', 'Blues', 'Beginner', 'Laid-back', 86, '7', ['slide'], 'E-shape', 'bluesTurn', 'Simple chord tones and a short turnaround shape make it useful at slow blues tempos.', ['Tap your foot on 2 and 4.', 'Keep the slide short.', 'Do not rush the final note.', 'Repeat at three volumes.']),
  makeLick('blues-06', 'Back Porch Sting', 'Blues', 'Advanced', 'Biting', 96, '7', ['bend', 'pull-off'], 'E-shape', 'bluesBox', 'The high bend creates tension while the descent reconnects to the dominant root.', ['Check bend pitch.', 'Relax after the release.', 'Pull off cleanly.', 'Finish quieter than you start.']),
  makeLick('blues-07', 'Smokehouse Answer', 'Blues', 'Easy', 'Smoky', 80, '7', ['double-stop'], 'A-shape', 'bluesTurn', 'It states the third and flat seventh clearly, so the listener hears the chord change.', ['Pinch the middle strings.', 'Hold the double-stop short.', 'Resolve on beat one.', 'Move it through all keys.']),
  makeLick('blues-08', 'Corner Booth Cry', 'Blues', 'Intermediate', 'Yearning', 68, '7', ['bend', 'vibrato'], 'E-shape', 'bluesBox', 'Longer note values make the bend feel vocal instead of like a scale fragment.', ['Slow the tempo first.', 'Use wide slow vibrato.', 'Leave silence after the lick.', 'Record and check pitch.']),
  makeLick('blues-09', 'Freight Yard Push', 'Blues', 'Easy', 'Driving', 102, '7', ['hammer-on'], 'E-shape', 'bluesTurn', 'Repeated box notes build forward motion while the last note lands inside the chord.', ['Accent the first note.', 'Keep hammer-ons even.', 'Loop for one minute.', 'Try palm muting.']),
  makeLick('blues-10', 'Neon Last Call', 'Blues', 'Advanced', 'Gritty', 74, '9', ['slide', 'bend', 'vibrato'], 'A-shape', 'bluesBox', 'The line implies a dominant ninth by aiming for sweet upper chord tones.', ['Use neck pickup.', 'Milk the top note.', 'Breathe before resolving.', 'Transpose to every filter key.']),

  makeLick('rock-01', 'Garage Door Climb', 'Rock', 'Beginner', 'Punchy', 104, '5', ['hammer-on'], 'E-shape', 'rockClimb', 'Minor-pentatonic hammer-ons create momentum while roots and fifths stay strong over a power chord.', ['Use downstrokes.', 'Keep hammer-ons loud.', 'Accent the highest note.', 'Add gain after it is clean.']),
  makeLick('rock-02', 'Amp Glow Hook', 'Rock', 'Intermediate', 'Anthemic', 118, '5', ['alternate picking'], 'E-shape', 'rockFall', 'A descending hook repeats familiar box tones and resolves like a riff ending.', ['Pick slowly first.', 'Relax string crossings.', 'Loop with a power chord.', 'Raise tempo by 5 bpm.']),
  makeLick('rock-03', 'Redline Bend', 'Rock', 'Advanced', 'Aggressive', 128, '5', ['bend', 'pull-off'], 'E-shape', 'rockFall', 'The opening peak supplies attitude before the pentatonic fall snaps back to the riff.', ['Check the bend.', 'Use a metronome.', 'Mute lower strings.', 'Finish with a downstroke.']),
  makeLick('rock-04', 'Backbeat Spark', 'Rock', 'Easy', 'Driving', 112, '5', ['hammer-on', 'palm mute'], 'A-shape', 'rockClimb', 'A tight cell climbs and snaps back, making a reusable rock response.', ['Palm mute lightly.', 'Accent beat two.', 'Keep it short.', 'Answer a rhythm riff.']),
  makeLick('rock-05', 'Stadium Step Down', 'Rock', 'Intermediate', 'Bold', 124, '5', ['alternate picking'], 'E-shape', 'rockFall', 'Wide-position notes make the line sound bigger while staying easy to hear.', ['Use alternate picking.', 'Let the first note ring.', 'Keep wrists loose.', 'End with authority.']),
  makeLick('rock-06', 'Fuse Box Run', 'Rock', 'Beginner', 'Punchy', 100, '5', ['hammer-on'], 'E-shape', 'rockClimb', 'The climb outlines root, flat third, fourth, and fifth for instant rock vocabulary.', ['Say the counts aloud.', 'Hammer from the fingertip.', 'Use bridge pickup.', 'Play after two bars of rhythm.']),
  makeLick('rock-07', 'Overdrive Reply', 'Rock', 'Easy', 'Confident', 116, '5', ['slide'], 'A-shape', 'rockFall', 'The slide gives the phrase motion before a strong power-chord landing.', ['Slide in time.', 'Do not over-ring notes.', 'Mute after the final note.', 'Move it to D and E.']),
  makeLick('rock-08', 'Rooftop Siren', 'Rock', 'Advanced', 'Urgent', 132, '5', ['bend', 'vibrato'], 'E-shape', 'rockFall', 'A vocal high point followed by a box descent creates a lead-guitar exclamation mark.', ['Warm up bends.', 'Keep vibrato in tempo.', 'Use short delay if available.', 'Practice at slow speed.']),
  makeLick('rock-09', 'Sidewalk Riff Tag', 'Rock', 'Intermediate', 'Gritty', 110, '5', ['pull-off'], 'E-shape', 'rockClimb', 'The tag connects riff rhythm to lead vocabulary without leaving the pentatonic area.', ['Palm mute first half.', 'Open up the ending.', 'Loop four times.', 'Change pickup positions.']),
  makeLick('rock-10', 'Signal Flare', 'Rock', 'Easy', 'Anthemic', 120, 'sus4', ['slide', 'alternate picking'], 'A-shape', 'rockFall', 'The fourth-to-root motion sounds suspended and anthemic over big chords.', ['Keep slides short.', 'Count steady eighths.', 'Try with chorus.', 'Resolve to the chord.']),

  makeLick('soul-01', 'Sunday Morning Thirds', 'Soulful Major', 'Beginner', 'Warm', 76, 'maj7', ['slide'], 'E-shape', 'majorSweet', 'Major thirds and sevenths make the lick sweet without sounding like an exercise.', ['Use clean tone.', 'Slide gently.', 'Let notes breathe.', 'Resolve softly.']),
  makeLick('soul-02', 'Window Seat Melody', 'Soulful Major', 'Intermediate', 'Reflective', 82, '6', ['hammer-on'], 'E-shape', 'majorSixth', 'The sixth adds R&B lift while the final root settles the phrase.', ['Sing it first.', 'Play legato.', 'Keep the peak warm.', 'Resolve lightly.']),
  makeLick('soul-03', 'Maple Street Glide', 'Soulful Major', 'Easy', 'Tender', 74, 'maj7', ['slide', 'vibrato'], 'E-shape', 'majorSweet', 'The sixth and major seventh add sweetness over a slow groove.', ['Use neck pickup.', 'Slide into the third.', 'Add small vibrato.', 'Play behind the beat.']),
  makeLick('soul-04', 'Late Train Resolve', 'Soulful Major', 'Intermediate', 'Hopeful', 80, '6', ['hammer-on'], 'A-shape', 'majorSixth', 'Chord tones frame the lick, so it sounds melodic instead of scalar.', ['Hum the rhythm.', 'Keep dynamics even.', 'Do not rush.', 'Land softly.']),
  makeLick('soul-05', 'Gold Thread Resolve', 'Soulful Major', 'Advanced', 'Shimmering', 70, 'maj9', ['slide', 'legato'], 'E-shape', 'majorSweet', 'A ninth-color feel appears because the melody floats above stable chord tones.', ['Use warm clean tone.', 'Connect notes smoothly.', 'Let the top note sing.', 'Practice over a drone.']),
  makeLick('soul-06', 'Velvet Step', 'Soulful Major', 'Beginner', 'Warm', 78, '6', ['hammer-on'], 'E-shape', 'majorSixth', 'Simple major-pentatonic motion creates a vocal answer for ballads.', ['Play with fingers.', 'Keep it quiet.', 'Delay the last note.', 'Repeat in C and G.']),
  makeLick('soul-07', 'Cafe Window', 'Soulful Major', 'Easy', 'Reflective', 84, 'maj7', ['slide'], 'A-shape', 'majorSweet', 'Sliding into the third immediately identifies the major chord quality.', ['Slide from one fret below.', 'Use light vibrato.', 'Leave a rest.', 'Answer with a chord.']),
  makeLick('soul-08', 'Honeycomb Fall', 'Soulful Major', 'Intermediate', 'Tender', 88, '6', ['pull-off'], 'E-shape', 'majorSixth', 'The descending shape sounds like a sung phrase because it resolves by step.', ['Pull off gently.', 'Keep tempo steady.', 'Try fingerstyle.', 'Resolve to the root.']),
  makeLick('soul-09', 'Blue Sky Lift', 'Soulful Major', 'Advanced', 'Hopeful', 92, 'maj9', ['slide', 'vibrato'], 'A-shape', 'majorSweet', 'The lift toward upper chord tones creates gospel-like brightness.', ['Start quiet.', 'Crescendo upward.', 'Slow vibrato only.', 'Move it to D.']),
  makeLick('soul-10', 'Lamplight Answer', 'Soulful Major', 'Easy', 'Shimmering', 72, 'maj7', ['legato'], 'E-shape', 'majorSixth', 'Legato phrasing softens the attack and lets the major harmony speak.', ['Use minimal pick.', 'Connect every note.', 'Hold the final pitch.', 'Practice full speed last.']),

  makeLick('country-01', 'Fence Post Pickup', 'Country-ish', 'Beginner', 'Bright', 96, '', ['hybrid picking', 'hammer-on'], 'E-shape', 'countrySnap', 'Major-pentatonic snap gives a bright country vocabulary without needing speed.', ['Try hybrid picking.', 'Snap lightly.', 'Keep open space.', 'End cleanly.']),
  makeLick('country-02', 'Dusty Double-Stop', 'Country-ish', 'Intermediate', 'Bouncy', 108, '', ['double-stop'], 'A-shape', 'countrySkip', 'Double-stop flavor and a major-pentatonic tag clearly state the chord.', ['Pinch two strings.', 'Keep it short.', 'Do not overbend.', 'Land in time.']),
  makeLick('country-03', 'Pickup Truck Chime', 'Country-ish', 'Advanced', 'Snappy', 116, '', ['hybrid picking', 'string skip'], 'E-shape', 'countrySkip', 'The string skip sounds like a country chime before spelling the major pentatonic.', ['Practice the skip alone.', 'Use pick and fingers.', 'Keep hammer-ons bright.', 'Loop slowly.']),
  makeLick('country-04', 'Front Porch Snap', 'Country-ish', 'Easy', 'Cheerful', 100, '', ['slide', 'pull-off'], 'E-shape', 'countrySnap', 'A quick pull-off and slide create friendly country-pop motion.', ['Pick near bridge.', 'Keep pull-off light.', 'Smile the rhythm.', 'Resolve clearly.']),
  makeLick('country-05', 'Barn Light Tag', 'Country-ish', 'Intermediate', 'Snappy', 112, '', ['hammer-on', 'string skip'], 'A-shape', 'countrySkip', 'The high-string skip and quick hammer-on outline major pentatonic with sparkle.', ['Pick top note firmly.', 'Keep skip clean.', 'Snap in time.', 'Use a clean amp.']),
  makeLick('country-06', 'Chicken Wire Pop', 'Country-ish', 'Advanced', 'Bright', 122, '6', ['hybrid picking', 'double-stop'], 'E-shape', 'countrySnap', 'Popped attacks make the major sixth sound twangy and rhythmically alive.', ['Mute between pops.', 'Use middle finger plucks.', 'Keep wrist loose.', 'Slow down first.']),
  makeLick('country-07', 'Hayfield Roll', 'Country-ish', 'Beginner', 'Bouncy', 94, '', ['hammer-on'], 'E-shape', 'countrySnap', 'A short rolling phrase sits easily in the major pentatonic box.', ['Count out loud.', 'Hammer evenly.', 'Use a clean tone.', 'Repeat through keys.']),
  makeLick('country-08', 'Silver Buckle Run', 'Country-ish', 'Easy', 'Cheerful', 104, '', ['slide', 'hybrid picking'], 'A-shape', 'countrySkip', 'The slide and skip combine chicken-pickin attitude with a playable position.', ['Slide crisply.', 'Pop the B string.', 'Keep notes short.', 'End on the root.']),
  makeLick('country-09', 'Two-Lane Twang', 'Country-ish', 'Intermediate', 'Snappy', 118, '', ['pull-off', 'double-stop'], 'E-shape', 'countrySnap', 'Short double-stop movement makes the lick work as a fill between vocal lines.', ['Use staccato attack.', 'Pull off down.', 'Leave room after it.', 'Try in G.']),
  makeLick('country-10', 'County Fair Tag', 'Country-ish', 'Advanced', 'Bouncy', 126, '6', ['hybrid picking', 'string skip'], 'A-shape', 'countrySkip', 'Fast major-pentatonic skips create excitement while still outlining the chord.', ['Practice at slow speed.', 'Alternate pick and finger.', 'Stay relaxed.', 'Only speed up clean reps.']),
];
