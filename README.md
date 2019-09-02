# interactive-js-map

Interactive node link diagram browser for Javascript dependencies

## Setup

```bash
yarn install

# Development
yarn dev

# Publishing
yarn build
```

## Attributions

This project was made tractable by the shoulders of several community projects, including

- [`react-electron-boilerplate`](https://github.com/electron-react-boilerplate)
  - Changes:
    - I combined this with James Long's server with IPC example, which enables us to hot-patch the node server without restarting the electron process by refreshing its browser window.
    - Bumped to latest react/redux/react-redux/react-router/connected-react router
- Dependency parsing + formatting by `madge`
- `visjs` and/or `cytoscape`
