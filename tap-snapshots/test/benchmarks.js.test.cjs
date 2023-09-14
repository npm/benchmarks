/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/benchmarks.js TAP all benchmarks > must match snapshot 1`] = `
Object {
  "single": Object {
    "cache-only": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "cache-only:peer-deps": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "clean": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "lock-only": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "modules-only": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-cache": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-clean": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-clean:audit": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-lock": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-modules": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "run-script": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "show-version": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
  },
}
`

exports[`test/benchmarks.js TAP all with graph > files 1`] = `
Object {
  "empty.svg": String(
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 175">
      <style>
        .font { font-family: sans-serif; }
        .s3 { font-size: 3px; }
        .s4 { font-size: 4px; }
        .s5 { font-size: 5px; }
        .line { stroke: #cacaca; }
        .width { stroke-width: 0.5; }
        .text { fill: #888; }
      </style>
      <rect x="0" y="0" width="WIDTH" height="175" fill="COLOR"></rect>
      <circle cx="44" cy="6" r="4" fill="COLOR"></circle>
      <text x="44" y="14" class="font s4" text-anchor="middle">npm</text>
      <text x="44" y="18" class="font s3" text-anchor="middle">X.Y.Z</text>
      <text x="40" y="28" class="font s5 text" text-anchor="middle">0</text>
      <text x="40" y="166" class="font s5 text" text-anchor="middle">0</text>
      <line x1="90" y1="31" x2="90" y2="161" class="line width"></line>
      <text x="90" y="28" class="font s5 text" text-anchor="middle">1</text>
      <text x="90" y="166" class="font s5 text" text-anchor="middle">1</text>
      <line x1="140" y1="31" x2="140" y2="161" class="line width"></line>
      <text x="140" y="28" class="font s5 text" text-anchor="middle">2</text>
      <text x="140" y="166" class="font s5 text" text-anchor="middle">2</text>
      <line x1="190" y1="31" x2="190" y2="161" class="line width"></line>
      <text x="190" y="28" class="font s5 text" text-anchor="middle">3</text>
      <text x="190" y="166" class="font s5 text" text-anchor="middle">3</text>
      <line x1="240" y1="31" x2="240" y2="161" class="line width"></line>
      <text x="240" y="28" class="font s5 text" text-anchor="middle">4</text>
      <text x="240" y="166" class="font s5 text" text-anchor="middle">4</text>
      <line x1="290" y1="31" x2="290" y2="161" class="line width"></line>
      <text x="290" y="28" class="font s5 text" text-anchor="middle">5</text>
      <text x="290" y="166" class="font s5 text" text-anchor="middle">5</text>
      <text x="290" y="20" class="font s4 text" font-style="italic" text-anchor="end">Installation time in seconds (lower is better)</text>
      <rect x="40" y="35" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="45.5" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="56" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="66.5" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="77" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="87.5" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="98" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="108.5" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="119" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="129.5" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="140" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <rect x="40" y="150.5" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
      <line x1="40" y1="31" x2="40" y2="161" class="line"></line>
      <text x="38" y="44.5" class="font s4" dominant-baseline="middle" text-anchor="end">clean</text>
      <text x="38" y="55" class="font s4" dominant-baseline="middle" text-anchor="end">lock-only</text>
      <text x="38" y="65.5" class="font s4" dominant-baseline="middle" text-anchor="end">cache-only</text>
      <text x="38" y="76" class="font s4" dominant-baseline="middle" text-anchor="end">modules-only</text>
      <text x="38" y="86.5" class="font s4" dominant-baseline="middle" text-anchor="end">no-lock</text>
      <text x="38" y="97" class="font s4" dominant-baseline="middle" text-anchor="end">no-cache</text>
      <text x="38" y="107.5" class="font s4" dominant-baseline="middle" text-anchor="end">no-modules</text>
      <text x="38" y="118" class="font s4" dominant-baseline="middle" text-anchor="end">no-clean</text>
      <text x="38" y="128.5" class="font s4" dominant-baseline="middle" text-anchor="end">show-version</text>
      <text x="38" y="139" class="font s4" dominant-baseline="middle" text-anchor="end">run-script</text>
      <text x="38" y="149.5" class="font s4" dominant-baseline="middle" text-anchor="end">cache-only w/ peer-deps</text>
      <text x="38" y="160" class="font s4" dominant-baseline="middle" text-anchor="end">no-clean w/ audit</text>
      <text x="290" y="173" class="font s4 text" text-anchor="end">Tests run with Node vVERSION</text>
    </svg>
  ),
}
`

exports[`test/benchmarks.js TAP all with graph > results 1`] = `
Object {
  "empty": Object {
    "cache-only": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "cache-only:peer-deps": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "clean": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "lock-only": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "modules-only": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-cache": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-clean": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-clean:audit": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-lock": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-modules": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "run-script": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "show-version": Object {
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
  },
}
`

exports[`test/benchmarks.js TAP errors with report/graph > must match snapshot 1`] = `
found 1 benchmarks with unexpected errors
- **error**: clean
<details><summary>timing results</summary>

|**error**|clean|
|---|---|
|yarn@latest|Error: Command failed|
|pnpm@latest|Error: Command failed|
</details>
`

exports[`test/benchmarks.js TAP errors with report/graph > must match snapshot 2`] = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 66">
  <style>
    .font { font-family: sans-serif; }
    .s3 { font-size: 3px; }
    .s4 { font-size: 4px; }
    .s5 { font-size: 5px; }
    .line { stroke: #cacaca; }
    .width { stroke-width: 0.5; }
    .text { fill: #888; }
  </style>
  <rect x="0" y="0" width="WIDTH" height="66" fill="COLOR"></rect>
  <circle cx="44" cy="6" r="4" fill="COLOR"></circle>
  <text x="44" y="14" class="font s4" text-anchor="middle">yarn</text>
  <text x="44" y="18" class="font s3" text-anchor="middle">X.Y.Z</text>
  <circle cx="60" cy="6" r="4" fill="COLOR"></circle>
  <text x="60" y="14" class="font s4" text-anchor="middle">pnpm</text>
  <text x="60" y="18" class="font s3" text-anchor="middle">X.Y.Z</text>
  <text x="NaN" y="28" class="font s5 text" text-anchor="middle">0</text>
  <text x="NaN" y="57" class="font s5 text" text-anchor="middle">0</text>
  <line x1="NaN" y1="31" x2="NaN" y2="52" class="line width"></line>
  <text x="NaN" y="28" class="font s5 text" text-anchor="middle">0</text>
  <text x="NaN" y="57" class="font s5 text" text-anchor="middle">0</text>
  <line x1="NaN" y1="31" x2="NaN" y2="52" class="line width"></line>
  <text x="NaN" y="28" class="font s5 text" text-anchor="middle">0</text>
  <text x="NaN" y="57" class="font s5 text" text-anchor="middle">0</text>
  <line x1="NaN" y1="31" x2="NaN" y2="52" class="line width"></line>
  <text x="NaN" y="28" class="font s5 text" text-anchor="middle">0</text>
  <text x="NaN" y="57" class="font s5 text" text-anchor="middle">0</text>
  <line x1="NaN" y1="31" x2="NaN" y2="52" class="line width"></line>
  <text x="NaN" y="28" class="font s5 text" text-anchor="middle">0</text>
  <text x="NaN" y="57" class="font s5 text" text-anchor="middle">0</text>
  <line x1="NaN" y1="31" x2="NaN" y2="52" class="line width"></line>
  <text x="NaN" y="28" class="font s5 text" text-anchor="middle">0</text>
  <text x="NaN" y="57" class="font s5 text" text-anchor="middle">0</text>
  <text x="290" y="20" class="font s4 text" font-style="italic" text-anchor="end">Installation time in seconds (lower is better)</text>
  <line x1="NaN" y1="31" x2="NaN" y2="52" class="line"></line>
  <text x="38" y="44.5" class="font s4" dominant-baseline="middle" text-anchor="end">clean</text>
  <text x="290" y="64" class="font s4 text" text-anchor="end">Tests run with Node vVERSION</text>
</svg>
`

exports[`test/benchmarks.js TAP npm 6 vs latest > must match snapshot 1`] = `
Object {
  "empty": Object {
    "cache-only:peer-deps": Object {
      "npm_6": null,
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "clean": Object {
      "npm_6": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
    "no-clean:audit": Object {
      "npm_6": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
  },
}
`

exports[`test/benchmarks.js TAP npm 6 vs latest > must match snapshot 2`] = `
undefined
`

exports[`test/benchmarks.js TAP npm 6 vs latest > must match snapshot 3`] = `
undefined
`

exports[`test/benchmarks.js TAP npm 9 vs latest > must match snapshot 1`] = `
Object {
  "empty": Object {
    "clean": Object {
      "npm_9": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
      "npm_latest": Object {
        "mean": TIME.MS,
        "stddev": TIME.MS,
        "times": Array [
          TIME.MS,
          TIME.MS,
        ],
      },
    },
  },
}
`

exports[`test/benchmarks.js TAP npm 9 vs latest > must match snapshot 2`] = `
no statistically significant performance changes detected
<details><summary>timing results</summary>

|**empty**|clean|
|---|---|
|npm@9|TIME.MS ±STD_DEV|
|npm@latest|TIME.MS ±STD_DEV|
</details>
`

exports[`test/benchmarks.js TAP npm 9 vs latest > must match snapshot 3`] = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 66">
  <style>
    .font { font-family: sans-serif; }
    .s3 { font-size: 3px; }
    .s4 { font-size: 4px; }
    .s5 { font-size: 5px; }
    .line { stroke: #cacaca; }
    .width { stroke-width: 0.5; }
    .text { fill: #888; }
  </style>
  <rect x="0" y="0" width="WIDTH" height="66" fill="COLOR"></rect>
  <circle cx="44" cy="6" r="4" fill="COLOR"></circle>
  <text x="44" y="14" class="font s4" text-anchor="middle">npm</text>
  <text x="44" y="18" class="font s3" text-anchor="middle">X.Y.Z</text>
  <circle cx="60" cy="6" r="4" fill="COLOR"></circle>
  <text x="60" y="14" class="font s4" text-anchor="middle">npm</text>
  <text x="60" y="18" class="font s3" text-anchor="middle">X.Y.Z</text>
  <text x="40" y="28" class="font s5 text" text-anchor="middle">0</text>
  <text x="40" y="57" class="font s5 text" text-anchor="middle">0</text>
  <line x1="90" y1="31" x2="90" y2="52" class="line width"></line>
  <text x="90" y="28" class="font s5 text" text-anchor="middle">1</text>
  <text x="90" y="57" class="font s5 text" text-anchor="middle">1</text>
  <line x1="140" y1="31" x2="140" y2="52" class="line width"></line>
  <text x="140" y="28" class="font s5 text" text-anchor="middle">2</text>
  <text x="140" y="57" class="font s5 text" text-anchor="middle">2</text>
  <line x1="190" y1="31" x2="190" y2="52" class="line width"></line>
  <text x="190" y="28" class="font s5 text" text-anchor="middle">3</text>
  <text x="190" y="57" class="font s5 text" text-anchor="middle">3</text>
  <line x1="240" y1="31" x2="240" y2="52" class="line width"></line>
  <text x="240" y="28" class="font s5 text" text-anchor="middle">4</text>
  <text x="240" y="57" class="font s5 text" text-anchor="middle">4</text>
  <line x1="290" y1="31" x2="290" y2="52" class="line width"></line>
  <text x="290" y="28" class="font s5 text" text-anchor="middle">5</text>
  <text x="290" y="57" class="font s5 text" text-anchor="middle">5</text>
  <text x="290" y="20" class="font s4 text" font-style="italic" text-anchor="end">Installation time in seconds (lower is better)</text>
  <rect x="40" y="35" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
  <rect x="40" y="41.5" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
  <line x1="40" y1="31" x2="40" y2="52" class="line"></line>
  <text x="38" y="44.5" class="font s4" dominant-baseline="middle" text-anchor="end">clean</text>
  <text x="290" y="64" class="font s4 text" text-anchor="end">Tests run with Node vVERSION</text>
</svg>
`

exports[`test/benchmarks.js TAP unsupported flags > must match snapshot 1`] = `
no statistically significant performance changes detected
<details><summary>timing results</summary>

|**empty**|cache-only<br/>peer-deps|no-clean<br/>audit|
|---|---|---|
|yarn@latest|Not Supported|TIME.MS ±STD_DEV|
|pnpm@latest|Not Supported|Not Supported|
</details>
`

exports[`test/benchmarks.js TAP unsupported flags > must match snapshot 2`] = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 83">
  <style>
    .font { font-family: sans-serif; }
    .s3 { font-size: 3px; }
    .s4 { font-size: 4px; }
    .s5 { font-size: 5px; }
    .line { stroke: #cacaca; }
    .width { stroke-width: 0.5; }
    .text { fill: #888; }
  </style>
  <rect x="0" y="0" width="WIDTH" height="83" fill="COLOR"></rect>
  <circle cx="44" cy="6" r="4" fill="COLOR"></circle>
  <text x="44" y="14" class="font s4" text-anchor="middle">yarn</text>
  <text x="44" y="18" class="font s3" text-anchor="middle">X.Y.Z</text>
  <circle cx="60" cy="6" r="4" fill="COLOR"></circle>
  <text x="60" y="14" class="font s4" text-anchor="middle">pnpm</text>
  <text x="60" y="18" class="font s3" text-anchor="middle">X.Y.Z</text>
  <text x="40" y="28" class="font s5 text" text-anchor="middle">0</text>
  <text x="40" y="74" class="font s5 text" text-anchor="middle">0</text>
  <line x1="90" y1="31" x2="90" y2="69" class="line width"></line>
  <text x="90" y="28" class="font s5 text" text-anchor="middle">1</text>
  <text x="90" y="74" class="font s5 text" text-anchor="middle">1</text>
  <line x1="140" y1="31" x2="140" y2="69" class="line width"></line>
  <text x="140" y="28" class="font s5 text" text-anchor="middle">2</text>
  <text x="140" y="74" class="font s5 text" text-anchor="middle">2</text>
  <line x1="190" y1="31" x2="190" y2="69" class="line width"></line>
  <text x="190" y="28" class="font s5 text" text-anchor="middle">3</text>
  <text x="190" y="74" class="font s5 text" text-anchor="middle">3</text>
  <line x1="240" y1="31" x2="240" y2="69" class="line width"></line>
  <text x="240" y="28" class="font s5 text" text-anchor="middle">4</text>
  <text x="240" y="74" class="font s5 text" text-anchor="middle">4</text>
  <line x1="290" y1="31" x2="290" y2="69" class="line width"></line>
  <text x="290" y="28" class="font s5 text" text-anchor="middle">5</text>
  <text x="290" y="74" class="font s5 text" text-anchor="middle">5</text>
  <text x="290" y="20" class="font s4 text" font-style="italic" text-anchor="end">Installation time in seconds (lower is better)</text>
  <rect x="40" y="52" width="WIDTH" height="6" fill="COLOR" rx="1" ry="1"></rect>
  <line x1="40" y1="31" x2="40" y2="69" class="line"></line>
  <text x="38" y="44.5" class="font s4" dominant-baseline="middle" text-anchor="end">cache-only w/ peer-deps</text>
  <text x="38" y="61.5" class="font s4" dominant-baseline="middle" text-anchor="end">no-clean w/ audit</text>
  <text x="290" y="81" class="font s4 text" text-anchor="end">Tests run with Node vVERSION</text>
</svg>
`
