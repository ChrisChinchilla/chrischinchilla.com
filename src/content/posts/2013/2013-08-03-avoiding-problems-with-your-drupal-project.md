---
title: Avoiding problems with your Drupal project
publishDate: 2013-08-03T07:54:23.000Z
image: /src/assets/images/articles/druplicon_sad.png
categories:
  - writing
  - chrischinchilla
summary: >-
  Over the past year I've been slowly building a list of gotchas, mistaken
  assumptions and potential slip ups that have hit projects I've been involved
  with several times, or seemed so blindingly obvious after the moment that they
  just had to be documented. This is one of the many articles I have that may
  grow over time as I discover more useful tidbits.
---

Over the past year I've been slowly building a list of gotchas, mistaken assumptions and potential slip ups that have hit projects I've been involved with several times, or seemed so blindingly obvious after the moment that they just had to be documented. This is one of the many articles I have that may grow over time as I discover more useful tidbits.

Some of these are more generic to suit any website development project whilst others are very specific to Drupal based projects, which is the main platform projects I'm involved with utilise, I'll try to mark those as we go.

## Assumptions
### Get to know industry more
As web developers we are often called to work on projects in industries that we know absolutely nothing about and whilst we may make lengthy business analyses about our clients, often some really obvious assumptions can be overlooked. For example we recently worked on a site for an engineering supplier, treating it like a standard ecommerce site, but of course, who would drop by a site and on a whim depart with several thousand for a complex, custom and site specific piece of machinery.

Get to know not only a clients business, but also their world, the terminology they use, the slang, common practises that seem extremely obvious to them and perhaps even more crucially for what we do... The browsers they use.

## Servers
Is the setup for the web servers being used throughout the project for local development, testing and production the same? If not, what are the differences, will these affect anything you're doing? Who is responsible for maintaining and backing up these servers?

## Design
Here's a great post on designing for Drupal, learning to better understand it's structure so it doesn't obstruct what you do.

[www.chapterthree.com/blog/nica_lorber/design_drupal_template_approach](https://www.chapterthree.com/blog/nica_lorber/design_drupal_template_approach)

## Development
These aren't necessarily in any particular order, but are various pointers picked up along the way.

### Listings of events
If creating listings of events, the default sort order of most content listings will be the date created, but of course, events have their own date component and the chances are that a site will need to order events in a particular way such as the order they are occurring in or vice versa.

### Views list sorting
Often listings created in Drupal views will default to alphabetical or date created order, however, quite often clients will have a very particular order they are expecting or anticipating listings to be in, such as importance or department. So before building listings, ensure you ask a client what ordering they are expecting, or even better, give them the ability to order them themselves, through access to views or something like the draggable views module.

### Views listings will probably need editable introductions
Views is a great way to create listings of content, but generally a client will require that these listings have some kind of explanation or context for site visitors. You could give content administrators access to the view and allow them to amend header text or instead, create pages with context or panels to display the view as a block and the introductory text a normal node and this easily part of the editorial workflow.

### Typekit problems with Internet Explorer 8 and lower
We've noticed this on several sites that utilise TypeKit, when Internet Explorer 8 and below renders many fonts all in italics. I wont bother explaining it all here, but take a look at the link below.

<a href="https://drupal.org/node/1936340" style="line-height: 1.538em;">drupal.org/node/1936340</a>

### WYSIWYGs
'What You See Is What You Get' editors are a popular and convenient way of editing content but are prone to many configuration issues and assumptions from all sides, with developers wanting to limit what clients can do and clients wanting to do as much as possible. The real nitty gritty of this may vary from project to project, but here's a few features we've found clients always want and expect, so save yourself some hassle by just setting them up in the first place, unless you have a very good reason not to (with all of these there are several ways to achieve them, I shall leave the preferred implementation up to you).<ul><li>The ability to upload files inline into a WYSIWYG, not upload separately and enter a file's path, but directly uploading a file, adding a link and everything to work.</li><li>Much like above, the ability to upload images directly into a WYSIWYG. When allowing this functionality you will need to think about file sizes, image sizes, image layouts and many other factors. This may all seem like a lot of work, but content editors will want to be able to edit content the way they want to and it's up to you to find a way that can be accommodated stably, once you've got it right once, it can generally be rolled out across all projects.</li><li>Content editors expect to be able to create links to external content content internal to the site, so when setting up links within a WYSIWYG, try adding the facility to be able to link easily to internal site content, preferably though some sort of picker or autocomplete widget.</li><li>Don't allow  tags in your WYSIWYG fields.</li></ul>

### Forms
Do forms have email recipients? Who should they be?

### Spam protection
All forms will probably need some form of spam protection, probably best for your future sanity to just enable it on all forms in some way.

### Email templates
User registrations, store orders, password changes etc. all send emails, the contents and look of those emails may not suit a client, make sure they've all been gone through and changed accordingly.

### Some other useful resources_<ul><li>www.webdevchecklist.com</li></ul>
## Going Live
### SSL / Certificates
If your site requires any secure areas, don't forget to set up SSL certificates, enable secure urls where needed and test that everything still works once it's all in place.

### DNS Changes
When sites go live they will generally need some DNS changes to happen at some point, so make sure you allow enough time for these to propagate through the web. Equally, make sure that all versions of the website address work as expected, 'www.', non www and any subdomains.

### Caching
Most would know that caching should be enabled once a site goes into production, but not wanting to go into masses of details on caching techniques, there are a few pitfalls. Firstly, tell clients what caching is, how it works and why it's used. Frequently (using default caching options in Drupal) clients will be confused when adding new content or making small layout changes and wondering why it isn't showing immediately. Perhaps consider custom hooks to clear content caches when adding new content or simply providing a button for content editors to do it themselves, again, making them aware of the implications of doing so.

### Cron
Don't forget to turn cron on. Also, test what happens when cron does run, do expected things happen and do unexpected things not happen?

### Turn off environment indicator
Were you using the Drupal environment indicator module during development? I would recommend you turn it off on production sites as clients constantly wonder what the coloured bar is doing there.

### Using external services?
Things like newsletters, logging services etc. You may have been using test email addresses and settings, don't forget to switch them to the real account details.

### Time Zones
Are your timezones set correctly for the main site, subsites, user accounts etc?

## Security
### Change your administrator usernames
Usernames like 'admin', 'administrator' etc are not secure usernames for powerful admin accounts and will be easily guessed by automated hacking systems. Change them as soon as you can.

### Be careful of hostnames in MYSQL grant statements
Generally it's too easy to just create MySQL users who can access your database server from anywhere, if you want to be extremely cautious, these can be locked to only access from specificic places, domains or IP addresses, <a href="https://dev.mysql.com/doc/refman/5.5/en/account-names.html" target="_blank">see more details here</a>.

## Some other useful resources
<ul><li>[www.zivtech.com/blog/impending-drupal-site-launch-use-list](https://www.zivtech.com/blog/impending-drupal-site-launch-use-list)</li></ul>
