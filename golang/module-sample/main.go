/*
Copyright (c) 2021 the Octant contributors. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"fmt"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"log"

	"github.com/vmware-tanzu/octant/pkg/navigation"
	"github.com/vmware-tanzu/octant/pkg/plugin"
	"github.com/vmware-tanzu/octant/pkg/plugin/service"
	"github.com/vmware-tanzu/octant/pkg/view/component"
)

var pluginName = "module-sample"

// This is a sample plugin showing the features of Octant's plugin API.
func main() {
	// Remove the prefix from the go logger since Octant will print logs with timestamps.
	log.SetPrefix("")

	// Tell Octant to call this plugin when printing configuration or tabs for Pods
	capabilities := &plugin.Capabilities{
		SupportsPrinterConfig: []schema.GroupVersionKind{},
		SupportsTab:           []schema.GroupVersionKind{},
		IsModule:              true,
	}

	// Set up what should happen when Octant calls this plugin.
	options := []service.PluginOption{
		service.WithNavigation(handleNavigation, initRoutes),
	}

	// Use the plugin service helper to register this plugin.
	p, err := service.Register(pluginName, "a description", capabilities, options...)
	if err != nil {
		log.Fatal(err)
	}

	// The plugin can log and the log messages will show up in Octant.
	log.Printf("octant-sample-plugin is starting")
	p.Serve()
}

// handleNavigation creates a navigation tree for this plugin. Navigation is dynamic and will
// be called frequently from Octant. Navigation is a tree of `Navigation` structs.
// The plugin can use whatever paths it likes since these paths can be namespaced to the
// the plugin.
func handleNavigation(request *service.NavigationRequest) (navigation.Navigation, error) {
	return navigation.Navigation{
		Title: "Module Sample",
		Path:  request.GeneratePath(),
		Children: []navigation.Navigation{
			{
				Title:    "Nested Once",
				Path:     request.GeneratePath("nested-once"),
				IconName: "folder",
				Children: []navigation.Navigation{
					{
						Title:    "Nested Twice",
						Path:     request.GeneratePath("nested-once", "nested-twice"),
						IconName: "folder",
					},
				},
			},
		},
		IconName: "cloud",
	}, nil
}

// initRoutes routes for this plugin. In this example, there is a global catch all route
// that will return the content for every single path.
func initRoutes(router *service.Router) {
	gen := func(name, accessor, requestPath string) component.Component {
		cardBody := component.NewText(fmt.Sprintf("hello from plugin: path %s", requestPath))
		card := component.NewCard(component.TitleFromString(fmt.Sprintf("My Card - %s", name)))
		card.SetBody(cardBody)
		cardList := component.NewCardList(name)
		cardList.AddCard(*card)
		cardList.SetAccessor(accessor)

		return cardList
	}

	router.HandleFunc("*", func(request service.Request) (component.ContentResponse, error) {
		// For each page, generate two tabs with a some content.
		component1 := gen("Tab 1", "tab1", request.Path())
		component2 := gen("Tab 2", "tab2", request.Path())

		contentResponse := component.NewContentResponse(component.TitleFromString("Example"))
		contentResponse.Add(component1, component2)

		return *contentResponse, nil
	})
}
