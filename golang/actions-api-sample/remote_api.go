/*
Copyright (c) 2021 the Octant contributors. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"context"
	"sync"
)

// remoteAPI is a fake remote API a plugin might call.
type remoteAPI struct {
	datastore []uint16
	mu        sync.RWMutex

	ctx      context.Context
	cancelFn context.CancelFunc
}

func newRemoteAPI(ctx context.Context) *remoteAPI {
	ctx, cancelFn := context.WithCancel(ctx)
	return &remoteAPI{
		ctx:      ctx,
		cancelFn: cancelFn,
	}
}

func (r *remoteAPI) add(n uint16) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.datastore = append(r.datastore, n)
}

func (r *remoteAPI) list() []uint16 {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.datastore
}

func (r *remoteAPI) clear() {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.datastore = []uint16{}
}

func (r *remoteAPI) start() {

}

func (r *remoteAPI) stop() {
	r.cancelFn()
}
