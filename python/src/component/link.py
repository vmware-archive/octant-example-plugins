def Link(text, url):
    return {
        "metadata": {"type": "link"},
        "config": {"value": text, "ref": url},
    }