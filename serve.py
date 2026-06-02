#!/usr/bin/env python3
"""Local static server with Codex MSIX download redirect."""

from __future__ import annotations

import html
import http.server
import socketserver
import sys
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = 8888


@lru_cache(maxsize=1)
def get_codex_download_url() -> str:
    sys.path.insert(0, str(ROOT / "scripts"))
    from resolve_codex_msix import resolve

    return html.unescape(resolve()["url"])


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        if self.path.rstrip("/") == "/api/codex-download":
            try:
                url = get_codex_download_url()
            except Exception as exc:
                self.send_error(502, explain=f"Codex download URL resolve failed: {exc}")
                return
            self.send_response(302)
            self.send_header("Location", url)
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            return
        super().do_GET()


def main() -> None:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://127.0.0.1:{PORT}/index.html")
        print("Codex download redirect: /api/codex-download")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
