#!/usr/bin/env python3
"""Consolidate high-confidence tag aliases across all content collections."""

import argparse
import ast
import json
import re
import subprocess
import tempfile
from pathlib import Path


# Keep this deliberately conservative. Tags only belong here when they differ
# by casing, punctuation, plurality, a clear typo, or an established synonym.
TAG_GROUPS = {
    "90s": ["90s"],
    "Absurdist": ["absurdist"],
    "Adventure": ["adventure"],
    "Agentic Browsers": ["agentic browsers"],
    "AI": ["ai", "artificial intelligence"],
    "Android": ["android", "anroid"],
    "Apache Flink": ["flink community", "flink features", "flinkcep", "cep", "complex event processing", "apache flink"],
    "API": ["api", "apis"],
    "API Documentation": ["api documentation"],
    "API Management": ["api management"],
    "Apocalyptic": ["apocalyptic"],
    "Apps": ["app", "apps"],
    "AR": ["ar", "augmented reality"],
    "AsciiDoc": ["asciidoc"],
    "Atom": ["atom", "atom.io"],
    "Audio": ["audio"],
    "Automation": ["automation"],
    "Bare Metal": ["bare metal"],
    "Best Practices": ["best practice", "best practices", "best practises"],
    "Big Data": ["big data sets", "big data use cases", "big data"],
    "Blockchain": ["blockchain"],
    "Board Games": ["boardgames", "board games"],
    "Books": ["books"],
    "Bots": ["bot", "bots", "bot development"],
    "Browsers": ["browser", "browsers", "web browsers"],
    "Build Tools": ["build tools"],
    "Business Intelligence": ["business inteligence", "business intelligence"],
    "Calibre": ["calibre"],
    "Camera": ["camera"],
    "CES": ["ces 2020", "ces"],
    "Chatbots": ["chatbot", "chatbots"],
    "Children": ["kids", "children"],
    "CircleCI": ["circleci"],
    "CiviCRM": ["civicrm"],
    "CLI": ["cli"],
    "Cloud Computing": ["cloud", "cloud hosting", "cloud providers", "cloud vendors", "cloud computing"],
    "Cloud Native": ["cloud native", "cloud-native"],
    "CMS": ["cms", "content management system"],
    "CNCF": ["cncf"],
    "Communication": ["communication"],
    "Communication & Collaboration": ["communication &amp;amp; collaboration"],
    "Community": ["community"],
    "Conferences": ["conference", "conferences"],
    "Containers": ["containers", "docker containers", "kata containers", "runc", "runv", "rkt", "cloud containers"],
    "Continuous Delivery": ["continuous delivery", "continous delivery"],
    "Continuous Deployment": ["continuous deployment", "continious deployment"],
    "Continuous Integration": ["continuous integration", "continious integration", "ci"],
    "CoreOS": ["coreos"],
    "Cosmic": ["cosmic"],
    "Cost Optimisation": ["cost optimization", "cost optimisation"],
    "COVID-19": ["coronavirus", "covid-19"],
    "CRM": ["crm"],
    "Cross-platform": ["cross platform", "cross-platform"],
    "Cryptocurrency": ["cryptocurrency", "cryptocurrencies"],
    "CSS": ["css"],
    "Culture": ["culture"],
    "DApps": ["dapp", "distributed apps", "dapps"],
    "Dark": ["dark"],
    "Dash": ["dash"],
    "Data Analytics": ["data analysis", "data analytics"],
    "Data Centre": ["data center", "data centre"],
    "Databases": ["database", "databases"],
    "Debug": ["debug"],
    "Decentralised": ["decentralized", "decentralised"],
    "Decentralised Exchange": ["decentralized exchange", "decentralised exchange"],
    "Defence Tech": ["defense tech", "defence tech"],
    "Deployment": ["deploy", "deployment"],
    "Desk and Streaming Setup": ["desk and streaming setup"],
    "Developer Experience": ["developer experience", "dx"],
    "Developer Relations": ["developer evangelism", "developer relations"],
    "Developer Tools": ["developer tools"],
    "Developers": ["developer", "developers"],
    "Development": ["development"],
    "DevOps": ["devops"],
    "Distributed Ledger": ["distributed ledger", "distributed ledger technology"],
    "Distributed Systems": ["distributed", "distributed computing", "distributed systems"],
    "DNS": ["dns"],
    "Docker": ["docker"],
    "Docs as Code": ["docs as code"],
    "Documentation": ["documentation"],
    "Droidcon": ["droidcon"],
    "DZone": ["dzone"],
    "eBooks": ["ebooks"],
    "Editing": ["editing"],
    "Education": ["learning", "learning and development", "students", "university", "mooc", "education"],
    "ERC-20": ["erc-20"],
    "Espionage": ["espionage"],
    "Ethereum": ["ethereum"],
    "Ethics": ["ethics"],
    "Events": ["event", "events"],
    "Export": ["export"],
    "FaaS": ["faas"],
    "Fable": ["fable"],
    "Fantasy": ["fantasy"],
    "Feature Flags": ["feature flags"],
    "Fiction": ["fiction"],
    "First-Person": ["first-person"],
    "Folklore": ["folklore"],
    "Game Design": ["game design", "gamedesign"],
    "Games": ["games"],
    "Gaming": ["gaming"],
    "Getting Started": ["getting-started", "getting started"],
    "GitHub": ["github"],
    "GitLab": ["gitlab"],
    "GitOps": ["gitops"],
    "Go": ["go lang", "golang", "go"],
    "GPU": ["gpu"],
    "Grammar Checking": ["grammar checking"],
    "GraphQL": ["graphql", "qraphql"],
    "Great Idea": ["greatidea", "great idea"],
    "gRPC": ["grpc"],
    "GUI": ["gui"],
    "HashiCorp": ["hashicorp"],
    "Helicone": ["helicone"],
    "Historical": ["historical"],
    "Horror": ["horror"],
    "Hosting": ["hosting"],
    "HTML": ["html"],
    "HTTP": ["http", "https"],
    "Humour": ["humor", "humour"],
    "Hybrid Cloud": ["hybrid", "hybrid cloud management solutions", "hybrid cloud"],
    "IBM": ["ibm"],
    "IBM Cloud": ["ibm cloud"],
    "ICO": ["ico"],
    "Identity": ["identity"],
    "IFA": ["ifa"],
    "Indie Development": ["indie development"],
    "Industrial IoT": ["iiot", "industrial iot"],
    "Infrastructure as Code": ["infrastructure as a code", "infrastructure as code"],
    "Internal Developer Platforms": ["internal developer platforms"],
    "Internet": ["internet"],
    "IoT": ["iot", "internet of things"],
    "iPad": ["ipad"],
    "IPFS": ["ipfs"],
    "iPhone": ["iphone"],
    "Java": ["java"],
    "JavaScript": ["javascript"],
    "Jekyll": ["jekyll"],
    "JetBrains": ["jetbrains"],
    "JSON": ["json"],
    "Kong API": ["kong api"],
    "Kubernetes": ["kubernetes"],
    "Languages": ["language", "languages"],
    "Learn to Code": ["learn to code", "learning to code"],
    "Life": ["life"],
    "Links": ["links"],
    "Linting": ["linting"],
    "Literary": ["literary"],
    "LLM": ["llm"],
    "Local AI": ["local ai"],
    "macOS": ["macos"],
    "Maintenance": ["maintenance", "maitenance"],
    "Markdown": ["markdown"],
    "Medium": ["medium"],
    "Meetups": ["meetups"],
    "Melancholy": ["melancholy"],
    "Merchandise": ["merchandise"],
    "MicroK8s": ["microk8", "microk8s"],
    "Microservices": ["microservice", "microservices"],
    "MiniDLNA": ["minidnla"],
    "Mobile": ["mobile"],
    "Mobile Development": ["mobile development", "mobile app development"],
    "Monitoring": ["monitoring and alerting", "monitoring"],
    "Multi-cloud": ["multi cloud", "multi-cloud"],
    "Music": ["music"],
    "MWC": ["mwc", "mwc2017", "mobile world congress"],
    "MySQL": ["mysql"],
    ".NET": [".net"],
    "News": ["news"],
    "Nextcloud": ["nextcloud"],
    "Nexus": ["nexus"],
    "NLP": ["nlp", "natural language processing"],
    "Node.js": ["node js", "nodejs", "node.js", "node"],
    "NoSQL": ["nosql"],
    "Nostalgia": ["nostalgia"],
    "Notation": ["notation"],
    "Observability": ["observability", "alerting", "metrics", "tracing", "logging"],
    "OCR": ["ocr"],
    "Open Data": ["opendata"],
    "Open Source": ["open source", "open souce", "foss", "oss", "foss backstage"],
    "OpenShift": ["open shift", "openshift"],
    "OpenStack": ["openstack"],
    "Operating Systems": ["operating systems"],
    "Optimisation": ["optimization", "optimisation"],
    "PaaS": ["paas", "platform as a service"],
    "Payments": ["micropayments", "payments"],
    "PDF": ["pdf"],
    "Personal": ["personal"],
    "Philosophical": ["philosophical"],
    "Phones": ["mobile phones", "phones"],
    "PHP": ["php"],
    "Platform Engineering": ["platform engineering"],
    "Playtesting": ["playtesting"],
    "Podcasting": ["podcasting"],
    "Podcasts": ["podcast", "podcasts"],
    "Presentations": ["presentations", "presenations"],
    "Problem-Solving": ["problem-solving"],
    "Productivity": ["productivity", "prodictivity"],
    "Programming": ["programming"],
    "Programming Tool": ["programming tool"],
    "PromQL": ["promql"],
    "Prose-Poetry": ["prose-poetry"],
    "Proxy": ["proxy"],
    "Recommender Systems": ["recommender systems"],
    "REST API": ["rest", "rest api"],
    "Reviews": ["review", "reviews"],
    "Robotics": ["robots", "robotics"],
    "Roleplaying": ["role playing", "roleplaying", "toleplay"],
    "SaaS": ["saas"],
    "Satire": ["satire"],
    "Science Fiction": ["science fiction", "sci-fi", "scifi"],
    "SDK": ["sdk"],
    "SDN": ["sdn"],
    "Security": ["security"],
    "Services": ["service", "services"],
    "Site Updates": ["site updates"],
    "Smart Contracts": ["smart contract", "smart-contract", "smart contracts"],
    "Snaps": ["snap", "snaps"],
    "Social Media": ["socialmedia", "social media"],
    "Software Development": ["software development"],
    "Space": ["space"],
    "Speculative": ["speculative"],
    "Spell Checking": ["spell checking"],
    "Sports": ["sport", "sports"],
    "SQL": ["sql"],
    "SSML": ["ssml"],
    "Streaming": ["streaming"],
    "Style Checking": ["style checking"],
    "Sublime Text": ["sublime", "sublime text"],
    "Supernatural": ["supernatural"],
    "Suspense": ["suspense"],
    "Sustainability": ["sustainability"],
    "SXSW": ["sxsw"],
    "Tech": ["tech", "technology"],
    "Tech News": ["techology news", "technology news", "news tech", "tech news"],
    "Technical Writing": ["technical writing", "techwriting", "tech writing"],
    "Test Automation": ["automated testing", "test automation"],
    "Testing": ["test", "testing"],
    "Text Editors": ["text editor", "text editors", "texteditors"],
    "Time-series Data": ["time series data", "time-series data"],
    "Tokens": ["token", "tokens", "token-standard"],
    "Tools": ["tools"],
    "Tutorials": ["tutorial", "tutorials"],
    "TV": ["tv"],
    "UK": ["uk"],
    "UX": ["ux"],
    "Version Control": ["version control"],
    "Video": ["video"],
    "Video Generation": ["video generation"],
    "Virtual Machines": ["vm", "vms", "virtual machines"],
    "Virtualisation": ["virtualization", "virtualisation"],
    "Visualisation": ["visualization", "visualisation"],
    "Voice Interfaces": ["vui", "voice interfaces"],
    "VPN": ["vpn"],
    "VS Code": ["vscode", "visual studio code", "vs code"],
    "WASM": ["wasm", "web assembly"],
    "Web": ["web"],
    "Web Development": ["web dev", "web development"],
    "Websites": ["websites"],
    "Workshops": ["workshops"],
    "Writing": ["writing"],
    "Writing Tools": ["writing tool", "writing tools"],
    "WWDC": ["wwdc"],
    "XML": ["xml"],
    "Zines": ["fanzine", "zines"],
}

