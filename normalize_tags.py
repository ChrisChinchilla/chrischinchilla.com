#!/usr/bin/env python3
"""
Normalize all tags in blog posts to title case with proper handling of acronyms and brand names.
"""

import os
import re
from pathlib import Path

# Tag normalization mapping with proper brand names and acronyms
TAG_MAPPING = {
    # Acronyms - keep uppercase
    "ai": "AI",
    "api": "API",
    "cd": "CD",
    "ci": "CI",
    "ide": "IDE",
    "iot": "IoT",
    "ui": "UI",
    "ios": "iOS",
    # Brand names - official capitalization
    "github": "GitHub",
    "jetbrains": "JetBrains",
    "kubecon": "KubeCon",
    "macos": "macOS",
    # Regular title case
    "devops": "DevOps",
    "kubernetes": "Kubernetes",
    "blockchain": "Blockchain",
    "cloud": "Cloud",
    "events": "Events",
    "development": "Development",
    "security": "Security",
    "containers": "Containers",
    "android": "Android",
    "observability": "Observability",
    "startups": "Startups",
    "documentation": "Documentation",
    "conferences": "Conferences",
    "apple": "Apple",
    "docker": "Docker",
    "writing": "Writing",
    "art": "Art",
    "automation": "Automation",
    "browsers": "Browsers",
    "community": "Community",
    "databases": "Databases",
    "design": "Design",
    "emulation": "Emulation",
    "europe": "Europe",
    "event": "Event",
    "fiction": "Fiction",
    "google": "Google",
    "homebrew": "Homebrew",
    "markdown": "Markdown",
    "messaging": "Messaging",
    "mobile": "Mobile",
    "mwc": "MWC",
    "news": "News",
    "privacy": "Privacy",
    "productivity": "Productivity",
    "programming": "Programming",
    "ruby": "Ruby",
    "sustainability": "Sustainability",
    "technology": "Technology",
    "testing": "Testing",
    "tools": "Tools",
    "trends": "Trends",
    "virtualization": "Virtualization",
    # Multi-word phrases
    "open source": "Open Source",
    "operating systems": "Operating Systems",
    "cloud native": "Cloud Native",
    "flink community": "Flink Community",
    "machine learning": "Machine Learning",
    "text editor": "Text Editor",
    "use cases": "Use Cases",
    "virtual machines": "Virtual Machines",
}


def normalize_tag(tag):
    """Normalize a single tag to proper case."""
    # First check exact lowercase match in mapping
    tag_lower = tag.lower()
    if tag_lower in TAG_MAPPING:
        return TAG_MAPPING[tag_lower]

    # If not in mapping, apply title case
    return tag.title()


def extract_frontmatter_and_content(file_content):
    """Extract YAML frontmatter and content from a markdown file."""
    # Match frontmatter between --- markers
    pattern = r"^---\s*\n(.*?)\n---\s*\n(.*)"
    match = re.match(pattern, file_content, re.DOTALL)

    if match:
        return match.group(1), match.group(2)
    return None, file_content


def normalize_tags_in_frontmatter(frontmatter):
    """Normalize tags in YAML frontmatter."""
    # Find tags section
    tags_pattern = r"(tags:\s*\n(?:  - .+\n)+)"

    def replace_tags(match):
        tags_section = match.group(1)
        lines = tags_section.split("\n")
        result_lines = [lines[0]]  # Keep "tags:" line

        for line in lines[1:]:
            if line.strip().startswith("- "):
                # Extract tag value
                tag_match = re.match(r"(\s+- )(.+)", line)
                if tag_match:
                    indent = tag_match.group(1)
                    tag = tag_match.group(2).strip()
                    normalized = normalize_tag(tag)
                    result_lines.append(f"{indent}{normalized}")
            elif line:
                result_lines.append(line)

        return "\n".join(result_lines) + "\n"

    return re.sub(tags_pattern, replace_tags, frontmatter)


def process_file(filepath):
    """Process a single markdown file to normalize tags."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        frontmatter, body = extract_frontmatter_and_content(content)

        if frontmatter is None:
            print(f"⚠️  No frontmatter found in {filepath}")
            return False

        # Check if file has tags
        if "tags:" not in frontmatter:
            return False

        # Normalize tags
        new_frontmatter = normalize_tags_in_frontmatter(frontmatter)

        # Only write if changed
        if new_frontmatter != frontmatter:
            new_content = f"---\n{new_frontmatter}---\n{body}"
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            return True

        return False

    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return False


def main():
    """Main function to process all markdown files."""
    posts_dir = Path("src/content/posts")

    if not posts_dir.exists():
        print(f"❌ Directory not found: {posts_dir}")
        return

    # Find all markdown files
    md_files = list(posts_dir.rglob("*.md")) + list(posts_dir.rglob("*.mdx"))

    print(f"Found {len(md_files)} markdown files")
    print("=" * 60)

    updated_count = 0

    for filepath in sorted(md_files):
        if process_file(filepath):
            updated_count += 1
            print(f"✅ Updated: {filepath.relative_to(posts_dir)}")

    print("=" * 60)
    print(f"\n✨ Complete! Updated {updated_count} files with normalized tags.")


if __name__ == "__main__":
    main()
