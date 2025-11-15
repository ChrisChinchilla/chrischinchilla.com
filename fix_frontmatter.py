#!/usr/bin/env python3
"""
Fix YAML frontmatter where closing --- is on the same line as the last field.
Changes patterns like "field: value---" to "field: value\n---"
"""

import os
import re
from pathlib import Path


def fix_frontmatter(content):
    """Fix frontmatter with missing line break before closing ---"""
    # Pattern to match .--- or any character followed by --- without a newline
    pattern = r"([^\n])---\n"

    # Replace with the character, newline, then ---
    fixed = re.sub(pattern, r"\1\n---\n", content, count=1)

    return fixed


def process_file(filepath):
    """Process a single markdown file to fix frontmatter."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Check if file has the issue
        if re.search(r"[^\n]---\n", content):
            fixed_content = fix_frontmatter(content)

            # Only write if changed
            if fixed_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(fixed_content)
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

    fixed_count = 0

    for filepath in sorted(md_files):
        if process_file(filepath):
            fixed_count += 1
            print(f"✅ Fixed: {filepath.relative_to(posts_dir)}")

    print("=" * 60)
    print(f"\n✨ Complete! Fixed {fixed_count} files with frontmatter issues.")


if __name__ == "__main__":
    main()
