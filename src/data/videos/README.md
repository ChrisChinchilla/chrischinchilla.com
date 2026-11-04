# Per-video data

One `<youtubeId>.json` per video that is the canonical video of (or related to) an article.
Article pages read this instead of the YouTube API, so they build the same without `GOOGLE_API`.

```json
{
  "title": "Video title as on YouTube",
  "uploadDate": "2026-01-13T00:15:04Z",
  "duration": "PT12M10S",
  "transcriptSource": "auto-generated"
}
```

- `transcriptSource` is `auto-generated` (YouTube captions, not proofread) or `edited`. It is shown
  to readers above the transcript and exposed to agents.
- An optional `<youtubeId>.transcript.md` holds the transcript, one line per caption in the form
  `[m:ss] text` (or `[h:mm:ss]`). The timestamps become links to that moment in the video.
- Chapters are not stored here: they are read from the timestamps in the YouTube description
  (when the playlist can be fetched at build time).
- Only 11-character YouTube IDs; see `youtubeId` / `relatedYoutubeIds` in `src/content.config.ts`.

Videos that are also podcast episodes are never paired: list them in
`src/data/video-matching-ignore.json` and set `youtubeId: false` on their article.
