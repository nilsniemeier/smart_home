"""Local dev server with live reload.

    python serve.py [port]        (default 8777)

Serves the project folder like `python -m http.server`, but
  - sends Cache-Control: no-store, so edited CSS/JS is never stale
  - answers /__livereload with the newest mtime of the deck files;
    js/engine.js polls it and reloads the page when it changes.
"""

import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
WATCH_EXT = {'.html', '.css', '.js', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif'}
SKIP_DIRS = {'build'}


def latest_mtime():
    newest = 0
    for folder, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in SKIP_DIRS]
        for name in files:
            if os.path.splitext(name)[1].lower() in WATCH_EXT:
                try:
                    newest = max(newest, os.stat(os.path.join(folder, name)).st_mtime_ns)
                except OSError:
                    pass
    return newest


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        if self.path.split('?')[0] == '/__livereload':
            body = str(latest_mtime()).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, fmt, *args):
        if '/__livereload' not in self.path:
            super().log_message(fmt, *args)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8777
    print(f'Serving {ROOT} on http://localhost:{port}/ (live reload)')
    ThreadingHTTPServer(('', port), Handler).serve_forever()
