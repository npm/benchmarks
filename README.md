# benchmarks

Benchmark tooling for the `npm` cli

### Options:

##### `manager` (alias `-m`)

Type: `Array`

Options: `all`, `npm`, `yarn`, `pnpm` ...

List of package managers to benchmark (must be npm installable strings)

##### `fixture` (alias `-f`) 

Type: `Array`

Options: `all`, `angular-quickstart`, `app-large`, `app-medium`, `ember-quickstart`, `eslint-config`, `mixcreant`, `react-app`, `tsconfig`

List of fixtures to run the given benchmarks against

##### `benchmark` (alias `-b`) 

Type: `Array`

Options: `all`, `clean`, `lock-only`, `cache-only`, `modules-only`, `no-lock`, `no-cache`, `no-modules`, `no-clean`

List of benchmarks to run

##### `report` (alias `-r`) 

Type: `Boolean`

Generate a text report

##### `graph` (alias `-g`) 

Type: `Boolean`

Generate a svg graph

### Example usage:

```bash
./bin/benchmark.js -m all -b all -f app-large -g
```

<img src="https://user-images.githubusercontent.com/459713/105940574-a1d5c880-6029-11eb-8461-9b57bff84c08.png" alt="" width="100%">

**Note:** Graph generation pulled from [pnpm/benchmarks-of-javascript-package-managers](https://github.com/pnpm/benchmarks-of-javascript-package-managers)
