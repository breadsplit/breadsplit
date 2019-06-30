# 🌀 Testing

## One-time testing

### Unit test

```bash
npm test
```

### End-to-end test

Install the test suite

```bash
npm i -g cypress
```

Run the tests

```bash
npm run test:e2e
```

## Development testing

### Unit test

```bash
npm test:watch
```

### End-to-end test

You can run all at once

```bash
npm run cy:dev
```

or run server and tests separately

```bash
npm run dev
```

```bash
npm run cy:open
```

Documents refer to: <https://www.cypress.io/>
