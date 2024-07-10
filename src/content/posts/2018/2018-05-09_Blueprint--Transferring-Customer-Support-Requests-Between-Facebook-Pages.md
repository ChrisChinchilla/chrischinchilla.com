---
title: 'Blueprint: Transferring Customer Support Requests Between Facebook Pages '
publishDate: 2018-05-09 17:01:11 UTC
author: 'Chris Ward'
categories: writing
tags:
  - Facebook
  - Messaging
publication_url: 'https://medium.com/@chrischinchilla/transferring-customer-support-requests-between-facebook-pages-241e23c7000c'
---


Maintaining conversations between multiple channels is a difficult
challenge for customer support departments. Often companies launch
different Facebook pages to enable their audience(s) to find the right
type of engagement at the right time. However, this poses a problem when
your audience starts to ask questions on a Facebook page not related to
the purpose of that page.

A customer looking for support might visit your Facebook marketing page,
comment on an existing post, create a new post or start a conversation
in Messenger with your marketing bot. In these cases, you need a way to
redirect the customer to your support page bot with little to no
friction for the user experience. In this blueprint, we explain how to
accomplish this goal of transferring customer support requests between
Facebook pages.

### What you need {#a22d .graf .graf--h3 .graf-after--p name="a22d"}

### Messenger Features {#819c .graf .graf--h3 .graf-after--h3 name="819c"}

