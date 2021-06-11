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
import { ButtonFactory } from "@project-octant/plugin/components/button"
import { ButtonGroupFactory } from "@project-octant/plugin/components/button-group";

// Once we have the relevant imports, we can create some routes to interact with the plugin
// In plugins larger than a single file, this is typically configured in `routes.ts`
const router = new RouteRecognizer(); // Initiate plugin router

// We define an action for frontend-backend communication (useful later)
const action = "actions-sample.octant.dev/action"

// First, we specify a default route:
const defaultRoute: Route = {
  path: "/actions-sample", // Plugin located at `/actions-sample` when visiting Octant
  handler: actionsHandler, // When route visited, call `actionsHandler` (defined later in file)
  // `actionsHandler` will tell Octant how to render the plugin
};
router.add([defaultRoute], { as: "default" }); // And then add it to the router

// Then, let's add some dynamic routes, which will allow us to pass in parameters
const dynamicRoute: Route = {
  path: "action/:actionName", // Later, we can use the value of `actionName` 
  handler: actionsHandler, // For this example, we'll use the same handler
};
router.add([dynamicRoute]); // Added to the router as well

// Finally, we add a route that handles invalid routes
const notFoundRoute: Route = {
  path: "/not-found", // Users will be redirected to `/not-found`
  handler: notFoundHandler,
};
router.add([notFoundRoute], { as: "notFound" });

// Now that we have routes, we can add their handlers
function actionsHandler(this: any, params: any): octant.ContentResponse {
  const routeName = params.actionName ?? "Home"; // Readable text to be displayed in the plugin

  const currentNumber = this.numbers[routeName] ?? DEFAULT_NUMBER;
  
  // We build the page title using plugin text components
  const title = new TextFactory({ value: `Actions Sample (${routeName}): ${currentNumber}` });

  const description = new TextFactory({ value: "Update the number with the buttons!"});

  const operationButtons = new ButtonGroupFactory({
    buttons: [
      new ButtonFactory({
        name: "Add 5",
        payload: {
          action,
          routeName,
          operation: "add",
          amount: 5,
        },
      }).toComponent(),
      new ButtonFactory({
        name: "Double",
        payload: {
          action,
          routeName,
          operation: "multiply",
          amount: 2
        },
      }).toComponent(),
    ],
  });

  // Last step: invoke helper function to render newly-created components on page
  return h.createContentResponse([title], [description], operationButtons);
}

// We do something similar for the invalid route handler
function notFoundHandler(this: any, param: any): octant.ContentResponse {
  const title = [
    new TextFactory({ value: "actions-sample" }),
    new TextFactory({ value: "Not found" }),
  ];
  const text = new TextFactory({ value: "Not Found." });
  return h.createContentResponse(title, [text]);
}

const DEFAULT_NUMBER = 5

// We're now ready to create the plugin object itself!
const ActionsSample: octant.PluginConstructor = class ActionsSample implements octant.Plugin {
  // First, specify some static properties used by Octant
  name = "actions-sample";
  description = "Sample plugin demonstrating action capabilities";
  isModule = true; // This tells Octant to call `navigationHandler()` and `contentHandler()`

  // We tell Octant about the general funcitons of the plugin
  capabilities = {
    actionNames: [
      action, // The action triggered by the alert button
      "action.octant.dev/setNamespace", // Triggered by default in plugins
    ],
  };

  numbers: { [name: string]: number } = {
    "Home": DEFAULT_NUMBER,
    "A": DEFAULT_NUMBER * 3,
    "B": DEFAULT_NUMBER * 5
  }

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
    // with name "Actions Sample", route `actions-sample`, and a bell icon
    const nav = new h.Navigation("Actions Sample", "actions-sample", "airplane");
    // Then, to demonstrate the dynamic route capabilities, let's add two of them to the nav:
    nav.add("Actions Sample A", "action/A");
    nav.add("Actions Sample B", "action/B");
    return nav;
  }

  // Here, we monitor all incoming actions
  actionHandler(request: octant.ActionRequest): octant.ActionResponse | void {
    // Check to see if the action name corresponds with the one associated with the button click
    if (request.actionName === action) {
      // For TypeScript plugins, alerts are sent by calling `dashboardClient.SendEvent()`
      
      const { routeName, operation, amount } = request.payload;
      let base = this.numbers[routeName] ?? DEFAULT_NUMBER;

      if (operation === "add") {
        base += amount;
      } else if (operation === "multiply") {
        base *= amount;
      }

      this.numbers[routeName] = base;

      // this.dashboardClient.SendEvent(request.clientState.clientID(), "event.octant.dev/alert", {
      //   type: "SUCCESS", // Depending on which button was clicked
      //   message: `Alert sent from route ${request.payload.routeName}`, // Message in alert
      //   expiration: 1 // Time that the alert is active (need units!)
      // });
      return;
    }
    return;
  }

  // When content is requested, this calls a plugin helper function to display it
  contentHandler(request: octant.ContentRequest): octant.ContentResponse {
    return h.contentResponseFromRouter(this, router, request);
  }
}

export default ActionsSample;

console.log("loading actions-sample.ts");
