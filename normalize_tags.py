#!/usr/bin/env python3
"""Consolidate high-confidence tag aliases across all content collections."""

import argparse
import ast
import json
import re
from pathlib import Path


# Keep this deliberately conservative. Tags only belong here when they differ
# by casing, punctuation, plurality, a clear typo, or an established synonym.
TAG_GROUPS = {
    "Android": ["android", "anroid"],
    "API": ["api", "apis"],
    "AR": ["ar"],
    "AsciiDoc": ["asciidoc"],
    "Atom": ["atom"],
    "Audio": ["audio"],
    "Automation": ["automation"],
    "Bare Metal": ["bare metal"],
    "Best Practices": ["best practice", "best practices", "best practises"],
    "Blockchain": ["blockchain"],
    "Board Games": ["boardgames", "board games"],
    "Books": ["books"],
    "Bots": ["bot", "bots"],
    "Browsers": ["browser", "browsers"],
    "Chatbots": ["chatbot", "chatbots"],
    "CiviCRM": ["civicrm"],
    "Cloud": ["cloud"],
    "Cloud Native": ["cloud native", "cloud-native"],
    "CMS": ["cms"],
    "Communication": ["communication"],
    "Community": ["community"],
    "Conferences": ["conference", "conferences"],
    "Containers": ["containers"],
    "Continuous Delivery": ["continuous delivery", "continous delivery"],
    "Continuous Deployment": ["continuous deployment", "continious deployment"],
    "Continuous Integration": ["continuous integration", "continious integration"],
    "Cross-platform": ["cross platform", "cross-platform"],
    "Culture": ["culture"],
    "Databases": ["database", "databases"],
    "Developer Experience": ["developer experience", "dx"],
    "Developer Tools": ["developer tools"],
    "Developers": ["developer", "developers"],
    "Development": ["development"],
    "DevOps": ["devops"],
    "Docker": ["docker"],
    "Documentation": ["documentation"],
    "Editing": ["editing"],
    "Ethereum": ["ethereum"],
    "Ethics": ["ethics"],
    "Events": ["event", "events"],
    "Fiction": ["fiction"],
    "Game Design": ["game design", "gamedesign"],
    "Games": ["games"],
    "GitHub": ["github"],
    "GraphQL": ["graphql", "qraphql"],
    "Great Idea": ["greatidea", "great idea"],
    "HTML": ["html"],
    "Humor": ["humor", "humour"],
    "IFA": ["ifa"],
    "IoT": ["iot"],
    "Java": ["java"],
    "JavaScript": ["javascript"],
    "Jekyll": ["jekyll"],
    "JetBrains": ["jetbrains"],
    "Kubernetes": ["kubernetes"],
    "Languages": ["language", "languages"],
    "Life": ["life"],
    "Links": ["links"],
    "Linting": ["linting"],
    "Logging": ["logging"],
    "macOS": ["macos"],
    "Maintenance": ["maintenance", "maitenance"],
    "Markdown": ["markdown"],
    "Meetups": ["meetups"],
    "Merchandise": ["merchandise"],
    "MicroK8s": ["microk8", "microk8s"],
    "Microservices": ["microservice", "microservices"],
    "Mobile": ["mobile"],
    "Multi-cloud": ["multi cloud", "multi-cloud"],
    "Music": ["music"],
    ".NET": [".net"],
    "News": ["news"],
    "Observability": ["observability"],
    "Open Source": ["open source", "open souce"],
    "Operating Systems": ["operating systems"],
    "PHP": ["php"],
    "Playtesting": ["playtesting"],
    "Podcasting": ["podcasting"],
    "Podcasts": ["podcast", "podcasts"],
    "Presentations": ["presentations", "presenations"],
    "Productivity": ["productivity", "prodictivity"],
    "Programming": ["programming"],
    "PromQL": ["promql"],
    "Reviews": ["review", "reviews"],
    "Science Fiction": ["science fiction", "sci-fi", "scifi"],
    "SDK": ["sdk"],
    "Security": ["security"],
    "Services": ["service", "services"],
    "Smart Contracts": ["smart contract", "smart-contract", "smart contracts"],
    "Snaps": ["snap", "snaps"],
    "Social Media": ["socialmedia", "social media"],
    "Software Development": ["software development"],
    "Sports": ["sport", "sports"],
    "Sustainability": ["sustainability"],
    "Tech": ["tech"],
    "Technical Writing": ["technical writing", "techwriting", "tech writing"],
    "Technology": ["technology"],
    "Text Editors": ["text editor", "text editors", "texteditors"],
    "Time-series Data": ["time series data", "time-series data"],
    "Tokens": ["token", "tokens"],
    "Tools": ["tools"],
    "Tutorials": ["tutorial", "tutorials"],
    "Version Control": ["version control"],
    "Video": ["video"],
    "Visualization": ["visualization"],
    "WASM": ["wasm"],
    "Web": ["web"],
    "Web Development": ["web dev", "web development"],
    "Writing": ["writing"],
    "Writing Tools": ["writing tool", "writing tools"],
}

TAG_ALIASES = {
    alias.casefold(): canonical
    for canonical, aliases in TAG_GROUPS.items()
    for alias in {canonical, *aliases}
}


def normalize_tag(tag: str) -> str:
    """Return the canonical form of a known tag and preserve unknown tags."""
    stripped = tag.strip()
    return TAG_ALIASES.get(stripped.casefold(), stripped)


def normalize_tags(tags: list[str]) -> list[str]:
    """Normalize tags and remove aliases that collapse to a duplicate."""
    result = []
    seen = set()
    for tag in tags:
        normalized = normalize_tag(tag)
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
                normalized = normalize_tag(tag)
                if normalized not in seen:
                    newline = "\n" if lines[index].endswith("\n") else ""
                    rendered = f"{quote}{normalized}{quote}" if quote else normalized
                    output.append(f"{item_match.group(1)}{rendered}{item_match.group(3)}{newline}")
                    seen.add(normalized)
                index += 1
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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="report files that need normalization without writing them")
    args = parser.parse_args()

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