TAG_ALIASES = {
    alias.casefold(): canonical
    for canonical, aliases in TAG_GROUPS.items()
    for alias in {canonical, *aliases}
}

# Tags that held two or more topics at once (leftovers from old Jekyll category
# strings). Put the most specific topic first: the redirect for the old tag page
# points at the first entry.
TAG_SPLITS = {
    "life travel": ["Travel", "Life"],
    "life melbourne": ["Melbourne", "Life"],
    "life music": ["Music", "Life"],
    "life death opinion": ["Death", "Opinion", "Life"],
    "melbourne music": ["Melbourne", "Music"],
    "reviews history": ["History", "Reviews"],
    "reviews phones": ["Phones", "Reviews"],
    "reviews religion": ["Religion", "Reviews"],
    "presentations - open-source": ["Presentations", "Open Source"],
}

# Tags with no lasting meaning (the publish date already records the year).
TAG_DROP = {"2015", "2016", "2017", "2018", "unit2017"}


def expand_tag(tag: str) -> list[str]:
    """Return the canonical tag(s) for a raw tag: none if dropped, several if split."""
    stripped = tag.strip()
    key = stripped.casefold()
    if key in TAG_DROP:
        return []
    parts = TAG_SPLITS.get(key, [stripped])
    return [TAG_ALIASES.get(part.casefold(), part) for part in parts]


