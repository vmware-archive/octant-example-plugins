from component import (
    View,
    Text,
    Title,
    List,
    Link,
    CardList,
    Card,
)

def defaultView():
    view = View(Title("Python Plugin - Default"))

    links = List(Title("View List"))
    links.add(Link(" View One ", "/octant-py-plugin/view-one"))
    links.add(Link(" View Two ", "/octant-py-plugin/view-two"))
    links.add(Link(" View Three ", "/octant-py-plugin/view-three"))

    view.add(links)

    return view.encode()


def viewOne():
    view = View(Title("Python Plugin - View One"))
    list1 = CardList("Tab 1", "tab1")
    list1.add(Card(Title("My Card 1"), Text("hello from plugin: view one")))
    view.add(list1)

    return view.encode()

def viewTwo():
    view = View(Title("Python Plugin - View Two"))
    list2 = CardList("Tab 2", "tab2")
    list2.add(Card(Title("My Card 2"), Text("hello from plugin: view two")))
    view.add(list2)

    return view.encode()

def viewThree():
    view = View(Title("Python Plugin - View Three"))

    list1 = CardList("Tab A", "tabA")
    list1.add(Card(Title("My Card A"), Text("hello from plugin: view three A")))

    list2 = CardList("Tab B", "tabB")
    list2.add(Card(Title("My Card B"), Text("hello from plugin: view three B")))

    view.add(list1)
    view.add(list2)

    return view.encode()