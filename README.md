# hjkl Detox

A browser game for vim users who still get around with `hjkl`, `w`, `b`, `^`, `$`, `gg` and `G`. It teaches the motions that cover more ground per keystroke and scores you against the shortest possible key sequence.

Play it at https://ar7ch.github.io/hjkl/

## How it works

The buffer holds real code (Go, Python, JavaScript). An orange cursor and a teal target sit somewhere in it, and you move the cursor with vim keys.

- **Start here** is a six-step tour of the screen and the basic idea.
- **Learn** mode covers one motion at a time. Each step shows the keys, and you must reach the target in that many keystrokes or fewer.
- **Practice** mode places free targets. A solver computes par, the fewest keystrokes that reach the target with the drill's motions. Press Tab for hints, from the kind of motion to use up to the full route drawn on the buffer.

Drills: words (`w b e ge W B E gE`), inside a line (`0 ^ $ f F t T ; ,`), lines (`{n}j {n}k {n}G gg G` with relative numbers), blocks (`{ } %`), and mixed, which adds search (`/ ? n N * #`).

Grey labels above the text show where each motion would land from the cursor. The bar under the buffer says what vim expects next after a partial command like `f` or `3`, and explains the last motion you made.

## Running locally

It is a single `index.html` with no build step. Open it in a browser.

Tests run the motion engine and solver in Node:

```sh
node --test
```

## Releasing

Push a tag such as `v1.0.0`. The release workflow runs the tests, creates a GitHub release with the page attached, and deploys it to GitHub Pages at https://ar7ch.github.io/hjkl-detox/. The `/hjkl/` path redirects there from the main site.

## Limits

- No operators (`d`, `c`, `y`), only motions.
- The whole file fits on screen, so `H M L` and `Ctrl-d`/`Ctrl-u` are not included.
- `%` does not skip brackets inside strings or comments.
- Par only uses the current drill's motions, counts up to 9 for word motions, and never `;`, `,` or search. Going outside that can beat par, which the log shows as under par.