def normalize_tag(tag: str) -> str:
    """Return the canonical form of a known tag and preserve unknown tags."""
    stripped = tag.strip()
    return TAG_ALIASES.get(stripped.casefold(), stripped)


def normalize_tags(tags: list[str]) -> list[str]:
    """Normalize tags, applying drops and splits, and remove duplicates."""
    result = []
    seen = set()
    for tag in tags:
        for normalized in expand_tag(tag):
            if normalized not in seen:
                result.append(normalized)
                seen.add(normalized)
    return result


def normalize_frontmatter(frontmatter: str) -> str:
    """Normalize block and JSON-style inline tag lists without reformatting YAML."""
    lines = frontmatter.splitlines(keepends=True)
    output = []
    index = 0

    while index < len(lines):
        line = lines[index]
        inline_match = re.match(r"^(\s*tags:\s*)\[(.*)\](\s*)$", line.rstrip("\n"))
        if inline_match:
            try:
                tags = ast.literal_eval(f"[{inline_match.group(2)}]")
            except (SyntaxError, ValueError):
                output.append(line)
                index += 1
                continue
            normalized = normalize_tags([str(tag) for tag in tags])
            newline = "\n" if line.endswith("\n") else ""
            output.append(f"{inline_match.group(1)}{json.dumps(normalized)}{inline_match.group(3)}{newline}")
            index += 1
            continue

        if re.match(r"^\s*tags:\s*$", line.rstrip("\n")):
            tags_line_at = len(output)
            output.append(line)
            index += 1
            seen = set()
            while index < len(lines):
                item_match = re.match(r"^(\s*-\s+)(.*?)(\s*)$", lines[index].rstrip("\n"))
                if not item_match:
                    break
                raw_tag = item_match.group(2)
                quote = raw_tag[0] if len(raw_tag) >= 2 and raw_tag[0] == raw_tag[-1] and raw_tag[0] in "\"'" else ""
                tag = raw_tag[1:-1] if quote else raw_tag
                newline = "\n" if lines[index].endswith("\n") else ""
                for normalized in expand_tag(tag):
                    if normalized in seen:
                        continue
                    rendered = f"{quote}{normalized}{quote}" if quote else normalized
                    output.append(f"{item_match.group(1)}{rendered}{item_match.group(3)}{newline}")
                    seen.add(normalized)
                index += 1
            # A bare `tags:` is null, which the schema rejects, so drop the key.
            if not seen:
                del output[tags_line_at]
            continue

        output.append(line)
        index += 1

    return "".join(output)


