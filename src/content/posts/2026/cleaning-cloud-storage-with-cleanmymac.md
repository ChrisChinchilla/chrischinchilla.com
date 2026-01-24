---
title: Cleaning Cloud Storage with CleanMyMac
publishDate: 2026-01-24T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - Mac
  - Mac Utilities
  - Cloud Storage
  - Maintenance
image: articles/cleaning-chinchilla.png
summary: >-
  CleanMyMac has long been a go-to tool for macOS maintenance, but its recent addition of cloud storage cleanup is worth examining. In this post, I test the new feature to see how well it helps manage cloud storage across services like iCloud and Google Drive, and whether it's a useful addition or just a gimmick.
heroimage: articles/cleaning-chinchilla.png
herotext: >-
  Evaluating CleanMyMac's new cloud storage cleanup feature to see if it effectively helps manage and declutter files across popular cloud services.
---

[CleanMyMac](https://go.chrischinchilla.com/cleanmymac) has existed for a few years as a maintenance tool for macOS, handling everything from disk cleanup to malware detection. Generally, I am a fan of it, despite often wondering if some of what it recommends is necessary. Still, a lot of modern applications are terrible at cleaning up after themselves, and I am obsessed with digital cleanliness, so…

Recently, they added a feature that extends this cleaning capability to cloud storage. I tested it to see if it's useful.

## What CleanMyMac offers

For context, [CleanMyMac](https://go.chrischinchilla.com/cleanmymac) provides several maintenance features:

- **Scan**: A combined check that runs multiple diagnostics
- **Cleanup**: Finds files you can remove to free up space
- **Protection**: Malware and threat detection
- **Performance**: Maintenance tasks like DNS cache clearing and periodic scripts
- **Applications**: Updates and uninstalls, including leftover files
- **Space Lens**: Shows what's consuming disk space

The cloud cleanup feature is the newest addition. It currently supports three services: Google Drive, iCloud, and OneDrive.

## How Cloud Cleanup works

I tested the feature with iCloud and two Google Drive accounts. The interface shows files with icons indicating whether they're stored locally, in the cloud, or both. "Locally" can depend on the storage provider, for example, iCloud natively integrates with macOS Finder, while Google Drive depends on the sync client used. For many years, I have used [Insync](https://www.insynchq.com/) instead of Google's official client, which CleanMyMac doesn't recognize, so it only shows files synced by the official app.

### iCloud

I use iCloud extensively across multiple Macs, an iPad, and iPhone. This makes file access seamless, though I keep some folders like music projects downloaded locally because I or certain applications need immediate access.

macOS buries iCloud's actual storage location in *\~/Library/Mobile Documents/com\~apple\~CloudDocs/*. I once accidentally deleted this folder not realizing what it was, not my finest moment, but I managed to recover most files.

The scan took a while because I have a lot stored in iCloud. When finished, it categorized files into:

- Locally synced files (34.4 GB)
- Large locally synced files (13.2 GB)
- Large cloud files (4 GB)

The distinction between these categories wasn't immediately clear. More importantly, the tool doesn't show hidden application data that accumulates in iCloud. Depending on the OS, often under iCloud Storage Management, you can find apps like WhatsApp consuming nearly a gigabyte, or other apps with unexpectedly large footprints. [CleanMyMac](https://go.chrischinchilla.com/cleanmymac) doesn't surface these at all.

When reviewing files for deletion, I was cautious. It marked some items as "essential" because they sync system folders like Documents. The tool did show large files, but it wasn't revealing anything I couldn't find through Finder with some manual searching.

One odd issue was that it misidentified an Ableton project file as an archive file, suggesting the categorisation logic needs work.

### Google Drive

Google Drive was more straightforward since I don't use Google's desktop sync client. I use an alternative called [Insync](https://www.insynchq.com/), but [CleanMyMac](https://go.chrischinchilla.com/cleanmymac) doesn't detect those locally synced files, it only sees what the official Google Drive app would sync.

The scan found less than 3 GB used out of 16 GB total. Most files were audio files, Ableton projects shared with collaborators, and old client work. I could definitely clean up some folders, like archived project versions or audio files from past events.

It has one major limitation in my opinion. It doesn't show native Google Docs files, which is possibly some sort of API limitation. Only files uploaded to Drive (like .docx, .pdf, or audio files) appeared. While Google Docs files don't typically consume much space, this means you're not seeing a complete picture of your storage.

## Limitations of CleanMyMac's Cloud Cleanup

Several limitations became apparent during testing:

1. **No cross-service view**: You must check each cloud service individually. There's no way to see all your cloud storage at once or identify duplicate files across services.

2. **Missing services**: Dropbox isn't supported, and that's a major omission since Dropbox free accounts have limited space and fill up quickly.

3. **No hidden app data**: The tool doesn't surface application storage in iCloud that you can only see through System Settings.

4. **No native cloud files**: Google Docs, Sheets, and similar native cloud documents don't appear.

5. **Limited categorization feedback**: The view doesn't clearly show which files are local versus cloud-only when browsing the file list.

6. **Uncertain safe deletion**: As with many cleanup tools, you sometimes hesitate to delete files because you're not entirely sure what they are or what depends on them.

## Is It Useful?

The Cloud Cleanup feature is a start, but it doesn't go as far as CleanMyMac's local cleanup capabilities. For power users who already maintain their cloud storage, it doesn't reveal much you couldn't find manually. The missing services, inability to see native cloud documents, and lack of cross-service analysis limit its usefulness.

That said, if you already use [CleanMyMac](https://go.chrischinchilla.com/cleanmymac) for local maintenance and want a quick overview of your cloud storage without opening multiple web interfaces, it provides some convenience. Just don't expect the same depth you get with the tool's local features.

The limitations likely stem from API access constraints, MacPaw can only work with what the cloud providers make available. Hopefully, they'll expand support and add more sophisticated analysis in future updates.

If you want to try [CleanMyMac](https://go.chrischinchilla.com/cleanmymac), the Cloud Cleanup feature is included with the standard subscription. Just set your expectations accordingly: it's a nice addition, but not a comprehensive cloud storage management solution.