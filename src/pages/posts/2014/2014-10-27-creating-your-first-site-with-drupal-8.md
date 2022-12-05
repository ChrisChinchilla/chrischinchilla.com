---
layout: "../../../layouts/Post.astro"
title: Creating Your First Site with Drupal 8
created: 1414403650
---


We have been hearing about Drupal 8 for quite a while now and it&rsquo;s sounding increasingly exciting and close. After DrupalCon Amsterdam I was keen to get my hands dirtier with Drupal 8 and try building a website with it.

I decided to use a practical example as that&rsquo;s generally a better approach than messing around with a fake idea. I decided to try and use the redevelopment of my Wife&rsquo;s site, &ldquo;A Travelling Cook&rdquo;, as it is a simple site, so seemed like a good case study.<h2>&nbsp;</h2><h2 id="installation">Installation</h2>

Installation of Drupal 8 is much the same as before, however you do need mod_rewrite enabled. The installer doesn&rsquo;t directly mention this, but post-installation will fail if you don&rsquo;t. Installation is somewhat easier, as you can now use a database user with the correct permissions and databases are all created for you.

You will need to duplicate additional files as part of the installation process, so pay attention to the instruction screens. Interestingly, the traditional &lsquo;sites&rsquo; folder and its subfolders can be used as we are all used to, but don&rsquo;t need to be, you can actually now add things to the top level of Drupal. I&rsquo;m not entirely sure how I feel about this yet, or how this will affect many of our existing deployment strategies.<h2>&nbsp;</h2><h2 id="multisite">Multisite</h2>

If you want to use multisite, you have to add entries to the &lsquo;sites/sites.php&rsquo; folder for the multisite folders to be recognised, there are examples in the folder.<h2>&nbsp;</h2><h2 id="initialimpressions">Initial Impressions</h2>

Initially, nothing will look that different really, admin sections are slightly reorganised and you have a new admin menu, but if you have been using Drupal for a while, it will look fairly familiar.<h2>&nbsp;</h2><h2 id="settingupcontenttypes">Setting Up Content Types</h2>

This is a pretty similar process to Drupal 7, some differences, but you should be able to figure out what&rsquo;s what. There are a few more field types built in, such as &lsquo;Entity Reference&rsquo;, which makes sense for Drupal. There is also now an inbuilt option for managing node edit forms, another great &lsquo;out of the box&rsquo; new feature.<h2>&nbsp;</h2><h2 id="modulesmodulesmodules">Modules, Modules, Modules</h2>

This is unfortunately where I came unstuck and (spoiler alert) had to give up the adventure. Whilst there are several D8 versions of modules available, such as Drush and Devel (and of course several useful modules in core), but there were too many others just not yet available. For example:<ul><li>I needed to import 90 items of content, the current site is in Blogger, which doesn&rsquo;t give you database access so I couldn&rsquo;t use Migrate module, well, not without all sorts of additional intermediary steps. A Drupal 8 version of feeds is in development, but encourages you to not use it yet and has limited options right now.</li><li>If you want to make a live production site, then several modules that are useful for SEO and general user-friendliness are not yet available, such as Path Auto and Google Analytics.</li></ul><h2>&nbsp;</h2><h2 id="problems">Problems</h2>

I did get a lot of unusual errors, most of which could be fixed through file and database cache clears, but they weren&rsquo;t always clear as to the reason.&nbsp;

<span style="line-height: 1.538em;">If you move or rename the location of your site, you will find that Drupal 8&rsquo;s new Configuration Management features might cause your entire site to break as it can no longer find the locations for the configuration files it expects. So make sure you change the paths in the site&rsquo;s settings file.

There is also an error that may or may not occur if you update Drupal 8 core. Somewhere along the way, the &lsquo;classy&rsquo; theme became the base theme for many other themes and if it&rsquo;s not enabled before the upgrade, your site will break. I found by commenting out certain lines in core I could get things working sufficiently that I could enable it, uncomment the lines and get back to normality.<h2>&nbsp;</h2><h2 id="conclusion-notreadyforlivesites">Conclusion - Not Ready for Live Sites</h2>

I&rsquo;m sure anyone could have told me this, but still, it was interesting to try. Whilst Drupal 8 is now stable enough for experimentation or Developer playground sites, if you&rsquo;re trying to create a site that non-technical folks and end users will use and enjoy, it is not ready.

Some of this is down to instability, but it&rsquo;s also the age old issue that new versions of Drupal always have, the lack of necessary modules. The inclusion of some of these in core makes things somewhat easier, but there are still a few that I think every site needs before I can happily use Drupal 8 in the wild.