def process_file(filepath: Path, check: bool) -> bool:
    content = filepath.read_text(encoding="utf-8")
    match = re.match(r"^(---\s*\n)(.*?)(\n---\s*\n?)", content, re.DOTALL)
    if not match or "tags:" not in match.group(2):
        return False

    frontmatter = normalize_frontmatter(match.group(2))
    updated = content[: match.start(2)] + frontmatter + content[match.end(2) :]
    if updated == content:
        return False
    if not check:
        filepath.write_text(updated, encoding="utf-8")
    return True


REDIRECTS_FILE = Path("src/data/tag-redirects.json")


def read_raw_tags(content: str) -> list[str]:
    """Read the tags of one file without a YAML dependency (inline and block lists)."""
    match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return []
    tags: list[str] = []
    lines = match.group(1).splitlines()
    for index, line in enumerate(lines):
        inline = re.match(r"^tags:\s*\[(.*)\]\s*$", line)
        if inline:
            try:
                tags += [str(tag) for tag in ast.literal_eval(f"[{inline.group(1)}]")]
            except (SyntaxError, ValueError):
                pass
        elif re.match(r"^tags:\s*$", line):
            for item in lines[index + 1 :]:
                item_match = re.match(r"^\s*-\s+(.*?)\s*$", item)
                if not item_match:
                    break
                tags.append(item_match.group(1).strip("\"'"))
    return tags


