// First, we import helper libraries to ensure correct polyfills applied
import "core-js/stable";
import "regenerator-runtime/runtime";

import RouteRecognizer from "route-recognizer"; // Allows us to create routes for the plugin
import { Route } from "route-recognizer/dist/route-recognizer/dsl"; // Route type

// Next, we import relevant utilities from the plugin library
import * as octant from "@project-octant/plugin"; // Interfaces, interact with Octant
import * as h from "@project-octant/plugin/helpers"; // Helpers, make objects for Octant to render

// Plugin library components that will be displayed in Octant
import { Component } from "@project-octant/plugin/components/component";
import { TextFactory } from "@project-octant/plugin/components/text";
import { ButtonFactory, ButtonConfig } from "@project-octant/plugin/components/button"
import { ButtonGroupFactory } from "@project-octant/plugin/components/button-group";

// Once we have the relevant imports, we can create some routes to interact with the plugin
// In plugins larger than a single file, this is typically configured in `routes.ts`
const router = new RouteRecognizer(); // Initiate plugin router

// First, we specify a default route:
const defaultRoute: Route = {
  path: "/alert-sample", // Our plugin will be accessible at `/alert-sample` when visiting Octant
  handler: alertHandler, // When this route is visited, call `alertHandler` (defined later in file)
  // `alertHandler` will tell Octant how to render the plugin
};
router.add([defaultRoute], { as: "default" }); // And then add it to the router

// Then, let's add some dynamic routes, which will allow us to pass in parameters
const dynamicRoute: Route = {
  path: "alert/:alertName", // Later, we can use the value of `alertName` 
  handler: alertHandler, // For this example, we'll use the same handler
};
router.add([dynamicRoute]); // Added to the router as well

// Finally, we add a route that handles invalid routes
const notFoundRoute: Route = {
  path: "/not-found", // Users will be redirected to `/not-found`
  handler: notFoundHandler,
};
router.add([notFoundRoute], { as: "notFound" });

// Now that we have routes, we can add their handlers
function alertHandler(this: any, params: any): octant.ContentResponse {
  const routeName = params.alertName || "Home"; // Readable text to be displayed in the plugin
  
  // We build the page title using plugin text components
  const title = new TextFactory({ value: `Alert Sample (${routeName})` });

  // 4 types of alerts - https://github.com/vmware-tanzu/octant/blob/master/pkg/action/manager.go
  const alertTypes: String[] = [
    "INFO",
    "ERROR",
    "WARNING",
    "SUCCESS",
  ];

  // Then, we create a button component for each alert type
  const alertButtons = alertTypes.map(type => new ButtonFactory({
    name: `Alert - ${type}`,
    // When the button is clicked, it will send a request to the plugin
    // Thus, we specify the parameters we need here
    payload: {
      // `action` is an Octant Action - we must redefine this later
      // This allows us to identify specifically that the button was clicked
      action: "alert-sample.octant.dev/alert",
      type, // So that the alert knows which type it should be
      routeName, // Now accessible for our plugin
    },
  }).toComponent());

  const buttonGroup = new ButtonGroupFactory({
    buttons: alertButtons,
  });
  // Last step: invoke helper function to render newly-created components on page
  return h.createContentResponse([title], [buttonGroup]);
}

// We do something similar for the invalid route handler
function notFoundHandler(this: any, param: any): octant.ContentResponse {
  const title = [
    new TextFactory({ value: "alert-sample" }),
    new TextFactory({ value: "Not found" }),
  ];
  const text = new TextFactory({ value: "Not Found." });
  return h.createContentResponse(title, [text]);
}

// We're now ready to create the plugin object itself!
const AlertSample: octant.PluginConstructor = class AlertSample implements octant.Plugin {
  // First, specify some static properties used by Octant
  name = "alert-sample";
  description = "Sample plugin demonstrating alert capabilities";
  isModule = true; // This tells Octant to call `navigationHandler()` and `contentHandler()`

  // We tell Octant about the general funcitons of the plugin
  capabilities = {
    actionNames: [
      "alert-sample.octant.dev/alert", // The action triggered by the alert button
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
    // with name "Alert Sample", route `alert-sample`, and a bell icon
    const nav = new h.Navigation("Alert Sample", "alert-sample", "bell");
    // Then, to demonstrate the dynamic route capabilities, let's add two of them to the nav:
    nav.add("Alert Sample A", "alert/A");
    nav.add("Alert Sample B", "alert/B");
    return nav;
  }

  // Here, we monitor all incoming actions
  actionHandler(request: octant.ActionRequest): octant.ActionResponse | void {
    // Check to see if the action name corresponds with the one associated with the button click
    if (request.actionName === "alert-sample.octant.dev/alert") {
      // For TypeScript plugins, alerts are sent by calling `dashboardClient.SendEvent()`
      // To tell Octant that we're sending an alert, our `eventType` is `event.octant.dev/alert`
      this.dashboardClient.SendEvent(request.clientState.clientID(), "event.octant.dev/alert", {
        type: request.payload.type, // Depending on which button was clicked
        message: `Alert sent from route ${request.payload.routeName}`, // Message in alert
        expiration: 1 // Time that the alert is active (need units!)
      });
      return;
    }
    return;
  }

  // When content is requested, this calls a plugin helper function to display it
  contentHandler(request: octant.ContentRequest): octant.ContentResponse {
    return h.contentResponseFromRouter(this, router, request);
  }
}

export default AlertSample;

console.log("loading alert-sample.ts");
