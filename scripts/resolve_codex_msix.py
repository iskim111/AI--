#!/usr/bin/env python3
"""Resolve the latest official Codex MSIX download URL from Microsoft Store (FE3)."""

from __future__ import annotations

import html
import json
import re
import sys
import urllib.request
from pathlib import Path

PRODUCT_ID = "9PLM9XGG6VKS"
DISPLAYCATALOG_BASE = "https://displaycatalog.mp.microsoft.com/v7.0/products/"
FE3_URL = "https://fe3.delivery.mp.microsoft.com/ClientWebService/client.asmx"
FE3_SECURED_URL = (
    "https://fe3.delivery.mp.microsoft.com/ClientWebService/client.asmx/secured"
)
UA = "Windows-Update-Agent/10.0.10011.16384 Client-Protocol/1.40"
TEMPLATE_DIR = Path(__file__).resolve().parent / "templates"
def load_msa_token() -> str:
    token_path = Path(__file__).resolve().parent / "msa_token.txt"
    if not token_path.exists():
        raise RuntimeError(
            "Missing scripts/msa_token.txt — run scripts/extract_token.py once."
        )
    return token_path.read_text(encoding="utf-8")


def load_template(name: str) -> str:
    return (TEMPLATE_DIR / name).read_text(encoding="utf-8")


def post(url: str, body: str) -> str:
    req = urllib.request.Request(
        url,
        data=body.encode("utf-8"),
        headers={
            "Content-Type": "application/soap+xml; charset=utf-8",
            "User-Agent": UA,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read().decode("utf-8", errors="replace")


def fetch_wu_category_id(product_id: str) -> str:
    url = f"{DISPLAYCATALOG_BASE}{product_id}?market=US&languages=en-US"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)

    products = data.get("Products") or [data.get("Product")]
    for product in products:
        if not product:
            continue
        for sku in product.get("DisplaySkuAvailabilities", []):
            fd = sku.get("Sku", {}).get("Properties", {}).get("FulfillmentData")
            if isinstance(fd, str):
                fd = json.loads(fd)
            if isinstance(fd, dict) and fd.get("WuCategoryId"):
                return fd["WuCategoryId"]
    raise RuntimeError("WuCategoryId not found")


def extract_tag(xml: str, tag: str) -> str | None:
    m = re.search(rf"<(?:[\w:]*:)?{tag}[^>]*>(.*?)</(?:[\w:]*:)?{tag}>", xml, re.S)
    return html.unescape(m.group(1).strip()) if m else None


def html_decode(text: str) -> str:
    return (
        text.replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("&apos;", "'")
        .replace("&amp;", "&")
    )


def parse_candidates(xml: str) -> list[dict]:
    xml = html_decode(xml)
    out: list[dict] = []
    for block in re.findall(r"<UpdateInfo\b.*?</UpdateInfo>", xml, re.S):
        if "SecuredFragment" not in block:
            continue
        identity = re.search(
            r"<UpdateIdentity\b[^>]*>.*?<UpdateID>([^<]+)</UpdateID>.*?<RevisionNumber>([^<]+)</RevisionNumber>",
            block,
            re.S,
        )
        if not identity:
            identity = re.search(
                r'<UpdateIdentity\b[^>]*UpdateID="([^"]+)"[^>]*RevisionNumber="([^"]+)"',
                block,
            )
        moniker = re.search(r'PackageMoniker="([^"]+)"', block)
        if not identity or not moniker:
            continue
        m = moniker.group(1)
        if not m.startswith("OpenAI.Codex_") or "_x64_" not in m:
            continue
        out.append(
            {
                "moniker": m,
                "update_id": identity.group(1),
                "revision_id": identity.group(2),
            }
        )
    return out


def version_key(moniker: str) -> tuple[int, ...]:
    parts = moniker.split("_")
    if len(parts) < 2:
        return (0,)
    return tuple(int(p) if p.isdigit() else 0 for p in parts[1].split("."))


def pick_msix_url(urls: list[str]) -> str | None:
    http_urls = [u for u in urls if u.startswith("http") and len(u) != 99]
    return max(http_urls, key=len) if http_urls else None


def extract_urls(xml: str) -> list[str]:
    return re.findall(r"<(?:[\w:]*:)?Url[^>]*>(https?://[^<]+)</(?:[\w:]*:)?Url>", xml)


def resolve(product_id: str = PRODUCT_ID) -> dict:
    category_id = fetch_wu_category_id(product_id)
    cookie = extract_tag(post(FE3_URL, load_template("GetCookie.xml")), "EncryptedData")
    if not cookie:
        raise RuntimeError("GetCookie failed")

    sync_body = (
        load_template("WUIDRequest.xml")
        .replace("{0}", cookie, 1)
        .replace("{1}", category_id, 1)
        .replace("{2}", load_msa_token(), 1)
    )
    sync_xml = post(FE3_URL, sync_body)
    candidates = parse_candidates(sync_xml)
    if not candidates:
        raise RuntimeError("No Codex package candidates found")

    best = max(candidates, key=lambda c: version_key(c["moniker"]))
    file_body = (
        load_template("FE3FileUrl.xml")
        .replace("{0}", best["update_id"], 1)
        .replace("{1}", best["revision_id"], 1)
        .replace("{2}", load_msa_token(), 1)
    )
    file_xml = post(FE3_SECURED_URL, file_body)
    url = pick_msix_url(extract_urls(file_xml))
    if not url:
        raise RuntimeError("No MSIX download URL found")

    version = best["moniker"].split("_")[1]
    return {
        "url": html.unescape(url),
        "moniker": best["moniker"],
        "version": version,
    }


def main() -> int:
    result = resolve()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(1)
