import re
import urllib.request
from pathlib import Path

text = urllib.request.urlopen(
    "https://raw.githubusercontent.com/vaportail/codex-windows-updater/main/src/store/direct.rs",
    timeout=30,
).read().decode()
match = re.search(r'const MSA_TOKEN: &str = "(.*?)";', text, re.S)
if not match:
    raise SystemExit("token not found")
Path(__file__).resolve().parent.joinpath("msa_token.txt").write_text(match.group(1), encoding="utf-8")
print(len(match.group(1)))
