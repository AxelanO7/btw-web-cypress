import sys
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
    def handle_data(self, data):
        d = data.strip()
        if d:
            self.text.append(d)

parser = MyHTMLParser()
with open('cypress/downloads/tryout.html', 'r', encoding='utf-8') as f:
    parser.feed(f.read())
print(" | ".join(parser.text[:100]))
print(" | ".join(parser.text[100:200]))
print(" | ".join(parser.text[200:300]))
print(" | ".join(parser.text[300:400]))
