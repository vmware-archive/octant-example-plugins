/*
Copyright (c) 2021 the Octant contributors. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"fmt"
	"github.com/pkg/errors"
	"github.com/vmware-tanzu/octant/pkg/store"
	"github.com/vmware-tanzu/octant/pkg/view/flexlayout"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"log"
	"time"

	"github.com/vmware-tanzu/octant/pkg/plugin"
	"github.com/vmware-tanzu/octant/pkg/plugin/service"
	"github.com/vmware-tanzu/octant/pkg/view/component"
)

var pluginName = "extend-gvk-sample"

// This is a sample plugin showing the features of Octant's plugin API.
func main() {
	log.SetPrefix("")

	podGVK := schema.GroupVersionKind{Version: "v1", Kind: "Pod"}

	// Tell Octant to call this plugin when printing configuration or tabs for Pods
	capabilities := &plugin.Capabilities{
		SupportsPrinterConfig: []schema.GroupVersionKind{podGVK},
		SupportsTab:           []schema.GroupVersionKind{podGVK},
		IsModule:              false,
	}

	options := []service.PluginOption{
		service.WithTabPrinter(handleTab),
		service.WithPrinter(handlePrint),
	}

	p, err := service.Register(pluginName, "a description", capabilities, options...)
	if err != nil {
		log.Fatal(err)
	}

	p.Serve()
}

func handleTab(request *service.PrintRequest) (plugin.TabResponse, error) {
	if request.Object == nil {
		return plugin.TabResponse{}, errors.New("object is nil")
	}

	layout := flexlayout.New()
	section := layout.AddSection()
	// Octant contains a library of components that can be used to display content.
	// This example uses markdown text.
	contents := component.NewMarkdownText("content from a *plugin*")

	err := section.Add(contents, component.WidthHalf)
	if err != nil {
		return plugin.TabResponse{}, err
	}

	// In this example, this plugin will tell Octant to create a new
	// tab when showing pods. This tab's name will be "Extra Pod Details".
	tab := component.NewTabWithContents(*layout.ToComponent("Extra Pod Details"))

	return plugin.TabResponse{Tab: tab}, nil
}

func handlePrint(request *service.PrintRequest) (plugin.PrintResponse, error) {
	if request.Object == nil {
		return plugin.PrintResponse{}, errors.Errorf("object is nil")
	}
	// load an object from the cluster and use that object to create a response.

	// Octant has a helper function to generate a key from an object. The key
	// is used to find the object in the cluster.
	key, err := store.KeyFromObject(request.Object)
	if err != nil {
		return plugin.PrintResponse{}, err
	}
	u, err := request.DashboardClient.Get(request.Context(), key)
	if err != nil {
		return plugin.PrintResponse{}, err
	}

	// The plugin can check if the object it requested exists.
	if u == nil {
		return plugin.PrintResponse{}, errors.New("object doesn't exist")
	}

	podCard := component.NewCard(component.TitleFromString(fmt.Sprintf("Extra Output for %s", u.GetName())))
	podCard.SetBody(component.NewMarkdownText("This output was generated from _extend-gvk-sample-plugin_"))

	msg := fmt.Sprintf("update from plugin at %s", time.Now().Format(time.RFC3339))

	return plugin.PrintResponse{
		Config: []component.SummarySection{
			{Header: "from-plugin", Content: component.NewText(msg)},
		},
		Status: []component.SummarySection{
			{Header: "from-plugin", Content: component.NewText(msg)},
		},
		Items: []component.FlexLayoutItem{
			{
				Width: component.WidthHalf,
				View:  podCard,
			},
		},
	}, nil
}
