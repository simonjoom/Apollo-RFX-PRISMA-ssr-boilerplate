# Universal Boilerplate [Apollo-RFX-PRISMA-ssr-boilerplate](https://github.com/simonjoom/Apollo-RFX-PRISMA-ssr-boilerplate)

## Inside
- ***Apollo 2.0*** with ***Prisma*** already setup (no need to make a prisma deploy or a prisma init the server take care)
- Socket apollo work and setting up
- Apollo Playground in [http://localhost:4000/playground/](http://localhost:4000/playground/)
- Redux integrated with Redux-first-router
- Code splitting with react-universal-component
- Webpack 4
- Babel 7.0 (latest)
- react-intl working (flags and language management)
- 'apollo-cache-redux' to use redux and apollo 2.0


<a href="https://codesandbox.io/s/github/faceyspacey/redux-first-router-codesandbox" target="_blank">
  <img alt="Edit Redux-First Router Demo" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>


![Apollo Universal Boilerplate screenshot](./screenshot.jpg) 
 A lot more features and use-cases are covered there, but this *boilerplate* is the best place to start to learn the basics of RFR,
  especially if you're new to any of these things: SSR, Code Splitting, Express, APIs, Webpack-4 and Redux in general.


##
The application run by default here:
[http://localhost:3000/](http://localhost:3000/)

## Installation

```
git clone https://github.com/simonjoom/Apollo-RFX-PRISMA-ssr-boilerplate
cd Apollo-RFX-PRISMA-ssr-boilerplate
npm install

;then start simply develop on:

npm run start
```

## ROADMAP
The repo is well tested in Developpment mode only first

I really need a good developper with PRISMA or graphql to work on:
- Login user for facebook and others
- Tchat implementation Backend
- Code optimization
- [***src/containers***](./src/containers) - ***(some containers to add into)***

Right now i use the store of Redux and apollo i want to use only the Apollo one .. 
I'm looking for the solution to delete apollo-cache-redux and these 2 providers:

```
  <Provider store={store}>
    <ApolloProvider client={client}>
```


## We use for faster build:
AutoDllPlugin /cache-loader /thread-loader
Please be sure to remove .cache-loader sometimes to check the working process

Font-awesome.scss is builded at first build (take long ) but after very fast developpement because cache-loader. 


## Files You Should Look At:

*client code:*
- [***lib***](./lib/index.js) - ***(the source code of RFR)***
- [***webpack***](./webpack/server.dev.js) - ***(the ssr webpack-4 configuration)***
- [***webpack***](./webpack/client.dev.js) - ***(the client webpack-4 configuration)***
- [***src/configureStore.js***](./src/configureStore.js)
- [***src/routes.js***](./src/routesMap.js) - ***(the primary work of RFR)***
- [***src/page***](./src/page) - ***(All your pages are here / each one seperated and splitted by react-universal)***
- [***src/components/Switcher.js***](./src/components/Switcher.js) - *(universal component concept)*
- [***src/components/Sidebar.js***](./src/components/Sidebar.js) - *(look at the different ways to link + dispatch URL-aware actions)*

*server code:*
- [***server/index.js***](./server/index.js)
- [***server/render.js***](./server/render.js) - *(super simple thanks to [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks) from our ***"Universal"*** product line)*
- [***server/configureStore.js***](./server/configureStore.js) - ***(observe how the matched route's thunk is awaited on)***


