// First, we import helper libraries to ensure correct polyfills applied
import "core-js/stable";
import "regenerator-runtime/runtime";

import RouteRecognizer from "route-recognizer"; // Allows us to create routes for the plugin
import { Route } from "route-recognizer/dist/route-recognizer/dsl"; // Route type

// Next, we import relevant utilities from the plugin library
import * as octant from "@project-octant/plugin"; // Interfaces, interact with Octant
import * as h from "@project-octant/plugin/helpers"; // Helpers, make objects for Octant to render

// Plugin library components that will be displayed in Octant
import { TextFactory } from "@project-octant/plugin/components/text";
import { ResourceViewerFactory, ResourceViewerOptions } from "@project-octant/plugin/components/resource-viewer"

import * as Resources from "./resources"

const resourceData: { [key: string]: ResourceViewerOptions }= Resources

// Once we have the relevant imports, we can create some routes to interact with the plugin
// In plugins larger than a single file, this is typically configured in `routes.ts`
const router = new RouteRecognizer(); // Initiate plugin router

// First, we specify a default route:
const defaultRoute: Route = {
  path: "/resource-viewer-sample", // Our plugin will be accessible at `/resource-viewer-sample` when visiting Octant
  handler: resourceHandler, // When this route is visited, call `resourceHandler` (defined later in file)
  // `resourceHandler` will tell Octant how to render the plugin
};
router.add([defaultRoute], { as: "default" }); // And then add it to the router

// Then, let's add some dynamic routes, which will allow us to pass in parameters
const dynamicRoute: Route = {
  path: "/:resourceName", // Later, we can use the value of `resourceName` 
  handler: resourceHandler, // For this example, we'll use the same handler
};
router.add([dynamicRoute]); // Added to the router as well

// Finally, we add a route that handles invalid routes
const notFoundRoute: Route = {
  path: "/not-found", // Users will be redirected to `/not-found`
  handler: notFoundHandler,
};
router.add([notFoundRoute], { as: "notFound" });

// Now that we have routes, we can add their handlers
// Since we are displaying the same content for each route, we just dynamically show resources
function resourceHandler(this: any, params: any): octant.ContentResponse {
  // Default/fallback in case main route path is visited
  const routeName: string = params.resourceName || "REAL_DATA_CRDS2";

  // Speficy data for resource viewer based on selected route
  const resourceViewOptions: ResourceViewerOptions = resourceData[routeName];
  const resourceViewParameters = {
    options: resourceViewOptions
  };
  
  // We build the page title using plugin text components
  const title = new TextFactory({ value: `Resource Sample (${routeName})` });


  // We add the resource viewer component
  const viewer = new ResourceViewerFactory(resourceViewParameters);

  // Last step: invoke helper function to render newly-created components on page
  return h.createContentResponse([title], [viewer]);
}

// We do something similar for the invalid route handler
function notFoundHandler(this: any, param: any): octant.ContentResponse {
  const title = [
    new TextFactory({ value: "resource-viewer-sample" }),
    new TextFactory({ value: "Not found" }),
  ];
  const text = new TextFactory({ value: "Not Found." });
  return h.createContentResponse(title, [text]);
}

// We're now ready to create the plugin object itself!
const ResourceViewerSample: octant.PluginConstructor = class ResourceViewerSample implements octant.Plugin {
  // First, specify some static properties used by Octant
  name = "resource-viewer-sample";
  description = "Sample plugin demonstrating resource viewer capabilities";
  isModule = true; // This tells Octant to call `navigationHandler()` and `contentHandler()`

  // We tell Octant about the general funcitons of the plugin
  capabilities = {
    actionNames: [
      "action.octant.dev/setNamespace", // Triggered by default in plugins
    ],
  };

  // Octant will assign these via the constructor at runtime
  dashboardClient: octant.DashboardClient;
  httpClient: octant.HTTPClient;

  // Octant expects plugin constructors to take two arguments, `dashboardClient` and `httpClient`
  constructor(dashboardClient: octant.DashboardClient, httpClient: octant.HTTPClient) {
    this.dashboardClient = dashboardClient;
    this.httpClient = httpClient;
  }

  // We previously created plugin routes; now, we can make them appear in the sidebar
  navigationHandler(): octant.Navigation {
    // Create a new navigation pane; the plugin will appear on the leftmost sidebar
    // with name "Resource Viewer Sample", route `resource-viewer-sample`, and a node icon
    const nav = new h.Navigation("Resource Viewer Sample", "resource-viewer-sample", "nodes");
    // Then, to demonstrate the dynamic route capabilities, let's add each view dynamically
    Object.keys(Resources).forEach(resource => {
      nav.add(resource, `/${resource}`)
    })
    return nav;
  }

  // When content is requested, this calls a plugin helper function to display it
  contentHandler(request: octant.ContentRequest): octant.ContentResponse {
    return h.contentResponseFromRouter(this, router, request);
  }
}

export default ResourceViewerSample;

console.log("loading resource-viewer-sample.ts");
