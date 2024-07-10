---
title: 'WikiMedia Game Jam, T-Shirts, Printing Experiments and so much more'
publishDate: '2015-10-26'
categories:
 - projects
 - chipshop
image: "../../../assets/images/articles/cs_tshirt.jpg"
---

Pushing forward to play testing (which has now begun, more on that later) I have been busy cleaning, tidying and streamlining game components after Essen. Here are some updates...

## Website tweaks and T-Shirts
If you visit the [website](https://chipshopgame.com), you will notice the new typed text intro. This ties in with a T-Shirt I had made for Essen and will be available soon alongside some other merchandise. For the typed text effect, I initially looked at CSS3 options, but none of them worked well with larger amounts of text, so I opted for [Typed.js](https://github.com/mattboldt/typed.js/). I updated template files so that the home page loads one [template](https://github.com/GregariousMammal/Chip-Shop/blob/master/index.html) that includes the JavaScript call, and it's not present on any other page. As you can see from the file, the JavaScript initialisation is simple, setting the html, speed and cursor displayed.

I updated the [cards](https://chipshopgame.com/cards/), [manual and concepts](https://chipshopgame.com/manual/) pages to be more visually appealing. There will be more to come as I plan to have different designs for each section, for example the manual page should look like an old computer manual and the store page should look like an old computer store.

## Manual and Concepts
In preparation for the print versions of the manual and concepts pages (part of the manual) I updated the build script and created latex templates. The [build process](https://github.com/GregariousMammal/Chip-Shop/blob/master/build.sh) for these new pages is simpler than the cards as the manual is just one markdown file and the concepts are generated in a similar way to the game cards, i.e. multiple items on one page of A4. The [Concept](https://github.com/GregariousMammal/Chip-Shop/blob/master/_layouts/concepts.latex) and [Manual](https://github.com/GregariousMammal/Chip-Shop/blob/master/_layouts/manual_print.latex) latex files are simple at the moment, the manual template still needs work to handle page breaks and section numbering correctly.

## Other Print and Card Updates
Lots of small changes here.

- Removed the table layout of costs and scores in preparation for replacing them with icons.
- Added Concepts list to cards, these will be icons in the future.
- Created duplicate versions of many cards, to represent more common events and products.
- I tried to fix a problem with using the custom VT323 font displaying missing symbols. I initially thought it was a Pandoc / LaTeX error but it was due to the font being missing certain common symbols. For the print cards I have reverted to the default font for now and will revisit later.
- Streamlining lots of cards and breaking out text into concepts.
- Probably loads more small changes, if you're interested, then [read the project commit messages here](https://github.com/GregariousMammal/Chip-Shop/commits/master).

### Double Sided Printing
At some point, the playing cards will need to be double sided and with LaTeX, this was straightforward. You amend the document class:

```LaTeX
\documentclass[twoside]{article}
```

Add the page break and what you want to display after it.

```LaTeX
\pagebreak
\begin{flushleft}
  $cardtype$
\end{flushleft}
```

Then I realised that during play testing, not everyone will be able to print double sided cards, so I removed the functionality for now and will return to it later.

## Wikimedia Free Knowledge Game Jam
As a lot of the Chip Shop game components are using information from Wikipedia I thought I would attend a [game jam running this weekend](https://blog.wikimedia.de/2015/09/21/free-knowledge-game-jam/). I wanted to automate a lot of the manual process of creating cards, thinking I could query a Wikipedia API to find all computer products from particular eras and generate placeholder markdown files to flesh out later.

Turns out this wasn't so simple and that all Wiki data is not created equal. I wont go into great detail here, but the process wouldn't be possible without a lot of work, that I deemed not worthwhile at the moment. Still it was fun digging beneath the surface of Wikipedia and seeing how it works.

## Play Testing
IS OPEN! [Get started now](https://gregariousmammal.com/playtesting-chip-shop/).
