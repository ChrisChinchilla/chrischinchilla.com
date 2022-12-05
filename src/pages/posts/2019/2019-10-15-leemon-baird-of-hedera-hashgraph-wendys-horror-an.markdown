---
layout: "../../../layouts/Post.astro"
title: "Leemon Baird of Hedera Hashgraph, Wendys Horror, and GNU Start"
layout: "../../../layouts/Podcast.astro"
date: 2019-10-15 11:00:00 UTC
author: ""
categories: podcast theweeklysqueak
podcast: "The Weekly Squeak"
tags:
orig_url: https://anchor.fm/theweeklysqueak/episodes/Leemon-Baird-of-Hedera-Hashgraph--Wendys-Horror--and-GNU-Start-e7kvv1
podcast_embed: https://anchor.fm/s/2ab8734/podcast/play/7028129/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2019-9-14%2F29125425-44100-2-02af7b3be3cb1.m4a
image: images/347957-1571016308550-2ddfc70bc53b4.jpg
permalink: /:categories/:title/
transcript: true
---

In this episode I speak with Dr. Leemon Baird of Hedera Hashgraph about their DLT (not a Blockchain), plus the Saga of Richard Stallman continues, the history of Call of Cthulhu, and Wendys releases a RPG…

-   [www.hedera.com/about](https://www.hedera.com/about)

## Transcript

**Warning: Still testing, and certainly not accurate**

Chris Ward  0:03
Welcome to your weekly squeak with me Chris Chinchilla recording today from a hotel room in Osaka. Fresh out of the epic week that was DevCon, a kind of prime developer event for the Ethereum community. So I travel microphone, no pop shield or anything like that in a hotel room with noisy air conditioning. So hopefully you can put up with me for a few minutes before I get to my interview

Unknown Speaker  0:29
to cover a few of the links that caught my attention this week, amongst all the chaos that was difficult. And my interview this week is with Lehman beard from hedera hashgraph sort of the blockchain

Unknown Speaker  0:42
we will get to that a little later. But first, here are my links.

Unknown Speaker  0:49
So I was stupid enough to instal Mac OS Catalina it's a little bit of a trash fire. I'm getting that I'm struggling with quite a few things that don't work. I'm not quite sure why I didn't heed the notice, I am an upgrade junkie I could not stop myself. But on the more positive side, one of the features that came through and this is a storey from MAC storeys written by Stephen Aquino, hello computer inside Apple's voice control. Apple has always been quite good with accessibility. But it really up to the gaming Catalina it's one of the features that actually works very well and has opened doors for lots of people. And it's always interesting with Apple, how people sometimes overlook these features that are not the headline features, but are actually very good features. And this enables people to do pretty much anything they want by voice control with them Mac. It's mostly aimed at people who cannot use their hands or arms very well on a keyboard or a mouse or especially on a mouse and want to control input with voice. I mean, you could use it to speak to a computer if you wanted to, but not necessarily aimed at people who who have other options. And it's a really nice coverage and also discussion with some of the engineers Behind the particular component about how they created it, and how they tested it and things like that, and how it interacts with other accessibility tools as well. So actually, in the midst all the chaotic features that don't work very well, voice control in Catalina is working very well. And making a lot of people not only happy but able to actually use computers effectively for the first time in a long time, by default without additional software. So really nice. have read the article and have an experiment with it to see how sometimes it's good, especially as web designers and application designers to see how some people have to use your applications. And then you start to redesign and rethink how you design your applications for people with those use cases. On the more negative side of things, continuing the storey of Richard Stallman, which I covered last week. The fallout continues. This is an article specifically on the Business Insider from Judy bought, and this covers how many dozens of programme is from from the country. Operating System, all the new projects have also, he kind of officially stepped down from MIT. And sort of the FF but not going to. And a lot of developers on the glue project have said, Well, we don't want to be involved with this if he's still here. And this is kind of all these interesting things. It's definitely his project. The others it could be argued that have sort of been steam spearheaded, spearheaded by other people for some time, you know, has kind of still been his baby as well. So, yeah, there's there's been a lot of backlash against the fact that he hasn't officially stepped down. And Could it be that he will? Or will the new project collapse? Without the sort of benevolent ish, shall we say now, dictator? Time will tell? The fallout continues, and I think it's interesting to show that if you have unacceptable opinions in this modern era, then it doesn't really matter who you are. People will not necessarily want to work with you anymore. And I think that's what A strong scientists to see that yeah, it doesn't really matter how famous how important in quote marks you are. If your opinions come out as being acceptable, then that is it. And that is, I guess a good thing. And good to see that developers standing up for bad attitudes and inappropriate attitudes. Finally, and and having the strength and to do that, and sometimes it takes one person to start a kind of a waterfall. And it's good to see that at least, developers are now starting to be able to do that more and not have this kind of concern over Well, this person is too big to bring down. They're actually not so the storey continues. We should keep a close eye to see how much more it continues. I have actually got back on the writing train. I haven't necessarily been promoting my articles but you can still find what I've been working on@design.com or my personal website at Chris angela.com slash writing but one of the the tools I Recently was micro, Kate's, and the micro pass to applications from canonical for running Kubernetes clusters on a local machine. I did a fairly short roundup of it. But then I came across this post on it next from Luigi Costello, who goes into a lot more detail of using it. So if you kind of read my article, I want to go a bit further, then you can have a read of his and get a bit more detail.

Unknown Speaker  5:26
And especially if you're interested in diving into the world of Kubernetes, but don't really want to get into kind of creating complex clusters from the outset, it's a really good way of getting started with some sort of five to 10 minutes and having a working Kubernetes installation, not really a cluster. It's kind of the point, but and then roll it out from development to production from there. So if you want to dig a bit more, have a read of that article. Off live remind please, rounding off the episode with some role play news. So this is an old post from Gizmodo Caribbean whiskey

Unknown Speaker  6:03
from 2015. But I have been playing Call of Cthulhu, the role play game inspired by HP Lovecraft a nother controversial character, shall we say, but one who is long gone. And I guess because of that this article popped up in my feed, colloquially was the first role playing game to drive people insane is literally always happens, someone always goes insane, or less often dies in colloquially. But the article goes into how now into its seventh edition just recently.

Unknown Speaker  9:08
And now here's my interview with Lehman bed when we talk about idea of hash graph, the not a blockchain.

Leemon Baird  9:14
So i'm linden Baird, and I'm the chief scientist and CTO at Madeira. And there is a public network that had our big open access a couple weeks ago. And now the world is able to use hedera. And they're using it and what is hedera?

Unknown Speaker  9:32
And will tread carefully here at what terms you want to use

Leemon Baird  9:35
to describe it?

Sure. So it is a DLP a distributed ledger technology, it is a public ledger, the way some people use the words it's a blockchain, although it's not actually a chain of blocks. So I would say it's a deal t that isn't a blockchain. But you know, if you use blockchain in the generic sense, and it's a blockchain, the point is, it's a public ledger. It's a group of computers that are coming to agreement. There. Computers have guarantees that they will reach agreement, they reach agreement quickly on the ordering of things. And that means you can use it for cryptocurrency and for files and for smart contracts, and will be soon adding a for a fourth service as well. So it is a public ledger.

Unknown Speaker  10:16
And let's let's dig into that a little bit more because this is one of these areas that always confuses people in DLT. And now I've had a complete blank or what that stands for, even though you just said it, just

Leemon Baird  10:29
that's it. Yeah,

Unknown Speaker  10:32
the blockchains often will come sort of get grouped underneath that along with other things that have a related some related heritage, but in the Madeira hashgraph case, what what actually is yours then what what is your DLT? How does it function conceptually?

Leemon Baird  10:54
So, to the user, it's all DLT sort of function, the same You submit transactions to them to transfer cryptocurrency or to run a smart contract or to store a file. And the computers as a whole, in the whole group, as a community come to an agreement on what to do, and then they do it. And you don't have to trust any one computer, you just have to trust that, you know, most of them are good, or more than two thirds of them are good. And if you can trust that, then you can 100% trust that your transfer really did go through and you know, your file won't be deleted illegally or whatever you have. You have trust that not too many of them are bad. And it amplifies that to trust that you can absolutely believe what it's doing. You don't have to trust any single computer. So from the users point of view, that is what a deal T or people would say blockchain is as opposed to a single server where you have to trust the guy running the server that would not have the same kind of trust.

Unknown Speaker  11:54
And this actually gets into this interesting point. It's one I remember discussing with With hyperledger for similar sorts of reasons, especially when you get private DLT slash blockchain what, what you just described? What is the difference between it and a more traditional distributed system, potentially with transactional support that would also kind of have the same guarantees. What would be the, the the fundamental differences?

Leemon Baird  12:24
The fundament differences between a DLT and a traditional server, like a traditional database?

Unknown Speaker  12:29
Yeah, with consensus algorithms, traditional consensus algorithms. And yeah, like robbed and Paxos and

Leemon Baird  12:36
things like that.

Oh, those are traditional. Like, Yes, I understand. Yeah. So, um, so many of these traditional algorithms are not ABFT they don't have its high level of security. So your trust would not be as much if they if they are not asynchronous, Byzantine fault tolerant. That means that they don't have certain kinds of trust that you would have other was many of them can be shut down with the de dos attack, distributed denial of service attack. And so you would have to worry about that can the whole network be shut down by shutting down one computer. And to be clear, just like I said, with the trust, it's not a panacea. If somebody can shut down all your computers, then your ledger goes down. But you would hope at least that you could survive them shutting down one computer at a time. And so for some of these leader based systems, like you were mentioning, you have problems that if you shut down the leader, then the whole network goes down. And you could say, well, we'll just get a new leader. Yeah, but then they could attack the new leader. Or maybe you have a round robin, where you change leaders every couple seconds, well, if they know who the leader is, at every moment, they can always be attacking the current leader. So So having a BFT is better than merely BFT. And then some, some of these legends aren't even BFT For example, some of them never have banality. You never know for sure that your transfer is gone through you just become a little bit more sure and little bit more sure over time. And you know, after six confirmation to say, Well, I feel sure enough, but it could it could still revert, you never really know. If it's BFT then you know for sure at some point. So that's it, you get finality, and you get this detox resilience if you're a BFT. So that's, that's some ways in which it is better. It also have some performance better, as well. The other

Unknown Speaker  14:22
aspect that was mentioned to me and I wonder if this relates to actually graph is the aspect that with a traditional distributed database and I use the word traditional fairly loosely because they're not that old,

Unknown Speaker  14:33
but you know, it's

Unknown Speaker  14:34
fairly old. And the trust mechanism is the interesting aspect to in that generally, someone configurators the access rights gives access to particular systems, etc, etc. Whereas with a DLT or or a private block chain network in also, the trust is defined by an algorithm. And then the trust is, is passed out by the algorithm not by an administrator or a developer or a DevOps person. And is that also true with hashgraph?

Leemon Baird  15:10
Oh, absolutely, yeah. So for a public ledger, the trust is I trust that I'm not going to have a large number of the participants colluding together to hurt me. Any public ledger will hurt you if a large number of them collude to hurt you. But you don't have to trust any single one. People sometimes called trust lists, which is maybe a little bit misleading. But what they mean by trust lyst is there's no one single person involved that you have to trust. Whereas with a database, well, the person who runs the database can do anything, they can change the data, they can cheat, they can, you know, if it's cryptocurrency, they could just print new money out of thin air, they can do anything they want, and you have to trust that one person entirely. But with a ledger, the only level of trust you need is just to trust that you're not going to have a large number of the community. colluding to gang up on you. You never have to trust any single person. And that's a huge difference. And so, yeah, the database world has had multi party databases, you know, for decades, but one malicious party could could damage the whole system. And the whole point of Ledger's is that you have a better trust model than that.

Unknown Speaker  16:20
So let's dig a little bit more. So I think you mentioned it, but I just want to clarify, it's a fully public network.

Leemon Baird  16:29
So there's public and permission lyst. For two different concepts. Kate is fully public. Yeah, public means anyone can use it without permission. permission. lyst means anybody can run a node without permission. So what we have is on the public versus private, we're fully public. And as of two weeks ago, we just had an open access where we are now anybody can use it. You don't have to tell us who you are. You don't have to get permission from somebody. You don't have to sign up for something. Anybody can submit transactions. That's what a public network is, then for the nodes themselves. If you want to run one of the nodes on the network on the main net, then at the moment, you have to have permission. And that will transition over time to being permission lyst where anybody can run a node anonymously, without having permission. And so that's the path that we're on right now. And right now we have the council members to build trust in this permission system. And then as we can afford to go to proof of stake and be able to trust that no one bad guy can get too many of the tokens, then we will transition to permission lyst where anybody can run anonymous nodes. So that's the path that it is on for permission versus permission lyst but it is public right now.

Unknown Speaker  17:43
And so despite being a public deal, TU do claim

Unknown Speaker  17:49
well, much better performance numbers over a lot of other public blockchain slash deal tease how How are you accomplishing that?

Leemon Baird  18:03
Yeah, so for doing transactions, the cryptocurrency and we started at 10,000, will raise that limit over over time. But right now we started with just 10,000 a second. And that's pretty fast 10,000 a second isn't bad, but we'll go a lot faster over time. The reason we're able to do that is several different things. First, the hashgraph algorithm itself is just inherently efficient in its use of bandwidth. And it inherently comes to a consensus very quickly. And so you know, it just works very well. The fact that we are storing a state, rather than having to search through the whole history, when we process the transaction, we can just kind of remember their current balances everything and we're just updating a state helps with the efficiency. And and then there are a number of things that we do with the mirror nodes where they hold hold the whole history, and you can go to mirror nodes, but that's sort of a separate network that is feed fed into from the main up, and so we're able to do it very fast in that way. And that How we can be fast in a single network. Now, there's another way of scaling, of course, which has to be fast at layer two or with side chains or with other solutions. And we have a different way of doing that as well. We can talk about that. But to be fast in the single network, it's just because it has hashgraph. At its at its core.

Unknown Speaker  19:18
Yeah, actually, that storing state thing is something that just got my attention there. Because I was about to ask about, well, you know, the benefits of deities and blockchains is often this immutability to be able to see the how, how, how a state was accomplished. And if you're only storing state, how do you do that? And you did answer that. But this does. Yeah, this does start to sound comparable to in the blockchain world things like side chains or the proposed ready proposals for side chains, but also in more, again, in quote marks traditional distributed systems with things like event stores or state stores where you don't keep everything in the Kind of the performance focus system, you keep the most important state and then kind of how to find the state that came before that if needed, when in most cases you possibly don't. So why store it all?

Leemon Baird  20:15
And, but

Unknown Speaker  20:19
a lot of people will want that immutability. So if someone does want to rewind to find that steps that got to state, is that also as performant? Or is that likely to be a bit longer.

Leemon Baird  20:32
So what we have there is the same throughput, but we have a little bit longer latency. So instead of a few seconds, you maybe had 10 seconds or whatever to that. And that's in our current mirror notes. As we improve the mirror nodes, we will be able to make those faster and latencies. Well, the mirror nodes are currently released open source, people are running them. We're running a mirror node and I think other people are starting to run mirror nodes. So for people who want to look at the history, we have that The mirror, the mirror nodes are looking at a history that was digitally signed by the main net. So you can know that, that, you know, it's as trustworthy as the main net is. And so the main that itself doesn't have to store that history. And so we have separated that. So we see that we've separated the current state from the history. And we're managing both of those. And, and already, anybody can run a mirror node if they want to right now just get the software and run it. And this is an early alpha version of the mirror node will be getting better versions as time comes on that that have lower latency, but they'll have the same throughput as being that is the equivalent of separating state from history. It is not the equivalent of a side chain. Yeah, or layer two solution. And we have something that is analogous to that but but different in many ways than most side chains and, and layer two things in our head Derek, consensus service HCS. And that will be coming soon. And we've talked about that and we have a beta version of it running but we'll be releasing that soon.

Okay, okay. And

Unknown Speaker  21:57
now halfway down your web page, I

Unknown Speaker  21:58
saw a list of Companies

Unknown Speaker  22:02
said running hedera which attracted my attention, because amongst some that sounded sort of more crypto focus were a few like Boeing, Deutsche Telekom IBM. I clicked on that. And it turned out they're actually what you call council members. So, what is that? What do you mean by running and what is a council member what what is their function in the in the network? Ah,

Leemon Baird  22:27
yes. So had Tara has a different governance model at Darragh as an entity as a legal entity is owned by the council members and is controlled by the council members. This isn't just an advisory board, they actually own hedera they are here. And we are growing we have 10. Right now we're going to have 39. The plan is to stop at 39. And so we're growing. You mentioned some of the names that we have, and they joined the council. They own a piece of hedera. They come to periodic meetings and make decisions On what Darrell will do. So they will make decisions on things like the roadmap for features being added, and how to manage the Treasury, all of those sorts of decisions to bring, hopefully good governance to it. But we've also ensured that they're very diverse. So they're spread around the world is not all under one government. They're in different sectors, different industries. So they're not all you know, they they kind of keep checks on each other and balance each other. And they have diversity of views on things. So they come from different cultures and so on. So we have a diversity of them. But they are, as you mentioned, large companies their IBM and taught on Boeing and, you know, Deutsche Telekom is the biggest telecom in Europe. We have. We have these very big ones magazine, Louisa mega lou is the biggest, or one of the biggest retailers in Latin America. It's, we have very large entities involved here. Tomorrow is one of the largest banks in in Japan and So they run hedera making decisions for Madeira. In addition, I told you about this path from permission to permission lyst. The initial nodes are also run by them. Eventually, we'll have, you know, anonymous people around the world to be running nodes. But to start with, we're having the council reading the nodes. And then we will go along this path where then other people can run nodes that we have allowed that we trust. And then we'll go beyond that to where anyone can run a node anonymously without telling us and so on. But to start with, they're running the nodes, but they're also the governors. And that's the real purpose is the governing.

Unknown Speaker  24:35
And then this is now seems to be the path followed by quite a lot of the new DOT technologies is to start with a couple of key players and then hopefully, add the public ability in the future. So you know, and then some of that is, is hopefully going to happen because otherwise, what what alternative are we creating it's it's kind of not much totally different from running a cloud service or something if if only certain people are allowed to run components of it. What's, what's kind of what what's needed? What's the next steps needed to open that ability to anybody? And how will you? Will you haven't completely open process? or will there be certain stipulations people have to meet?

Leemon Baird  25:23
No, it'll it'll be open. It'll take a while, though. Yeah. For security reasons. Now there is actually even at the moment, you can say that having, say, council members running nodes is better than having a cloud service where one company is running all the nodes. Because if one company runs all the notice, you have to trust the one company. Right? So it comes back to the trust model. If these you know, these big multi billion dollar companies around the world, do you think that one of them might compromise their reputation to attack you will maybe, do you think a full third of them will and that's less likely when you can you can trust it more So we do have a trust model here, I think that works, even with just 10. council members works better with 39. And then as you say, it's even better as we go along this path to where anyone in the world can run a node. And the goal there is that you would not have to say who you are or anything, you would just have to say, you'd submit a transaction saying I want to run a node. And here is my account, because you're going to pay me to run a node, here's what I want you to send, the H bars can help me run a node. And here's my IP address so people can connect to me so I can connect to the network. And that's it. You don't say who you are, you don't get permission, you just automatically do it. That would be the end goal. However, to be safe, we have to make sure that the proof of stake system is secure at every point along the road. And so that's the important thing that gates, the timing of all this is the proof of stake system, and we can talk about that. But that's the ultimate goal.

Unknown Speaker  26:54
Yeah. And how how, interestingly, for projects like yourself, that Doing this in a phased approach, which may be some other public networks, the sort of early public networks that let it open to anybody should have tried to do somehow as well. How do you mean, distributed systems generally have always been a struggle to test at scale, but how? How will you test that adding

Unknown Speaker  27:20
more and more?

Unknown Speaker  27:22
council members, if you like, is is viable, it won't break the consensus algorithm.

Leemon Baird  27:29
OK, so the consensus algorithm itself has math proofs. Yep. And the math proofs have actually been checked by computer. Very few systems have math proofs, and those that do very few of those have been actually checked by computer which we have done. So the algorithm itself looks fine. Then as for practically, you know, can we go from 10 to 39? Will it break? We've tried 39 nodes and they work really good 100 nodes can we go to you know even more? Well, we've tried it and it worked. So, so yeah, I think that practically it will work. We get to closer to where we can afford to have millions of computers around the world running this DC secure. We will of course be testing with larger and larger numbers. But it'd be kind of stupid to put a million computers in one shard. That's a waste of resources. Yeah, as we get lots of computers will go to multiple shards. Yeah,

Unknown Speaker  28:17
because you get

Leemon Baird  28:18
lots of advantages from shorting. And so no one shard will be huge, but we'll go to shorting but we really can't do that until the crypto economics allow you to do proof of stake security. So that will be the next step.

Unknown Speaker  28:30
And, and do you mean shorting in the again, quote unquote, traditional distributed sense? Or does it mean something slightly different in hashgraph?

Leemon Baird  28:40
So in hashgraph, it's the same Okay, I'm sure Hang

Unknown Speaker  28:44
on, keep saying hashgraph for some reason, and I don't know why I just realised there was no I don't know where I made that up from.

Unknown Speaker  28:51
Yes, sorry. Sorry, please, Gary.

Leemon Baird  28:54
That's great. Yeah, so in hashgraph, it is. It is the same thing. concept. The concept is that what you have are not just one group of computers all talking to each other all sharing the same data, but you have multiple groups. And each group has its own data and they talk within the group to maintain its own grid. It's sort of like multiple Ledger's like multiple blockchains. But we don't call that multiple blockchains are multiple Ledger's because they communicate with each other. And so for a shorted system, you have a way that they can communicate with each other. So for example, you might have a cryptocurrency account with some h bars in it, and I would have some cryptocurrency account with h bars, they might be stored in different shards. And so my shirt only knows about a one certainly knows about my account in one shot only knows about your account. And then we transfer each bars from yours to mine or vice versa. The two shards have to talk to each other. And in a lot of systems, if you don't have math proofs that this that the underlying algorithm is ABFT then of course the big shorted system is even less likely to be a dfj But in our system, the underlying one has the security proofs. And so it is possible to have ensured communication in such a way that the proof still hold that you still have a guaranteed asynchronous Byzantine fault tolerance for the whole multi shorted system. As long as you trust that there's no large fraction of a shard that will be ganging up on you, same kind of trust model, as we talked about before. Okay,

Unknown Speaker  30:27
let's let's get into we've talked about how the network is, is, is running at an infrastructure level and also a consensus level. So now I'm having a look at the list of applications that people are building. And we get kind of to the sort of somewhat typical list of use cases we tend to see on DLT and blockchain projects, which is fine. I mean, that's I think that's realistic. But yeah, what what are the sorts of sort of sorts of applications and use cases people are using Using hashgraph for the moment.

Leemon Baird  31:02
Yeah. So it is what you're talking about the traditional things, things based on cryptocurrency payments are on smart contracts and storing information and collaboration between people in various ways. A lot of the use cases that you've talked about, but we also have some that are starting to move towards, in some ways, new kinds of things, like you have ads decks built on us. And they deployed we had a bunch that deployed even on day one. Now, when we turned on open access, a whole bunch of we're already running ads. Next is one of them. And what it does is it deals with tracking what's going on in advertising, and you keep track of lots of little tiny things that happen. And what they do is they bundle them together into sort of summaries that they then put into transactions cryptocurrency transactions that go through the network. And so you talked about how having this history is important and our mirror nodes keep the history. That's really what they're doing. They're doing these cryptocurrency transfers not really to transfer cryptocurrency, but because they want to be storing a record of what happened. That is actually moving closer to our Derek consensus service. They're really using our cryptocurrency as if it were the HCS, where the idea is use the ledger, to put things in order to keep a record of them, and to do it very fast. And that is what you're really using it for. But the the actual processing of thinking about it, you do in a separate computer or a separate set of computers. This is a little bit different from a traditional side chain, in that you can have the trust of the big one entirely. You don't have to trust anybody in the little one. Whereas with a side chain, you kind of have to have some trust in the computers running the little one as well. So and stacks is an application doing that. But we have, we have others, lots of different. What is it over 1000 developers have told us they're building on top of us we have a couple of a few dozen that have now deployed on us and are running. And then we have the council members. They have applications of their And we're talking with them about building their applications. And again, a lot of there is have this HCS feel to it, we're starting to get the impression that for a lot of the big developers, what they're really interested in, is having the speed and privacy of a private network. But they want to have the trust of a big public network. And so the HCS allows you to do that you can have the privacy of a private network, but you don't have to trust any of the computers in the private network, or just one and you run that one. And all your trust comes down to having to trust the public network. And so that's a lot of what we're hearing about from even our council members and some of our big people we're talking to that are interested in building big applications.

Unknown Speaker  33:42
And I could certainly see there's a lot of the the trust aspect in some of these applications, things like logistics, checking, health care, Providence identity records, the one that catches my eye because I know I've heard this is something that's a problem in General software development world especially the open source world is the the thing about binary validation. This is been insignia. I know a few people have tried this in the kind of blockchain crypto world but nothing's quite has quite taken hold yet. But yeah, it's sort of obviously a fairly. One that's fairly close to the community, I guess. Yeah, that's just one that caught my eye.

Leemon Baird  34:32
Yeah,

yeah, there's a lot of them and, and a lot of them come down to, there's information we want to store in a way where everyone in the world sees it. And everyone knows that everyone else is seeing the same thing. And you know, it's not going to change except in the way that it should change. You could call it immutability, or you could call it controlled mutability, but it's making sure things don't change unless they're supposed to change. This is a lot of them have this in common. People are talking about recording assets and recording ownership and recording history and provenance. provenance of drugs or provenance of food, where it came from trying to prevent blood diamonds by saying, well, where did that diamond come from, and you track it all the way along, people talking about using it for auditing kinds of things where you put an audit trail in it, and you can guarantee to the auditors, hey, I didn't go back and change history. Those are things that people are interested in. And then also, you know, where people are interacting with each other. So you can be buying and selling things, or you can be doing markets or auctions or whatever, those sorts of things. I think that these are all good applications, and people seem to be interested in them. And how many of these are currently in that

Unknown Speaker  35:35
sort of proof of concept stage versus live as live as many applications on blockchains and do to our applications?

Leemon Baird  35:45
Yeah, so we have a few dozen that are live that are actually running on the network right now, you know, smart contracts that are running on the network and people like ads deck that are using the cryptocurrency transfers as a way of recording data. Those are live right now. There's also So some applications built on the file system. So those things are live right now, a few dozen, we have a whole bunch that are still in the QC stage. And we have, we're excited to see where it goes. You know, we just started open access, and people are using it. And I'm just really excited to see where they're all going to go.

Unknown Speaker  36:18
Actually just mentioned something there, I forgot to dig into. So it gives me an excuse. Now, let's talk about how developers can actually build on top of hashgraph. I can definitely see you have SDK, as you mentioned, in passing smart contracts, but I don't see any mention of a smart contract language. So is it one of these?

Unknown Speaker  36:37
Are you all using solidity? Okay, yeah. All right. Okay.

Leemon Baird  36:40
Okay. Yeah, we've taken smart contracts that ran on other platforms around ours, and it works fine.

Unknown Speaker  36:46
Okay, so the end the SDK is for what purposes.

Leemon Baird  36:52
So we have an SDK that allows you to create and submit transactions to the network, okay. So that would include the Moving cryptocurrency or creating a cryptocurrency account, calling a smart contract or deploying a smart contract for you know, file deleting a file. It has a few little things that most Ledger's don't have. But mostly it's the core things that you would expect a ledger to have, plus a few extra things that are kind of fun, like revocation service, and some other things that are kind of neat.

Unknown Speaker  37:19
So if you've come from other predominantly a theorem world, I'm sure some others, like being even Libra, to a certain extent has some sure similar concepts. It's not going to be too alien. I guess, too. It's pretty easy to move applications over.

Leemon Baird  37:35
I think so. And so that's what the SDK does. The SDK also has some ability to do things like well, you know, you keep resubmitting that the note is busy. So it does actually some work for you. It doesn't just create the transaction, but it also does some work for you. It pre validates it for you in various ways. So it just helps you if you're trying to write software, and that's sort of I would be with the bottom layer. And then in addition, we have software that we have written in released open source It's really intended like an example like our wallet software. So we are, we have wallet software for iOS and for Android, we had a Chrome plugin that allows you to surf the web. And he paying for websites as you go to them. We have a plugin for WordPress that allows you to build a website that will accept such payments and a payment server for that. We have a command line tools that allow you to create transactions from the command line without having to use the SDK. So we have a whole set of tools and things. We're open sourcing all of them. I think some of them are already up on the GitHub on hashgraph.org. And the ones that aren't will be there soon. And so we had that whole ecosystem of tools and so on. Oh, and not just us, other people, as well. Yeah. So we wrote the SDK in Java, and I think there's a whole bunch of other languages.

See, yeah,

Unknown Speaker  38:50
yeah,

Leemon Baird  38:51
yeah. So the community good that we didn't write those but the communities we have a big community that's building on top of it, and I'd like to ask a little bit about h bar.

Unknown Speaker  39:01
I guess the cryptocurrency that's also part of

Unknown Speaker  39:04
a hashgraph which I think from

Unknown Speaker  39:09
very, very brief memory, I think you're using the letter H that comes from, from Malta multis, which is, which is actually a very crypto friendly country. So it's kind of a from memory I think I remember seeing that there. So what's the what's, what's the relationship between h bar and and everything else does it follow fairly sort of traditional parts of the cryptocurrency and then the networks or is it something different? What? What? What's it with his head? Aaron hashgraph?

Leemon Baird  39:38
Yeah, I would say it's pretty sure to share and the symbols are kind of fun. The logo of the company is a capital H with two cross bars that actually comes from Malta. And then the cryptocurrency symbol is a lowercase h with a crossbar through it. And that is a physical symbol. Yeah, so it's um, Planck's constant divided by two pi So that's kind of cool. The important thing, of course, is we wanted him to be Unicode symbols so that we could actually be typing on keyboards and putting emails and things. It's a

Unknown Speaker  40:08
language Actually, it's it's a Latin, Arabic. It's very odd language.

Leemon Baird  40:15
Yeah. Yeah. Isn't that interesting? Yeah, that is really interesting that the capital HH bar is really is fascinating. So but but aside from

Unknown Speaker  40:25
the following

Leemon Baird  40:27
so it's it's in many ways a traditional cryptocurrency it has no inflation. year ago, we mentioned all the coins that will exist. You transfer them with a transfer command, you can use the wallet on your phone to send and receive h bars. In a lot of ways, I think it's kind of what you would expect a cryptocurrency on the ledger to be

Unknown Speaker  40:48
and and how is the the I've often noticed that with some DLT slash blockchain technologies and they're kind of token economics communities that sometimes The development community and the speculator community can, I don't know, get in each other's way a little bit in terms of priorities and demands? How have you found that kind of synergy between those two sides of your community?

Leemon Baird  41:14
Yeah. So there's lots of people interested for lots of different reasons. Yeah. No, everyone comes to two Ledger's with a different goal different what they want to get out of it. I think they're kind of broad. And so they just appeal to lots of different people. And so yeah, we'd see all sorts of different things. We're trying to, you know, build a good system for everybody for all the different communities. So for developers, we're even looking at using h bars for community development funds and things that will incentivize the community. And it isn't just us, there's an ecosystem growing. So like the helix incubator, is, is like a VC for like an incubator that helps you start up new companies that is devoted entirely to starting up companies that build on Madeira. And we didn't do it. It just did it, did it. I mean, somebody else It's just the the community as a whole is starting to build things like incubators to help companies build on on. So we're just seeing a wide ecosystem and there's all sorts of different people doing it for various different reasons.

Unknown Speaker  42:11
There's a very diplomatic answer.

Unknown Speaker  42:15
So as far as I can tell the the organisation, the company, I'm not under percent, so you don't seem to be set up like a foundation as far as I can tell. It doesn't matter too much, but I just wanted. Yeah.

Leemon Baird  42:28
So technically, it's an LLC, limited liability corporation. Yeah, that LLC is have numbers, which are sort of the owners. Yeah. And we will have 39 owners, 39 members, they are term limited. I can only stay for three years and then get reelected to a second term. So total of six years and then they have to leave. We don't want people to get entrenched. Yeah. We're really trying to keep checks and balances here. That's really the goal. Yeah. But it is an LLC, they own it. They control it. You know, when they join, they buy their membership for $100. And then when they leave they Get their hundred dollars back. It's not like others where you paid $10 million, you

know? Yeah. And as far as I can tell it's

Unknown Speaker  43:08
existed for at least two years. But the what's the How long have you and others been working on the project? And why did you start it?

Leemon Baird  43:18
Oh, yeah. So really way back in 2012, we started thinking about the problem of how could you do online collaboration in a way that would have good trust, not really looking at block chain, because we wanted something fast. And we wanted to have this ABFT property and, and be really efficient and so on and be fair. So really looking at from a different point of view, worked on it for years, in 2015 finally realised how to do it. And that was hash graph. And so in 2015, we started this company to build permission Ledger's on hashgraph. We didn't want to start with public ledger because we wanted to build trust in the algorithm first. So we created Searles which was a company to Get out there this permission ledger and we got customers like CU ledger, the credit union industry in North America is, is using it. And so then in 2017 we incorporated and created hedera. And so Sorrells was doing the private Ledger's had DERA then was to do the public ledger. And we felt at that point, there was enough validation that we could get really big council members, like the names you mentioned. We were able to get those. And so then in 2018, early 2018, we had the launch event where we announced to the world Hey, Derek, is a thing had Tara has these plans. We're going to have a council we're going to have a cryptocurrency and so on. And in between then and now. We've been building up the council. We've been building this the software, we went through a long period of testing. At one point we had 50,000 people who had accounts or who had profiles in our approach in our portal, where they would be able to test the network. After a long time of testing, we finally had open access, where we said, okay, now anyone in the world can use it. And that was what we just had recently. But

Unknown Speaker  45:10
what was your actual motivation? Why? What brought you into this world in the first place?

Leemon Baird  45:15
Yeah, you know, the original motivation was that I really want people to be able to interact with the online world, the internet is cyberspace in a different way than we ever have. It's just too painful. And it still is. Yeah, I mean, the whole industry of Legends is its infancy. But it really is. But the goal is that you should, at some point, be able to just anytime you want, carve out a piece of cyberspace and have your own little world that you can create, and then invite other people. And then all of you can collaborate together. But you can trust that the rules of this little world are being enforced, even if you don't trust any particular person who is part of it. And then these little shared worlds should be able to communicate with each other, including public ones that could do things like crypto currencies where you just really need a high degree of trust, and they could interoperate with each other, they could send things back and forth. And so you could say, well, this is, you know, this is the ledger blockchain vision on steroids. But it really was coming to that to that same in state from a different point of view. It was just how would we like to be able to do this, and you have to have speed, you have to have fairness, you have to have security, and then it all comes down to having trust underneath it all. And so I was just working on that as a fun math problem, and eventually was able to find how to do it. I thought it was impossible. I kept convincing myself it was impossible, but kept gnawing at me and eventually realised, oh, you actually can do that ABFT with fairness, and super speed is not impossible. And then from that point, we said, Fine, let's bring it to the world. And so we've been doing that ever since.

Unknown Speaker  46:48
And also you've just had a big announcement. But what's next on the roadmap for the next six months?

Leemon Baird  46:54
Ah, yeah. So this is where it all begins. So we will working with partners and with developers to have build this ecosystem on top of us and had it continue to grow, we will continue to improve the underlying system. And so we will be rolling out that when we have this beta HCS, but we hold it rolling out the real HCS. And we have beta mirror nodes will be rolling out real mirror notes or the full mirror nodes will be doing things like state proofs that are important and making it better in various ways. And, and just continue to push along, building a big ecosystem on this that takes advantage of its of its advantages, and, and kind of moves towards this goal of changing the world. I think everybody in this blockchain community, the ledger community is, is really seeing how these have the potential to change the world. And that's really what we want to push for. There's just tremendous opportunities for making things more efficient and more trustworthy than they are today.

Unknown Speaker  47:59
And then the final question, And I always like to ask just just to double check, is there anything important you'd like to make sure you mentioned that you haven't?

Leemon Baird  48:09
Um, nothing. In particular, I think you've asked really good questions.

Unknown Speaker  48:13
And at the outset, I think because it's such a broad question.

Leemon Baird  48:20
It is. It's just, it's just fun. It has been really gratifying to see the support from the community to see the network up and running and being used and to just watch what's happening. And I am really excited to see what's going to happen in the future.

Unknown Speaker  48:34
And that was my interview with Lehman. Bad hashgraph I hope you enjoyed the interview. I hope you enjoyed the links. I'll be back from DEF CON soon and getting things back on track. Again, these big conferences always throwing my schedule a little bit. In the meantime, you can go to Christian Joel comm slash writing to find what I've been up to there. And such podcast for other podcasts and slash newsletters for my newsletters, and I made some Japan Theme stickers you can also get if you sign one of my newsletters. Next up on my agenda will probably be STC instacart. I might go to web summit but I'm not 100% sure yet, but keep an eye on slash events if you want to catch up with me there. If you enjoyed the show, please rate review and share wherever you found it and you can also contact me on twitter at Chris. Until the next time. Thank you very much for listening.