def write_redirects(ref: str) -> None:
    """Record old tag -> current tag for every tag that existed at `ref` and has changed.

    The build turns these into 301s for the tag pages (src/utils/tag-redirects.ts). A null
    value means the tag was dropped. Pass the last deployed commit as `ref`; existing entries
    are kept and re-resolved, so redirect chains collapse.
    """
    with tempfile.TemporaryDirectory() as tmp:
        archive = subprocess.run(["git", "archive", ref, "src/content"], capture_output=True, check=True).stdout
        subprocess.run(["tar", "-x", "-C", tmp], input=archive, check=True)
        old_tags = {tag for path in Path(tmp, "src/content").rglob("*.md*") for tag in read_raw_tags(path.read_text(encoding="utf-8"))}

    mapping: dict[str, str | None] = json.loads(REDIRECTS_FILE.read_text()) if REDIRECTS_FILE.exists() else {}
    for tag in old_tags:
        mapping.setdefault(tag, tag)
    for tag in list(mapping):
        target = mapping[tag] or tag
        expanded = expand_tag(target)
        resolved = expand_tag(tag) if mapping[tag] is None or target == tag else expanded
        if not resolved:
            mapping[tag] = None
        elif resolved[0] != tag:
            mapping[tag] = resolved[0]
        else:
            del mapping[tag]
    REDIRECTS_FILE.write_text(json.dumps(dict(sorted(mapping.items(), key=lambda i: i[0].casefold())), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(mapping)} tag redirects written to {REDIRECTS_FILE}.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="report files that need normalization without writing them")
    parser.add_argument("--redirects-from", metavar="GIT_REF", help="write src/data/tag-redirects.json for tags that existed at this ref")
    args = parser.parse_args()
    if args.redirects_from:
        write_redirects(args.redirects_from)
        return

    content_dir = Path("src/content")
    files = sorted([*content_dir.rglob("*.md"), *content_dir.rglob("*.mdx")])
    changed = [filepath for filepath in files if process_file(filepath, args.check)]

    action = "need updates" if args.check else "updated"
    print(f"{len(changed)} of {len(files)} content files {action}.")
    for filepath in changed:
        print(filepath)

    if args.check and changed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
