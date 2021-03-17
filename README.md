## Octant Plugin Samples

This repository contains minimal code samples illustrating some common patterns around plugins.

Supported plugins are written in Typescript or Go although it is possible to write plugins in any language.

Each plugin sample should contain:

- A description of what the plugin does
- A demo of the use case
- Notes and caveats about the usage pattern, if any
- Installation instructions

## Prerequisites

Plugins written in Go will require 1.16 or above. Plugins written in Typescript will require an installation of node and npm.

Using the latest version of Octant is also recommended.

 - Go version 1.16+
 - Node 14+
 - Octant 0.17+

## Samples

| Sample | Go | Typescript | Description |
| ----- | --- | ----- | ----- |
| Module Sample | [:heavy_check_mark:]() |  | Adds a new module and sub paths |
| Extend GVK Sample | [:heavy_check_mark:]() |  | Adds additional components inside an existing view |
| Actions API Sample | [:heavy_check_mark:]() |  | Calling a remote API and managing state |
| Alert Sample | [:heavy_check_mark:]() |  | Sends an alert message |
| Local Event Loop | |  | Maintain a local event loop not tied to Octant poll |
### To Do

 - [ ] Form Sample
 - [ ] Dropdown Sample
 - [ ] Timeline Sample
