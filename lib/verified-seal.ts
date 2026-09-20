/**
 * The verified seal's geometry, shared by the React badge and the standalone
 * SVG that schools embed on their own sites, so the two never drift apart.
 *
 * A 12-lobe scalloped disc on a 0 0 24 24 viewBox — our own path, not another
 * product's, in the site's blue rather than Instagram's lighter tone, which
 * loses contrast against cream.
 */
export const VERIFIED_BLUE = "#1F7AD6";

export const VERIFIED_SEAL_PATH =
  "M 12 1 Q 13.319 0.918 14.355 3.21 Q 16.399 1.743 17.5 2.474 Q 18.683 3.062 18.435 5.565 Q 20.938 5.317 21.526 6.5 Q 22.257 7.601 20.79 9.645 Q 23.082 10.681 23 12 Q 23.082 13.319 20.79 14.355 Q 22.257 16.399 21.526 17.5 Q 20.938 18.683 18.435 18.435 Q 18.683 20.938 17.5 21.526 Q 16.399 22.257 14.355 20.79 Q 13.319 23.082 12 23 Q 10.681 23.082 9.645 20.79 Q 7.601 22.257 6.5 21.526 Q 5.317 20.938 5.565 18.435 Q 3.062 18.683 2.474 17.5 Q 1.743 16.399 3.21 14.355 Q 0.918 13.319 1 12 Q 0.918 10.681 3.21 9.645 Q 1.743 7.601 2.474 6.5 Q 3.062 5.317 5.565 5.565 Q 5.317 3.062 6.5 2.474 Q 7.601 1.743 9.645 3.21 Q 10.681 0.918 12 1 Z";

/** The tick, sized to sit inside the seal above. */
export const VERIFIED_TICK_PATH = "m7.7 12.25 2.75 2.75 5.85-5.85";
