<img width="1155" alt="Screen Shot 2021-07-21 at 3 44 12 PM" src="https://user-images.githubusercontent.com/33555592/126551484-5c74bc83-d045-47a7-8a57-f15f26830f12.png">

# resource-viewer-sample

Octant features a custom resource viewer that can display custom values passed in by plugins; this example demonstrates how example resource viewer data ([from the Octant reference](https://reference.octant.dev/?path=/story/other-resources--graph-story)) can be passed into Octant's resource viewer.

# Installation

1. Open the `resource-viewer-sample` directory in your terminal of choice
2. Install dependencies by running `npm install`
3. Run the plugin in hot-reload mode with `npm run plugin:watch`

This example assumes that Octant plugins are stored in `~/.config/octant/plugins/`; if your Octant instance is looking for plugins elsewhere, make sure to update the following commands in `package.json`:

* `plugin:dev-no-check`
* `plugin:dev`
* `plugin:install`
