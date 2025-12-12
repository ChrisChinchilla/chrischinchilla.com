---
title: Price on Application with Ubercart 3 and Views
publishDate: 2013-05-04T00:00:00.000Z
image: articles/poa-4.png
categories:
  - writing
  - chrischinchilla
tags:
  - drupal
  - php
summary: >-
  A few weeks back I needed to create an ability for certain products in
  Ubercart to be available for 'price on application', there were a few modules
  floating around that pertained to do this, but none seemed to work in Drupal
  7, so I racked my brain on how to accomplish this as simply as possible and
  came up with something quite tidy...
---

A few weeks back I needed to create an ability for certain products in Ubercart to be available for 'price on application', there were a few modules floating around that pertained to do this, but none seemed to work in Drupal 7, so I racked my brain on how to accomplish this as simply as possible and came up with something quite tidy...

I created a field on the product content type where content editors could enter the text to be displayed instead of a price, in my case, called 'field_price_on_application'.

In my case I had a view that displayed the various product options in a right hand bar, but hopefully the same principles may apply for other display options. Within the view I added fields for the sell price and the price on application text, but hid them from display.

Finally, I created a custom text field, which by default displays the price on application text and in the 'no results' section displays the sell price and anything else you want to display. This basically means that the field will display the price on application if there is one, but the price instead, if one is set.

![](https://jkiudypxrctjskezxyfy.supabase.co/storage/v1/object/public/images/articles/poa-1.png)

![](https://jkiudypxrctjskezxyfy.supabase.co/storage/v1/object/public/images/articles/poa-2.png)

![](https://jkiudypxrctjskezxyfy.supabase.co/storage/v1/object/public/images/articles/poa-3.png)

![](https://jkiudypxrctjskezxyfy.supabase.co/storage/v1/object/public/images/articles/poa-4.png)
