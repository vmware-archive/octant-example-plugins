# Octant Plugins in TypeScript

Octant also supports plugins written in TypeScript. There are two Octant-supported tools that accelerate TypeScript plugin development:

* [`@project-octant/plugin`](https://github.com/vmware-tanzu/plugin-library-for-octant/tree/main/plugin): Plugin library for Octant plugins in TypeScript
* [`@project-octant/generator-octant-plugin`](https://github.com/vmware-tanzu/plugin-library-for-octant/tree/main/yeoman-generator): Yeoman quickstart generator for Octant plugins in TypeScript

## [Plugin](https://github.com/vmware-tanzu/plugin-library-for-octant/tree/main/plugin)

Many of the useful Octant UI components (think text boxes, tables, buttons, etc...) can be added to Octant plugins in TypeScript using the plugin library. Under the hood, the components are generated from Octant's internal (Golang) component files. Thus, for maximum compatibility, ensure that your Octant version and `@project-octant/plugin` version match.

## [Yeoman Generator](https://github.com/vmware-tanzu/plugin-library-for-octant/tree/main/yeoman-generator)

If you want to create an Octant plugin in TypeScript, this is the place to start. The generator will install all required dependencies, and set up some useful tooling such as hot-reloading. All example TypeScript plugins here were based off a plugin generated with the Yeoman generator.

# Example Plugins

All example plugins are modules, meaning that they support a built-in plugin sidebar, and can contain multiple custom routes. More plugins are always welcome, PRs encouraged! 

* [`actions-sample`](https://github.com/vmware-tanzu/octant-example-plugins/tree/master/typescript/actions-sample): Demonstrates Octant's Actions API to store and update stateful plugin data
* [`alert-sample`](https://github.com/vmware-tanzu/octant-example-plugins/tree/master/typescript/alert-sample): Demonstrates sending a banner alert to Octant using TypeScript
* [`resource-viewer-sample`](https://github.com/vmware-tanzu/octant-example-plugins/tree/master/typescript/resource-viewer-sample): Demonstrates passing custom data into Octant's resource viewer to create an interactive graph