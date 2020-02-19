from lib import dashboard_pb2

class Navigation(object):
    def __init__(self, value, path, icon_name=None, icon_source=None, children=None):
        self.value = value
        self.path = path
        self.icon_name = icon_name
        self.icon_source = icon_source

        if children is None:
            self.children = list()
        elif type(children) == list:
            self.children = children
        else:
            self.children = list(children)

    def add(self, child):
        self.children.append(child)
    
    def toNavigation(self):
        return dashboard_pb2.NavigationResponse.Navigation(
            title=self.value,
            path=self.path,
            icon_name=self.icon_name,
            icon_source=self.icon_source,
            children=[c.toNavigation() for c in self.children],
        )  
    def toResponse(self):
        return dashboard_pb2.NavigationResponse(navigation=self.toNavigation())