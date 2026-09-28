import http.server
import socketserver
import os
import sys
import functools

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class FastHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path.endswith(('.jpg', '.jpeg', '.png', '.webp', '.js', '.css')):
            self.send_header('Cache-Control', 'public, max-age=86400')
        else:
            self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Keep console output clean
        pass

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == '__main__':
    handler_factory = functools.partial(FastHandler, directory=DIRECTORY)
    with ThreadingTCPServer(('127.0.0.1', PORT), handler_factory) as httpd:
        print(f"Server started successfully at http://localhost:{PORT}")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
