def Title(items):
    if type(items) == list:
        return [c for c in items]
    elif type(items) == dict:
        return [items]
    return [{
        "metadata": {"type": "text"},
        "config": {"value": items},
    }]