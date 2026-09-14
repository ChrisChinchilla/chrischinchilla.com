---
title: How I sync applications between Macs using Homebrew
publishDate: 2026-09-11T00:00:00.000Z
author: Chris Ward
categories:
  - tech
tags:
  - Homebrew
  - macOS
  - Productivity
image: /articles/brew-chinchillas.png
summary: >-
    How I attempted to sync applications between Macs using Homebrew and Brewfiles.
---

For a while, I have been using the [`brew bundle`](https://docs.brew.sh/Brew-Bundle-and-Brewfile) command to create a bundle file of everything installed with Homebrew. Then, by checking it into version control, I can use `brew bundle` on the other computer to install everything. Often I don't want to have every formula on both machines. For example, I don't want to install some audio applications on my laptop that I only use on my desktop Mac.

It's also worth noting that the resulting Brewfile from a `brew bundle` command can contain installation candidates for Mac App Store apps, WinGet packages on WSL, VS Code extensions, Go packages, Cargo packages, npm packages, uv tools, Flatpak packages and krew kubectl plugins. This means it's a good way to keep a list of all sorts of things in sync.

What I wanted was a way to specify a core list of items to install, and then specify which items to install only on a certain computer. This led me to think about "tagging" formulas with something like a machine identifier, and I posted in [the Homebrew GitHub discussions](https://github.com/orgs/Homebrew/discussions/6291) for ideas. This wasn't possible, but if you didn't know, Brew formulas and bundle files use Ruby as the domain-specific language (DSL), so in theory, you can manipulate them programmatically to suit your needs, which is what I ended up doing. There's a little bit to make this work, so here's what I implemented and what I changed as I tested it.

## First the `Brewfile`s

One of the great aspects of how `brew bundle` works is that it only installs a formula if it's missing or out of date on a machine. Installing the same formula repeatedly is not a problem. This is a feature I have also often found useful when setting up a new machine and running many install commands. If something fails, you restart the process, and Homebrew picks up where it left off.

For my setup, I needed three Brewfiles:

- _Brewfile.miniChinch_: Formulas just for my Mac mini. The suffix matches the machine's hostname.
- _Brewfile.ChinchPro_: Formulas just for my MacBook Pro. The suffix matches the machine’s hostname.
- _Brewfile.common_: Formulas shared between the two machines

Splitting out the dependencies between files takes time, but because of how the bundle command works, as I mentioned above, it doesn't matter in the meantime.

The `brew bundle` command won't recognise any of these files. It only works with a `Brewfile`, and that is where we use Ruby's underpinnings.

```ruby
# path/to/Brewfile
def load_brewfile(name)
  path = File.join(__dir__, name)
  instance_eval(File.read(path), path) if File.exist?(path)
end

load_brewfile("Brewfile.common")

hostname = `hostname -s`.strip
load_brewfile("Brewfile.#{hostname}")
```

This loads _Brewfile.common_ first, then loads any other Brewfile that matches the hostname, so on each machine you end up with a combination of the two Brewfiles returned to the `brew bundle` command.

## Keeping the `Brewfile`s in sync

So far so good, but I didn't want to change my daily experience installing and uninstalling formula, so I needed two scripts to be able to continue this.

- One to check when installed formulas drifted from the Brewfile.
- One to regularly sync the various `Brewfile`s between the two machines using git.

This is the sync script, which runs a git pull, installs any changes, and displays a notification.

```sh
#!/bin/zsh
set -e

# launchd runs this as a non-interactive login shell, which never sources
# ~/.zshrc — so Homebrew's PATH entry (set there) isn't present. Set it
# explicitly rather than depending on shell-rc sourcing.
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"

cd ~/path/to/home-folder/homebrew

# Ensure repo is up to date 
git pull --rebase --autostash
# Install any changes to the Homebrew file
brew bundle install --file=./Brewfile
# Display a notification
osascript -e 'display notification "Brew bundle synced" with title "brew-sync"' 2>/dev/null || true
```

The drift, or triage, script is more complex. Again, it updates from GitHub, parsing the Brewfiles to find items installed locally that aren’t in a Brewfile, and then asking which Brewfile to add them to.

```sh
#!/usr/bin/env zsh
# ~/path/to/script/brew-triage.sh
set -e

# launchd runs this as a non-interactive login shell, which never sources
# ~/.zshrc — so Homebrew's PATH entry (set there) isn't present. Set it
# explicitly rather than depending on shell-rc sourcing.
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"

# Move to brew files
REPO=~/path/to/home-folder
BREWDIR="$REPO/homebrew"

# Built from $REPO, before cd'ing into $BREWDIR: the glob below is resolved
# relative to the current directory, and must match repo-root-relative paths
# since that's what `git add`/`git status` expect later.
cd "$REPO"
BREW_PATHS=(homebrew/Brewfile homebrew/Brewfile.*(N))

cd "$BREWDIR"

# Pull first so not committing on top of stale history
git -C "$REPO" pull --rebase --autostash

# --- triage step (same as before) ---
brew bundle dump --file=/tmp/Brewfile.current --force

cat Brewfile.common Brewfile.*(N) 2>/dev/null | grep -E '^(brew|cask) ' | sort -u > /tmp/tracked.txt
grep -E '^(brew|cask) ' /tmp/Brewfile.current | sort -u > /tmp/current.txt
comm -23 /tmp/current.txt /tmp/tracked.txt > /tmp/untracked.txt

typeset -a additions   # track what we add, for the commit message

if [[ -s /tmp/untracked.txt ]]; then
  echo "Untracked packages found:"
  while read -r line <&3; do
    echo "  $line"
    # Ask where to add untracked package
    read "target?  → which file (common/ChinchPro/miniChinch/skip)? "
    [[ "$target" == "skip" ]] && continue
    echo "$line" >> "Brewfile.$target"
    additions+=("$line -> Brewfile.$target")
  done 3< /tmp/untracked.txt
else
  echo "Nothing untracked."
fi

# --- commit + push, scoped ONLY to the Brewfile paths ---
cd "$REPO"

if [[ -n $(git status --porcelain -- "${BREW_PATHS[@]}") ]]; then
  git add -- "${BREW_PATHS[@]}"

  if [[ ${#additions[@]} -gt 0 ]]; then
    msg="brew: add $(IFS=, ; echo "${additions[*]}")"
  else
    msg="brew: sync Brewfile changes from $(hostname -s)"
  fi

  git commit -m "$msg" -- "${BREW_PATHS[@]}"
  git push
  echo "→ committed and pushed: $msg"
else
  echo "No Brewfile changes to commit."
fi
```

Great, but remembering to manually run two scripts doesn't help much. Enter the wonderful and much-underused world (on macOS, at least) of [launchd](https://en.wikipedia.org/wiki/Launchd). Typically added by macOS and 3rd-party apps, launchd lets you run a script periodically in the background, generally without user interaction. Less known is that you can also add your own scripts to do whatever you want.

For these scripts, the code is fairly simple.

The sync launchd script, named _com.chrischinchilla.brewsync.plist_, which you should update to match your own name, runs every day at 11 am. It also logs errors to the _/tmp/_ directory.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
  <key>Label</key><string>com.chrischinchilla.brewsync</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>-lc</string>
    <string>~/path/to/script/brew-sync.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>11</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>/tmp/brewsync.log</string>
  <key>StandardErrorPath</key><string>/tmp/brewsync.log</string>
</dict>
</plist>
```

The triage launchd script, with the file name _com.chrischinchilla.brewtriage.plist_ runs every day at 3pm:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
  <key>Label</key><string>com.chrischinchilla.brewtriage</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>-lc</string>
    <string>~/Workspace/home-folder/bin/brew-triage.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>15</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>/tmp/brewtriage.log</string>
  <key>StandardErrorPath</key><string>/tmp/brewtriage.log</string>
</dict>
</plist>
```

Move both of these files to _~/Library/LaunchAgents_, macOS uses the terms LaunchAgents and LaunchDaemons interchangeably, but typically LaunchAgents are used for user-level scripts. Logging out and logging back in, or restarting, is enough to get the scripts running, or if you want to do it manually, you can use:

```sh
launchctl bootstrap gui/$(id -u) <Script>
```

## Does it work?

After some trial and error, the process does work as expected. The biggest annoyance is that launchd only runs LaunchAgents when the machine is awake. I am not too fussed if they don't run every day. A couple of times a week is enough, and as it requires human input to select the Brewfile location anyway, I think it is enough to keep the machines in reasonable sync, but it is easy to forget it hasn't run for a while and thus defeat the whole of the exercise in the first place. I have found myself running the scripts manually instead, which is a reasonable workaround. It's not perfect, but it's getting there.