-   [[**Webhook**](https://developers.facebook.com/docs/messenger-platform/webhook){.markup--anchor
    .markup--li-anchor
    data-href="https://developers.facebook.com/docs/messenger-platform/webhook"
    rel="noopener" target="_blank"}: The Messenger Platform sends events
    to your webhook to notify your bot when interactions or events
    happen.]{#8819}
-   [[**m.me
    links**](https://developers.facebook.com/docs/messenger-platform/discovery/m-me-links#reading_parameter){.markup--anchor
    .markup--li-anchor
    data-href="https://developers.facebook.com/docs/messenger-platform/discovery/m-me-links#reading_parameter"
    rel="noopener" target="_blank"}: m.me is a shortened URL service
    operated by Facebook that redirects users to a person, page, or bot
    within Messenger.]{#c2ab}
-   [[**Welcome
    Screen**](https://developers.facebook.com/docs/messenger-platform/discovery/welcome-screen){.markup--anchor
    .markup--li-anchor
    data-href="https://developers.facebook.com/docs/messenger-platform/discovery/welcome-screen"
    rel="noopener" target="_blank"}: The first page people see when they
    encounter your Messenger bot, and m.me links require you to create
    one.]{#8248}
-   [[**Graph
    API**](https://developers.facebook.com/docs/graph-api){.markup--anchor
    .markup--li-anchor
    data-href="https://developers.facebook.com/docs/graph-api"
    rel="noopener" target="_blank"}: The primary way for apps to read
    and write to the Facebook social graph.]{#b6d2}

### Prerequisites {#e8fd .graf .graf--h3 .graf-after--li name="e8fd"}

Complete these steps first:

-   [[**Facebook for Developers
    account**](https://developers.facebook.com/){.markup--anchor
    .markup--li-anchor data-href="https://developers.facebook.com/"
    rel="noopener" target="_blank"}: This step is required to create new
    apps, which are the core of any Facebook integration.]{#0769}
-   [[**Facebook Pages
    created**](https://www.facebook.com/pages/create){.markup--anchor
    .markup--li-anchor data-href="https://www.facebook.com/pages/create"
    rel="noopener" target="_blank"}: This is used as the identity of
    your bot. For this blueprint, you need **two** pages, one for your
    marketing department, and one for the customer support
    department.]{#dcd0}
-   [**An understanding of the** [**Webhook
    setup**](https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup){.markup--anchor
    .markup--li-anchor
    data-href="https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup"
    rel="noopener" target="_blank"}: The Messenger Platform sends events
    to your webhook to notify your bot when a variety of interactions or
    events happen, including when a person sends a message.]{#f2fd}
-   [[**A second test
    account**](https://developers.facebook.com/){.markup--anchor
    .markup--li-anchor data-href="https://developers.facebook.com/"
    rel="noopener" target="_blank"}: You can't message yourself, so you
    need a **second** test account.]{#2748}
-   [[**Facebook app
    setup**](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup){.markup--anchor
    .markup--li-anchor
    data-href="https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup"
    rel="noopener" target="_blank"}: This guide shows you how to
    configure the settings for your Messenger bot, including access
    tokens. You need to do this for **both** pages. We go into further
    detail on some of these settings in later steps.]{#1b10}
-   [Make both users an **admin of both apps and both pages**. This is
    necessary for sending messages between accounts during testing. Once
    you publish your apps and pages, you can message any user that
    grants you permissions.]{#98f8}
-   [Build a basic bot for Messenger. You can do this with the [**Quick
    Start**](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start){.markup--anchor
    .markup--li-anchor
    data-href="https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start"
    rel="noopener" target="_blank"} guide.]{#248d}
-   [Have a server with
    [Node.js](https://nodejs.org/en/download/){.markup--anchor
    .markup--li-anchor data-href="https://nodejs.org/en/download/"
    rel="noopener" target="_blank"} installed.]{#2c29}

### Repository with working code {#918a .graf .graf--h3 .graf-after--li name="918a"}

You can find the final code for this tutorial in [this
repository](https://github.com/fbsamples/messenger-platform-samples/tree/master/inter-page){.markup--anchor
.markup--p-anchor
data-href="https://github.com/fbsamples/messenger-platform-samples/tree/master/inter-page"
rel="noopener" target="_blank"} that contains what's need for this
tutorial. You need to update your access credentials, and you can find
details on how in the *Readme.md* file.

### Step-by-step {#08ac .graf .graf--h3 .graf-after--p name="08ac"}

Now we're ready to start building our bot outlined in the next 12 steps
below. We recommend you complete each step before moving to the next
phase.

### STEP 1: Download the starter project {#cbc2 .graf .graf--h3 .graf-after--p name="cbc2"}

We've created [a starter
project](https://github.com/fbsamples/messenger-platform-samples/tree/tutorial-starters/inter-page){.markup--anchor
.markup--p-anchor
data-href="https://github.com/fbsamples/messenger-platform-samples/tree/tutorial-starters/inter-page"
rel="noopener" target="_blank"} that has the structure set up for you.
If you want to skip ahead, [you can find the completed project
here](https://github.com/fbsamples/messenger-platform-samples/tree/master/inter-page){.markup--anchor
.markup--p-anchor
data-href="https://github.com/fbsamples/messenger-platform-samples/tree/master/inter-page"
rel="noopener" target="_blank"}. The project contains two bots:

-   [The marketing Page bot in /*marketing-bot*]{#a949}
-   [The support Page bot in /*support-bot*.]{#537d}

### STEP 2: Install dependencies for the Marketing Page Bot {#19fb .graf .graf--h3 .graf-after--li name="19fb"}

To begin, we need to install some Node module dependencies defined in
the *package.json* files for the marketing page bot. This bot uses:

-   [[Express](https://expressjs.com/){.markup--anchor
    .markup--li-anchor data-href="https://expressjs.com/" rel="noopener"
    target="_blank"} to set up a web server for the webhook.]{#e8a0}
-   [[body-parser](https://www.npmjs.com/package/body-parser){.markup--anchor
    .markup--li-anchor
    data-href="https://www.npmjs.com/package/body-parser" rel="noopener"
    target="_blank"} to parse the JSON body of the incoming POST
    requests.]{#e403}
-   [[request](https://github.com/request/request){.markup--anchor
    .markup--li-anchor data-href="https://github.com/request/request"
    rel="noopener" target="_blank"} to send HTTP requests to the
    Messenger Platform.]{#2b67}

To install these commands, run this command in your terminal inside the
*marketing-bot* folder:

<figure id="796f" class="graf graf--figure graf--iframe graf-after--p">

</figure>

### STEP 3: Subscribe to Webhook events for Marketing Page Bot {#75b7 .graf .graf--h3 .graf-after--figure name="75b7"}

The app needs to subscribe to the following webhook events.

Subscribe to `messages`{.markup--code .markup--p-code} webhook events
under *Messenger → Settings* of the app.

<figure id="9bdf" class="graf graf--figure graf-after--p">
<img
src="https://cdn-images-1.medium.com/max/800/1*vyoGJgMKzoaw-Y7sB5PR7A.png"
class="graf-image" data-image-id="1*vyoGJgMKzoaw-Y7sB5PR7A.png"
data-width="817" data-height="328" />
</figure>

For the page webhook events we need to know when there is a new post or
comment on a page, subscribe to `feed`{.markup--code .markup--p-code}
and `conversations`{.markup--code .markup--p-code} under *Webhooks →
Settings*. We cover handling these events in the next step.

<figure id="b01b" class="graf graf--figure graf-after--p">
<img
src="https://cdn-images-1.medium.com/max/800/1*F2XuC07bY0ciEHDEzUh5Zg.png"
class="graf-image" data-image-id="1*F2XuC07bY0ciEHDEzUh5Zg.png"
data-width="797" data-height="303" />
</figure>

### STEP 4: Handle user posts to the Marketing Page {#2d58 .graf .graf--h3 .graf-after--figure name="2d58"}

When someone posts on the marketing page they trigger the
`feed`{.markup--code .markup--p-code} event, and when they comment on a
previous post they trigger the `conversations`{.markup--code
.markup--p-code} event. Your bot needs to listen and react to these
events.

The `app.post('/webhook', (req, res)`{.markup--code .markup--p-code}
route in *app.js* currently handles `messaging`{.markup--code
.markup--p-code} events, but user posts are `change`{.markup--code
.markup--p-code} events, so add an `else if`{.markup--code
.markup--p-code} statement to the existing `if`{.markup--code
.markup--p-code} statement to handle this new event type:

<figure id="0bce" class="graf graf--figure graf--iframe graf-after--p">

</figure>

This code passes the changes to the `processComments`{.markup--code
.markup--p-code} function which we create next.

### STEP 5: Reply to people who commented {#ecc1 .graf .graf--h3 .graf-after--p name="ecc1"}

In a production bot, we could use [natural language
processing](https://developers.facebook.com/docs/messenger-platform/built-in-nlp){.markup--anchor
.markup--p-anchor
data-href="https://developers.facebook.com/docs/messenger-platform/built-in-nlp"
rel="noopener" target="_blank"} to analyze comments and react to those
containing potential support requests. For this blueprint, we assume
that all comments require support and send the poster a private message
redirecting them to our support bot.

**Get the post_id for the post or comment**

We are listening to two types of events on our marketing page: a new
post and a comment on an existing post. To send a private reply, we need
the `post_id`{.markup--code .markup--p-code} of the post that the user
wrote, and that `post_id`{.markup--code .markup--p-code} is in different
places in the response.

Add the following to the stub `processComments`{.markup--code
.markup--p-code} method:

<figure id="0fe7" class="graf graf--figure graf--iframe graf-after--p">

</figure>

This code sets the `post_id`{.markup--code .markup--p-code} we need to
the appropriate value depending on the event type.

**Set the body of the private reply**

Private replies to a user only accept text for the message body, and we
want to pass the poster's original message to the support page bot so
that it can react to the original question. To do this, we use the [m.me
link](https://developers.facebook.com/docs/messenger-platform/discovery/m-me-links){.markup--anchor
.markup--p-anchor
data-href="https://developers.facebook.com/docs/messenger-platform/discovery/m-me-links"
rel="noopener" target="_blank"} for the support page bot (the page and
bot username) and pass the original message to it as the
`ref`{.markup--code .markup--p-code} parameter. After the
`else if`{.markup--code .markup--p-code} statement you created above,
add the following code:

<figure id="2a03" class="graf graf--figure graf--iframe graf-after--p">

</figure>

**Send private reply**

Now we send a request to the `private_replies`{.markup--code
.markup--p-code} endpoint of the Graph API, which requires two
parameters:

-   [To reply to the poster of the comment or post, we need the
    `comment_id`{.markup--code .markup--li-code} of the post or
    comment.]{#96f5}
-   [The `message`{.markup--code .markup--li-code} to send.]{#1131}

Now add the following code beneath the code we created above:

<figure id="5a0d" class="graf graf--figure graf--iframe graf-after--p">

</figure>

### STEP 6: Create the Support Page Bot {#d056 .graf .graf--h3 .graf-after--figure name="d056"}

With step 5 complete, we now need to create the support page bot to
handle the incoming message and respond to the user.

### STEP 7: Install dependencies for the Support Page Bot {#23e7 .graf .graf--h3 .graf-after--p name="23e7"}

To begin, you need to install some Node module dependencies defined in
the *package.json* files for the support page bot. This bot uses:

-   [[Express](https://expressjs.com/){.markup--anchor
    .markup--li-anchor data-href="https://expressjs.com/" rel="noopener"
    target="_blank"} to set up a web server for the webhook.]{#8839}
-   [[body-parser](https://www.npmjs.com/package/body-parser){.markup--anchor
    .markup--li-anchor
    data-href="https://www.npmjs.com/package/body-parser" rel="noopener"
    target="_blank"} to parse the JSON body of the incoming POST
    requests.]{#8c08}
-   [[request](https://github.com/request/request){.markup--anchor
    .markup--li-anchor data-href="https://github.com/request/request"
    rel="noopener" target="_blank"} to send HTTP requests to the
    Messenger Platform.]{#5b07}

Run this command in your terminal inside the *support-bot* folder:

<figure id="19e4" class="graf graf--figure graf--iframe graf-after--p">

</figure>

### STEP 8: Webhook events and subscriptions for the Support Page Bot {#9601 .graf .graf--h3 .graf-after--figure name="9601"}

Subscribe to the `messages`{.markup--code .markup--p-code},
`messaging_postbacks`{.markup--code .markup--p-code} and
`messaging_referrals`{.markup--code .markup--p-code} events from
Messenger.

<figure id="eece" class="graf graf--figure graf-after--p">
<img
src="https://cdn-images-1.medium.com/max/800/1*5B4bp4NRYYFpdbN24a3HYQ.png"
class="graf-image" data-image-id="1*5B4bp4NRYYFpdbN24a3HYQ.png"
data-width="815" data-height="333" />
</figure>

We cover what these events are and what triggers them in step 11.

### STEP 9: Set a username for the Support Page {#85f0 .graf .graf--h3 .graf-after--p name="85f0"}

Giving your Facebook page a username is a good practice, and for the
m.me links to work, the support page needs a username set. You can do
this from the *Edit Page Info \> Create Page username* dialogue.

<figure id="dc86" class="graf graf--figure graf-after--p">
<img
src="https://cdn-images-1.medium.com/max/800/1*AlrcyDyuOK8I1jOBlcxpdA.png"
class="graf-image" data-image-id="1*AlrcyDyuOK8I1jOBlcxpdA.png"
data-width="1024" data-height="1024" />
</figure>

### STEP 10: Set the Support Bot Welcome Screen {#3f89 .graf .graf--h3 .graf-after--figure name="3f89"}

To accept incoming `messaging_referrals`{.markup--code .markup--p-code}
events, the support bot needs a welcome screen set with a \'[Getting
Started](https://developers.facebook.com/docs/messenger-platform/discovery/welcome-screen#set_postback){.markup--anchor
.markup--p-anchor
data-href="https://developers.facebook.com/docs/messenger-platform/discovery/welcome-screen#set_postback"
rel="noopener" target="_blank"}\' button defined. You set this by
issuing a `POST`{.markup--code .markup--p-code} request with the text
for the screen, and the payload sent to your bot when a user clicks that
button:

<figure id="2edf" class="graf graf--figure graf--iframe graf-after--p">

</figure>

### STEP 11: Respond to the user {#28fc .graf .graf--h3 .graf-after--figure name="28fc"}

Clicking the m.me link takes the user to the bot welcome screen if this
is their first conversation with the bot and into an active conversation
if they have used it before. In each case the payload sent to the
support bot is different, and so is getting the value of the original
message.

At the bottom of the `app.post('/webhook', (req, res)`{.markup--code
.markup--p-code} route in the /*support-bot/app.js* file, add the
following `if else if`{.markup--code .markup--p-code} statements to
handle the different types of events the bot receives:

<figure id="5016" class="graf graf--figure graf--iframe graf-after--p">

</figure>

This code handles `message`{.markup--code .markup--p-code},
`postback`{.markup--code .markup--p-code} and `referral`{.markup--code
.markup--p-code} events a user sends to the bot.
`postback`{.markup--code .markup--p-code} and `referral`{.markup--code
.markup--p-code} events are the two event types that contain the
original message somewhere in their payload. In both cases, we pass the
relevant value from `webhook_event`{.markup--code .markup--p-code} to
the `handleIncoming`{.markup--code .markup--p-code} method. This is
`webhook_event.postback`{.markup--code .markup--p-code} for a new user
and `webhook_event.referral`{.markup--code .markup--p-code} for
returning users.

In the stub `handleIncoming`{.markup--code .markup--p-code} function,
add the following code that handles getting the original message from
the referral parameter for users who have used the bot before:

<figure id="32de" class="graf graf--figure graf--iframe graf-after--p">

</figure>

For new users add the following `else`{.markup--code .markup--p-code}
statement to the `if`{.markup--code .markup--p-code} statement for when
the event instead has a payload that contains
`get_started`{.markup--code .markup--p-code}:

<figure id="beed" class="graf graf--figure graf--iframe graf-after--p">

</figure>

In a production application, the support bot can now parse the incoming
message for the intent of the message to see how it can help, or present
interaction options with the bot.

### STEP 12: Testing the blueprint {#6cdc .graf .graf--h3 .graf-after--p name="6cdc"}

Each bot has a different node port defined (`5000`{.markup--code
.markup--p-code} for the marketing page bot and `5001`{.markup--code
.markup--p-code} for the support page bot). Issue the following command
inside the folder for each bot to start them:

<figure id="a0a1" class="graf graf--figure graf--iframe graf-after--p">

</figure>

To test this blueprint, you need to log in to two different browsers
with each of your Facebook accounts. When you post or comment on the
marketing page, make sure you do so from your test account, and not as
the page.

<figure id="fae7" class="graf graf--figure graf-after--p">
<img
src="https://cdn-images-1.medium.com/max/800/1*wXzatBJUXnHrRfkftPQeEw.png"
class="graf-image" data-image-id="1*wXzatBJUXnHrRfkftPQeEw.png"
data-width="508" data-height="199" />
</figure>

### Conclusion {#c4c0 .graf .graf--h3 .graf-after--figure name="c4c0"}

In this blueprint, we looked at how to pass messages and users between
bots attached to different business pages for different
purposes --- ideally helping your customer support team with all inbound
communications. We covered the settings needed for pages and
applications for this bot to work, the APIs you need to build the
workflow, and how to pass information between bots.

The technique we covered is useful for directing visitors to the correct
department within your company, or for creating viral marketing
campaigns by spreading messages between pages --- conveniently for you
and your users. Join the [Dev
group](https://www.facebook.com/groups/messengerplatform/?ref=br_rs){.markup--anchor
.markup--p-anchor
data-href="https://www.facebook.com/groups/messengerplatform/?ref=br_rs"
rel="noopener" target="_blank"} to let us know about your ideas and
experiences implementing this blueprint in your apps.