// Some example resource viewer data to be rendered in the resource viewer component
// Based off documentation for the resource viewer component (https://reference.octant.dev/?path=/story/other-resources--graph-story)
// Data adapted from https://github.com/vmware-tanzu/octant/blob/master/web/src/stories/graph/graph.real.data.ts

interface NodeDataDef {
  nodes: any;
  edges?: any;
}

export const REAL_DATA_STATEFUL_SET: NodeDataDef = {
  edges: {
    'kafka pods': [
      { node: '0bf159aa-01ea-4742-a6a2-becef1178827', edge: 'explicit' },
      { node: '14eda8ed-87c3-4aa1-a3cb-9f4279704fc5', edge: 'explicit' },
      { node: '3c81e771-d723-403d-a19b-be7ce87ff7f2', edge: 'explicit' },
      { node: '9cd5e4f0-4979-4119-9c93-7df18bd88059', edge: 'explicit' },
      { node: 'a4e5517e-0563-4158-88d3-a0492fe18cd5', edge: 'explicit' },
    ],
  },
  nodes: {
    '0bf159aa-01ea-4742-a6a2-becef1178827': {
      name: 'kafka-config',
      apiVersion: 'v1',
      kind: 'ConfigMap',
      status: 'ok',
      details: [
        { metadata: { type: 'text' }, config: { value: 'v1 ConfigMap is OK' } },
      ],
      path: {
        config: {
          value: 'kafka-config',
          ref:
            '/overview/namespace/milan/config-and-storage/config-maps/kafka-config',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    '14eda8ed-87c3-4aa1-a3cb-9f4279704fc5': {
      name: 'kafka-headless',
      apiVersion: 'v1',
      kind: 'Service',
      status: 'ok',
      details: [
        { metadata: { type: 'text' }, config: { value: 'Service is OK' } },
      ],
      path: {
        config: {
          value: 'kafka-headless',
          ref:
            '/overview/namespace/milan/discovery-and-load-balancing/services/kafka-headless',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    '3c81e771-d723-403d-a19b-be7ce87ff7f2': {
      name: 'default-token-4dln7',
      apiVersion: 'v1',
      kind: 'Secret',
      status: 'ok',
      details: [
        { metadata: { type: 'text' }, config: { value: 'v1 Secret is OK' } },
      ],
      path: {
        config: {
          value: 'default-token-4dln7',
          ref:
            '/overview/namespace/milan/config-and-storage/secrets/default-token-4dln7',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    '9cd5e4f0-4979-4119-9c93-7df18bd88059': {
      name: 'kafka',
      apiVersion: 'apps/v1',
      kind: 'StatefulSet',
      status: 'ok',
      details: [
        { metadata: { type: 'text' }, config: { value: 'Stateful Set is OK' } },
      ],
      path: {
        config: {
          value: 'kafka',
          ref: '/overview/namespace/milan/workloads/stateful-sets/kafka',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    'a4e5517e-0563-4158-88d3-a0492fe18cd5': {
      name: 'default',
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      status: 'ok',
      details: [
        {
          metadata: { type: 'text' },
          config: { value: 'v1 ServiceAccount is OK' },
        },
      ],
      path: {
        config: {
          value: 'default',
          ref:
            '/overview/namespace/milan/config-and-storage/service-accounts/default',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    'kafka pods': {
      name: 'kafka pods',
      apiVersion: 'v1',
      kind: 'Pod',
      status: 'ok',
      details: [
        {
          metadata: { type: 'podStatus' },
          config: {
            pods: {
              'kafka-0': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
            },
          },
        },
      ],
    },
  },
};

export const REAL_DATA_DAEMON_SET: NodeDataDef = {
  edges: {
    'hubble pods': [
      { node: '2ca0da85-f263-4087-a732-73e5501c0a47', edge: 'explicit' },
      { node: 'f5beb4cb-2c7b-474d-9719-0ac02fd8b8b7', edge: 'explicit' },
      { node: 'f69e1b15-a257-42fa-a367-d4a5eb70d8cf', edge: 'explicit' },
      { node: 'f93575bb-0f33-4aa0-8d64-6ebb1cbdf7ce', edge: 'explicit' },
    ],
  },
  nodes: {
    '2ca0da85-f263-4087-a732-73e5501c0a47': {
      name: 'hubble',
      apiVersion: 'apps/v1',
      kind: 'DaemonSet',
      status: 'ok',
      details: [
        { metadata: { type: 'text' }, config: { value: 'Daemon Set is OK' } },
      ],
      path: {
        config: {
          value: 'hubble',
          ref: '/overview/namespace/kube-system/workloads/daemon-sets/hubble',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    'f5beb4cb-2c7b-474d-9719-0ac02fd8b8b7': {
      name: 'hubble-token-smc5q',
      apiVersion: 'v1',
      kind: 'Secret',
      status: 'ok',
      details: [
        { metadata: { type: 'text' }, config: { value: 'v1 Secret is OK' } },
      ],
      path: {
        config: {
          value: 'hubble-token-smc5q',
          ref:
            '/overview/namespace/kube-system/config-and-storage/secrets/hubble-token-smc5q',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    'f69e1b15-a257-42fa-a367-d4a5eb70d8cf': {
      name: 'hubble-grpc',
      apiVersion: 'v1',
      kind: 'Service',
      status: 'warning',
      details: [
        {
          metadata: { type: 'text' },
          config: { value: 'Service has no endpoint addresses' },
        },
      ],
      path: {
        config: {
          value: 'hubble-grpc',
          ref:
            '/overview/namespace/kube-system/discovery-and-load-balancing/services/hubble-grpc',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    'f93575bb-0f33-4aa0-8d64-6ebb1cbdf7ce': {
      name: 'hubble',
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      status: 'ok',
      details: [
        {
          metadata: { type: 'text' },
          config: { value: 'v1 ServiceAccount is OK' },
        },
      ],
      path: {
        config: {
          value: 'hubble',
          ref:
            '/overview/namespace/kube-system/config-and-storage/service-accounts/hubble',
        },
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
      },
    },
    'hubble pods': {
      name: 'hubble pods',
      apiVersion: 'v1',
      kind: 'Pod',
      status: 'ok',
      details: [
        {
          metadata: { type: 'podStatus' },
          config: {
            pods: {
              'hubble-4gnq8': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-8lfqv': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-dwzx5': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-jjsdm': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-khckr': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-lhz85': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-q5nwq': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-rqmxz': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-rxbkz': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
              'hubble-vldtj': {
                details: [
                  { metadata: { type: 'text' }, config: { value: '' } },
                ],
                status: 'ok',
              },
            },
          },
        },
      ],
    },
  },
};

export const REAL_DATA_DAEMON_SET2: NodeDataDef = {
  nodes: {
    '16428c94-a848-47d5-b1e3-c8245b57959b': {
      name: 'metadata-proxy-v0.1',
      apiVersion: 'apps/v1',
      kind: 'DaemonSet',
      status: 'ok',
      details: [
        { metadata: { type: 'text' }, config: { value: 'Daemon Set is OK' } },
      ],
      path: {
        metadata: {
          type: 'link',
          title: [{ metadata: { type: 'text' }, config: { value: '' } }],
        },
        config: {
          value: 'metadata-proxy-v0.1',
          ref:
            '/overview/namespace/kube-system/workloads/daemon-sets/metadata-proxy-v0.1',
        },
      },
      hasChildren: false,
    },
  },
};