/* eslint max-len: ["error", { "ignorePattern": "svg.push||<svg" }] */

const { getPkg } = require('./manager.js')
const { MANAGERS } = require('./options.js')

const NPM_COLOR = '#cd3731'
const YARN_COLOR = '#248ebd'
const PNPM_COLOR = '#fbae00'

const offset = {
  left: 40,
  right: 10,
  top: 35,
  bottom: 10,
}
const thickness = 6
const spacing = 0.5
const separation = 4
const styles = {
  font: '.font { font-family: sans-serif; }',
  s3: '.s3 { font-size: 3px; }',
  s4: '.s4 { font-size: 4px; }',
  s5: '.s5 { font-size: 5px; }',
  line: '.line { stroke: #cacaca; }',
  width: '.width { stroke-width: 0.5; }',
  text: '.text { fill: #888; }',
}

const getHighestMean = (result) => {
  let highest = 0
  for (const benchmark in result) {
    for (const manager in result[benchmark]) {
      const value = result[benchmark][manager]
      if (value && value.mean > highest) {
        highest = value.mean
      }
    }
  }

  return highest
}

const getManagers = (managerKeys) => {
  const usedColors = new Set()

  const managers = managerKeys.map((manager) => {
    const { name, version } = getPkg(manager)

    let color = {
      [MANAGERS.NPM]: NPM_COLOR,
      [MANAGERS.YARN]: YARN_COLOR,
      [MANAGERS.PNPM]: PNPM_COLOR,
    }[name]
    if (usedColors.has(color)) {
      color = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16)}`
    }
    usedColors.add(color)

    return {
      name,
      slug: manager,
      version: version.version,
      color,
    }
  })

  return managers
}

const generateGraph = (result) => {
  const benchmarks = Object.keys(result)
  const managers = getManagers(Object.keys(result[benchmarks[0]]))

  const graph = {
    x: offset.left,
    y: offset.top,
    w: 250,
    h: benchmarks.length * managers.length * (thickness + spacing) +
      (benchmarks.length - 1) * separation + separation * 2,
  }

  const vb = {
    x: 0,
    y: 0,
    w: graph.w + offset.left + offset.right,
    h: graph.h + offset.top + offset.bottom,
  }

  const max = getHighestMean(result)
  const limit = Math.ceil(max / 5) * 5
  const ratio = graph.w / limit
  const graphLines = [
    graph.x + limit * ratio * 0,
    graph.x + limit * ratio * 0.2,
    graph.x + limit * ratio * 0.4,
    graph.x + limit * ratio * 0.6,
    graph.x + limit * ratio * 0.8,
    graph.x + limit * ratio * 1,
  ]

  // open tag and css
  const svg = [
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}">`,
    `  <style>`,
    ...Object.keys(styles).map(k => `    ${styles[k]}`),
    `  </style>`,
  ]

  // add white background
  svg.push(`  <rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" fill="${'#fff'}"></rect>`)

  // legend
  managers.forEach((pkg, index) => {
    const radius = 4
    const x = graph.x + radius + (radius * 4) * index
    const y = vb.y + radius + 2
    svg.push(`  <circle cx="${x}" cy="${y}" r="${radius}" fill="${pkg.color}"></circle>`)
    const anchor = 'middle'
    let textY = y + radius + 4
    svg.push(`  <text x="${x}" y="${textY}" class="font s4" text-anchor="${anchor}">${pkg.name}</text>`)
    textY += 4
    svg.push(`  <text x="${x}" y="${textY}" class="font s3" text-anchor="${anchor}">${pkg.version}</text>`)
  })

  // vertical timing lines
  let isBaseLine = true
  let baseGraphLine
  graphLines.forEach((graphLine, index) => {
    const compositeClass = isBaseLine ? 'line' : 'line width'
    const y1 = graph.y - separation
    const y2 = y1 + graph.h
    const line = `  <line x1="${graphLine}" y1="${y1}" x2="${graphLine}" y2="${y2}" class="${compositeClass}"></line>`
    if (isBaseLine) {
      isBaseLine = false
      baseGraphLine = line
    } else {
      svg.push(line)
    }

    const anchor = 'middle'
    const x = graphLine
    let y = graph.y - 7
    const number = limit * (index / (graphLines.length - 1))
    svg.push(`  <text x="${x}" y="${y}" class="font s5 text" text-anchor="${anchor}">${number}</text>`)

    y = y2 + 5
    svg.push(`  <text x="${x}" y="${y}" class="font s5 text" text-anchor="${anchor}">${number}</text>`)
  })

  svg.push(`  <text x="${graph.x + graph.w}" y="${graph.y - 15}" class="font s4 text" font-style="italic" text-anchor="end">Installation time in seconds (lower is better)</text>`)

  benchmarks.forEach((benchmark, indexB) => {
    managers.forEach((pkg, indexM) => {
      const value = result[benchmark][pkg.slug]
      if (value && !value.error) {
        const roundedCorners = 1
        const x = graph.x
        const y = graph.y + ((thickness + spacing) * indexM) +
          (((thickness + spacing) * managers.length + separation) * indexB)
        const length = Math.round(value.mean * ratio)
        svg.push(`  <rect x="${x}" y="${y}" width="${length}" height="${thickness}" fill="${pkg.color}" rx="${roundedCorners}" ry="${roundedCorners}"></rect>`)
      }
    })
  })

  svg.push(baseGraphLine)

  benchmarks.forEach((benchmark, index) => {
    const baseline = 'middle'
    const anchor = 'end'
    const x = graph.x - 2
    const y = graph.y +
      ((thickness + spacing) * managers.length + separation) * index +
      thickness + spacing + thickness / 2
    svg.push(`  <text x="${x}" y="${y}" class="font s4" dominant-baseline="${baseline}" text-anchor="${anchor}">${benchmark.replace(/:/g, ' w/ ')}</text>`)
  })

  svg.push(`  <text x="${graph.x + graph.w}" y="${vb.h - 2}" class="font s4 text" text-anchor="end">Tests run with Node ${process.version}</text>`)
  svg.push('</svg>')
  return svg.join('\n')
}

const generateGraphs = (results) => {
  const graphs = {}

  for (const fixture in results) {
    graphs[fixture] = generateGraph(results[fixture])
  }

  return graphs
}

module.exports = generateGraphs
