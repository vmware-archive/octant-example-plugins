package main

import (
	"context"
	"github.com/magiconair/properties/assert"
	"github.com/stretchr/testify/require"
	"github.com/vmware-tanzu/octant/pkg/view/component"
	"testing"

	"github.com/vmware-tanzu/octant/pkg/plugin/service"
)

type fakeRequest struct{}

func (f *fakeRequest) DashboardClient() service.Dashboard {
	return nil
}

func (f *fakeRequest) Path() string {
	return "/my/fake/path"
}

func (f *fakeRequest) Context() context.Context {
	return context.TODO()
}

func Test_routeHandler(t *testing.T) {
	p := actionPlugin{}
	r := &fakeRequest{}

	cr, err := p.routeHandler(r)
	require.NoError(t, err)

	expectedTitle := component.TitleFromString("Action Example")
	assert.Equal(t, cr.Title, expectedTitle)
}
