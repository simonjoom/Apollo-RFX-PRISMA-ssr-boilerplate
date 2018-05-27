

<a href="https://codesandbox.io/s/github/faceyspacey/redux-first-router-codesandbox" target="_blank">
  <img alt="Edit Redux-First Router Demo" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>


# Universal Boilerplate [Apollo-RFX-PRISMA-ssr-boilerplate](https://github.com/simonjoom/Apollo-RFX-PRISMA-ssr-boilerplate)

![redux-first-router-demo screenshot](./screenshot.png) 
 A lot more features and use-cases are covered there, but this *boilerplate* is the best place to start to learn the basics of RFR,
  especially if you're new to any of these things: SSR, Code Splitting, Express, APIs, Webpack-4 and Redux in general.


## Installation

```
git clone https://github.com/simonjoom/Apollo-RFX-PRISMA-ssr-boilerplate
cd Apollo-RFX-PRISMA-ssr-boilerplate
npm install

;then start simply develop on:

npm run start
```


## Files You Should Look At:

*client code:*
- [***lib/***](./lib/) - ***(the source code of RFR)***
- [***webpack/***](./webpack/) - ***the webpack-4 configuration***
- [***src/configureStore.js***](./src/configureStore.js)
- [***src/routes.js***](./src/routesMap.js) - ***(the primary work of RFR)***
- [***src/components/Switcher.js***](./src/components/Switcher.js) - *(universal component concept)*
- [***src/components/Sidebar.js***](./src/components/Sidebar.js) - *(look at the different ways to link + dispatch URL-aware actions)*


*server code:*
- [***server/index.js***](./server/index.js)
- [***server/render.js***](./server/render.js) - *(super simple thanks to [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks) from our ***"Universal"*** product line)*
- [***server/configureStore.js***](./server/configureStore.js) - ***(observe how the matched route's thunk is awaited on)***


