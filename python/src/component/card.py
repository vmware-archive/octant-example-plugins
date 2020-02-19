def Card(title, component, actions=None, alert=None):
    result = {
        "metadata": {"title": title, "type": "card"},
        "config": {"body": component},
    }
    if actions:
        result['actions'] = actions
    if alert:
        result['alert'] = alert
    return result

class CardList(object):
    def __init__(self, name, accessor):
        self.name = name
        self.accessor = accessor
        self.cards = list()

    def add(self, card):
        self.cards.append(card)

    def render(self):
        metadata = {
            "type": "cardList",
            "title":[{"metadata":{"type":"text"}, "config":{"value": self.name}}],
            "accessor": self.accessor,
        }

        result = {
            "metadata": metadata,
            "config":{
                "cards": [c for c in self.cards],
            }
        }

        return result
