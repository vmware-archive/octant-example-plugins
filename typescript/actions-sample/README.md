![Screen Shot 2021-06-04 at 5 43 57 PM](https://user-images.githubusercontent.com/33555592/120865681-812ff900-c55c-11eb-96b8-4f51459c5587.png)

# actions-sample

Octant supports multiple alert types; this example plugin demonstrates how to display each variant, using Octant's Actions API. 

# Installation

1. Open the `actions-sample` directory in your terminal of choice
2. Install dependencies by running `npm install`
3. Run the plugin in hot-reload mode with `npm run plugin:watch`

This example assumes that Octant plugins are stored in `~/.config/octant/plugins/`; if your Octant instance is looking for plugins elsewhere, make sure to update the following commands in `package.json`:

* `plugin:dev-no-check`
* `plugin:dev`
* `plugin:install`
