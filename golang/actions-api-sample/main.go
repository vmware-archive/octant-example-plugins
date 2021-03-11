package main

import (
	"fmt"
	"github.com/vmware-tanzu/octant/pkg/action"
	"github.com/vmware-tanzu/octant/pkg/navigation"
	"github.com/vmware-tanzu/octant/pkg/plugin"
	"github.com/vmware-tanzu/octant/pkg/plugin/service"
	"github.com/vmware-tanzu/octant/pkg/view/component"
	"github.com/vmware-tanzu/octant/pkg/view/flexlayout"
	"log"
)

const pluginName = "action-api-sample"
const addIntAction = "actionPlugin/addInt"
const clearIntAction = "actionPlugin/clearInt"

// This is a sample plugin showing how to use actions with plugins.
func main() {
	localPlugin := newActionPlugin()

	// Remove the prefix from the go logger since Octant will print logs with timestamps.
	log.SetPrefix("")

	capabilities := &plugin.Capabilities{
		ActionNames: []string{addIntAction, clearIntAction},
		IsModule:    true,
	}

	// Set up what should happen when Octant calls this plugin.
	options := []service.PluginOption{
		service.WithActionHandler(localPlugin.actionHandler),
		service.WithNavigation(localPlugin.navHandler, localPlugin.initRoutes),
	}

	p, err := service.Register(pluginName, "a description", capabilities, options...)
	if err != nil {
		log.Fatal(err)
	}

	p.Serve()
}

// actionPlugin is an example of a plugin that registers navigation and action handlers
// and performs some action against a remote API.
type actionPlugin struct {
	store remoteAPI
}

func newActionPlugin() *actionPlugin {
	return &actionPlugin{
		store: remoteAPI{},
	}
}

func (a *actionPlugin) navHandler(request *service.NavigationRequest) (navigation.Navigation, error) {
	return navigation.Navigation{
		Title:    "Action Plugin",
		Path:     request.GeneratePath(),
		IconName: "cloud",
	}, nil
}

func (a *actionPlugin) routeHandler(request service.Request) (component.ContentResponse, error) {
	card := component.NewCard(component.TitleFromString("Actions Example"))

	layout := flexlayout.New()

	var items []component.Component
	for _, n := range a.store.list() {
		items = append(items, component.NewText(fmt.Sprintf("%d", n)))
	}
	intList := component.NewList(component.TitleFromString("Remote API Objects"), items)
	card.SetBody(intList)

	form := component.Form{Fields: []component.FormField{
		component.NewFormFieldNumber("Number", "input", ""),
		component.NewFormFieldHidden("action", addIntAction),
	}}
	addInt := component.Action{
		Name:  "Add Int",
		Title: "Add Int to Remote API",
		Form:  form,
	}
	card.AddAction(addInt)

	listSection := layout.AddSection()
	err := listSection.Add(card, component.WidthFull)
	if err != nil {
		return component.ContentResponse{}, fmt.Errorf("error adding card to section: %w", err)
	}

	buttonGroup := component.NewButtonGroup()
	clearButton := component.NewButton("Clear", action.Payload{"action": clearIntAction})
	buttonGroup.AddButton(clearButton)

	flexComponent := layout.ToComponent("Remote API Listing")
	flexComponent.SetButtonGroup(buttonGroup)

	contentResponse := component.NewContentResponse(component.TitleFromString("Action Example"))
	contentResponse.Add(flexComponent)

	return *contentResponse, nil
}

func (a *actionPlugin) actionHandler(request *service.ActionRequest) error {
	actionName, err := request.Payload.String("action")
	if err != nil {
		return fmt.Errorf("unable to get input at string: %w", err)
	}

	switch actionName {
	case addIntAction:
		n, err := request.Payload.Uint16("input")
		if err != nil {
			return fmt.Errorf("unable to get input at int: %w", err)
		}
		a.store.add(n)
		return nil
	case clearIntAction:
		a.store.clear()
		return nil
	default:
		return fmt.Errorf("recieved action request for %s, but no handler defined", pluginName)
	}
}

func (a *actionPlugin) initRoutes(router *service.Router) {
	router.HandleFunc("*", a.routeHandler)
}
