class List(object):
    def __init__(self, title, items=None):
        self.title = title
        if items is not None:
            self.items = list(items)
        else:
            self.items = list()

    def add(self, item):
        self.items.append(item)

    def render(self):
        result = {
            "metadata": {
                "type": "list",
                "title": self.title,
            },
            "config": {
                "items": [i for i in self.items],
                "iconName": "",
                "iconSource": ""
            },
        }
        return result