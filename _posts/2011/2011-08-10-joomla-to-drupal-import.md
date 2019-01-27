---
layout: post
title: Joomla to Drupal import
created: 2011-08-10T00:00:00.000Z
categories: Chris writing chrischinchilla
tags: drupal joomla
---

I generally find that in the process of migrating a website to a new system or framework, importing and moving data is the most fraught, frustrating and troublesome part of the process. If you're moving content from a vanilla installation to another vanilla installation you might be in luck, but really, what are the chances of that?

I long ago decided to merge a joomla 1.5 site I have into a new site I was setting up in drupal 7, the content that needed to come across was:<ul><li><a href="https://www.virtuemart.net/" target="_blank">virtuemart</a> products into <a href="https://www.ubercart.org/" target="_blank">ubercart</a> and theoretically, order records</li><li>several hundred articles written by a dozen different authors, most with media</li><li>aforementioned authors' user records</li></ul>

I have to admit that for the products, as there were less than a dozen, I just reentered them all manually, fairly painless and I wasn't too fussed about transferring customer and order records as No-one has ever used the feature particulary widely anyway.

Next came attempting to move the articles into drupal nodes, and this was the most fraught and the primary reason for the post, a place for me to remember for future reference and advice for anyone else attempting the task. I wasn't attempting anything particularly complicated matching various fields to cck values, taxonomy or anything like that.

I've always struggled to find joomla components or modules that I like (one of the many reasons for moving the site to drupal) and exporting is no exception. Most of the export modules only export in XML, which I'm not averse to, but I feel more comfortable manipulating csv files in excel than XML files. There is <a href="https://www.jix.com.au" target="_blank">jix</a>, but I can't get my head around what on earth you're supposed to do with it, so I actually ended up just doing a csv database dump out of phpmyadmin, make sure you check the "include headers" box when you export.

One piece of advice with regards to csv files and manipulating them. Whilst excel does a fair job in presenting and manipulating the data, it's a shocker when it comes to re-saving the csv. I'm mot completely sure what it does, but whenever I try to import an excel csv file into any kind of open source web system, it hardly ever works. So once you've done any manipulation, I recommend opening the csv in open office and re-saving, or just use open office in the first place of course! Also make sure that you check any options along the lines of  "enclose fields with....", especially if your export contains HTML values, which it probably does.

For importing the data into drupal 7 I used the <a href="https://drupal.org/project/feeds" target="_blank">feeds</a> module as <a href="https://drupal.org/project/node_import" target="_blank">node import</a> isn't yet  ported to drupal 7. This is a fairly solid module and I didn't have any major issues with it per se, my main gripe would be I wish you could also import data into the "updated" field, but that's not a deal breaker.

Through trial and error of several import jobs, here a few nuggets of advice for making your imports easier.

Dates from joomla will need to be converte into unix time stamps, I found <a href="https://stackoverflow.com/questions/1703505/excel-date-to-unix-timestamp" target="_blank">this helpful stack overflow post</a> that explains how to do that and of course, using a spreadsheet, that job can be automated.

Joomla breaks it's intro/summary text and body text fields into two separate fields and assembles them together when displaying content. If you want both these values to be imported into a nodes body field, you will need to do some concatenation wizardy in a spreadsheet.

I had to bulk update user Ids in a spreadsheet I order to reflect the matching Ids in drupal, this was a fairly longwinded process and after messing up the resulting csv after some weird encoding export issue, I ended up abandoning importing user Ids.

So all is left is to delete all the various columns you're not bothered about importing, load up your csv file into feeds and hopefully watch that blue bar fly across the screen. If it all goes wrong fortunately the module has a handy feature for deleting the last import and you can start again.
