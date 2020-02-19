from concurrent import futures

import sys
import grpc
import json

from grpc_health.v1.health import HealthServicer
from grpc_health.v1 import health_pb2, health_pb2_grpc

from lib.util import get_open_port
from lib import (
    dashboard_pb2_grpc,
    dashboard_pb2
)

from navigation import Navigation

from views import (
    defaultView,
    viewOne,
    viewTwo,
    viewThree,
)

class PluginServicer(dashboard_pb2_grpc.PluginServicer):
    def Register(self, request, context):
        capabilities = dashboard_pb2.RegisterResponse.Capabilities(isModule=True)
        result = dashboard_pb2.RegisterResponse(
            pluginName="octant-py-plugin",
            description="example python plugin for Octant",
            capabilities=capabilities,
        )

        return result

    def Navigation(self, request, context):
        nav = Navigation("Python Plugin", "/octant-py-plugin", "cloud")
        
        nav.add(Navigation("View One", "/octant-py-plugin/view-one", "folder"))
        nav.add(Navigation("View Two", "/octant-py-plugin/view-two", "folder"))
        nav.add(Navigation("View Three", "/octant-py-plugin/view-three", "folder"))

        return nav.toResponse()

    def Content(self, request, context):
        if request.path == '/view-one':
            content = viewOne()
        elif request.path == '/view-two':
            content = viewTwo()
        elif request.path == '/view-three':
            content = viewThree()
        else:
            content = defaultView()
        result = dashboard_pb2.ContentResponse(content_response=content)
        return result


def main():
    health = HealthServicer()
    health.set("plugin", health_pb2.HealthCheckResponse.ServingStatus.Value('SERVING'))

    plugin = PluginServicer()

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    dashboard_pb2_grpc.add_PluginServicer_to_server(plugin, server)
    health_pb2_grpc.add_HealthServicer_to_server(health, server)

    port = get_open_port()

    server.add_insecure_port('[::]:' + port)
    server.start()

    print("1|1|tcp|127.0.0.1:"+port+"|grpc")
    sys.stdout.flush()

    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        pass

if __name__ == '__main__':
    main()
