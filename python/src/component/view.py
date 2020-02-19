import json

class View(object):
    def __init__(self, titleComponent):
        self.titleComponent = titleComponent
        self.components = list()

    def add(self, component):
        self.components.append(component)

    def encode(self):
        result = {'title': self.titleComponent, 'viewComponents': list()}
        for component in self.components:
            if type(component) == dict:
                result['viewComponents'].append(component)
            elif hasattr(component, 'render'):
                result['viewComponents'].append(component.render())
            else:
                raise Exception("bad component")
        output = json.dumps(result)
        encoded = output.encode('utf-8')
        return encoded
