/*
Copyright (c) 2021 the Octant contributors. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"fmt"
	"github.com/vmware-tanzu/octant/pkg/action"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"log"

	"github.com/vmware-tanzu/octant/pkg/navigation"
	"github.com/vmware-tanzu/octant/pkg/plugin"
	"github.com/vmware-tanzu/octant/pkg/plugin/service"
	"github.com/vmware-tanzu/octant/pkg/view/component"
)

var pluginName = "module-sample"
const pluginActionName = "module-sample.octant.dev/alert"

func main() {
	// Remove the prefix from the go logger since Octant will print logs with timestamps.
	log.SetPrefix("")

	capabilities := &plugin.Capabilities{
		SupportsPrinterConfig: []schema.GroupVersionKind{},
		SupportsTab:           []schema.GroupVersionKind{},
		// Declare the action name here
		ActionNames:           []string{pluginActionName},
		IsModule:              true,
	}

	options := []service.PluginOption{
		service.WithNavigation(handleNavigation, initRoutes),
		service.WithActionHandler(handleAction),
	}

	p, err := service.Register(pluginName, "a description", capabilities, options...)
	if err != nil {
		log.Fatal(err)
	}

	p.Serve()
}

func handleNavigation(request *service.NavigationRequest) (navigation.Navigation, error) {
	return navigation.Navigation{
		Title: "Alert API Sample",
		Path:  request.GeneratePath(),
		Children: []navigation.Navigation{
			{
				Title:    "Nested Once",
				Path:     request.GeneratePath("nested-once"),
				IconName: "folder",
				Children: []navigation.Navigation{},
			},
		},
		IconName: "cloud",
	}, nil
}


func handleAction(request *service.ActionRequest) error {
	actionValue, err := request.Payload.String("action")
	if err != nil {
		return err
	}

	if actionValue == pluginActionName {
		// Sending an alert needs a clientID from the request context
		alert := action.CreateAlert(action.AlertTypeInfo, fmt.Sprintf("My client ID is: %s", request.ClientID), action.DefaultAlertExpiration)
		request.DashboardClient.SendAlert(request.Context(), request.ClientID, alert)
	}

	return nil
}

func initRoutes(router *service.Router) {
	gen := func(name, accessor, requestPath string) component.Component {
		cardBody := component.NewText(fmt.Sprintf("hello from plugin: path %s", requestPath))
		card := component.NewCard(component.TitleFromString(fmt.Sprintf("My Card - %s", name)))
		card.SetBody(cardBody)

		form := component.Form{Fields: []component.FormField{
			component.NewFormFieldHidden("action", pluginActionName),
		}}
		testButton := component.Action{
			Name:  "Test Button",
			Title: "Test Button",
			Form:  form,
		}
		card.AddAction(testButton)
		cardList := component.NewCardList(name)
		cardList.AddCard(*card)
		cardList.SetAccessor(accessor)

		return cardList
	}

	router.HandleFunc("*", func(request service.Request) (component.ContentResponse, error) {
		component1 := gen("Tab 1", "tab1", request.Path())

		contentResponse := component.NewContentResponse(component.TitleFromString("Example"))
		contentResponse.Add(component1)

		return *contentResponse, nil
	})
}
