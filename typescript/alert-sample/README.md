<img width="1155" alt="Screen Shot 2021-07-21 at 3 44 32 PM" src="https://user-images.githubusercontent.com/33555592/126551400-d309f31f-1687-4966-87f4-47d02f898eba.png">

# alert-sample

Octant supports multiple alert types; this example plugin demonstrates how to display each variant, using Octant's Actions API. 

# Installation

1. Open the `alert-sample` directory in your terminal of choice
2. Install dependencies by running `npm install`
3. Run the plugin in hot-reload mode with `npm run plugin:watch`

This example assumes that Octant plugins are stored in `~/.config/octant/plugins/`; if your Octant instance is looking for plugins elsewhere, make sure to update the following commands in `package.json`:

* `plugin:dev-no-check`
* `plugin:dev`
* `plugin:install`
