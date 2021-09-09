---
title: "Ransomware in Kubernetes with Veeam"
layout: podcast
created_at: 2021-06-02 14:00:00 UTC
author: ""
categories: podcast theweeklysqueak
podcast: "The Weekly Squeak"
tags: 
orig_url: https://anchor.fm/chinchillasqueaks/episodes/Ransomware-in-Kubernetes-with-Veeam-e121bl0
podcast_embed: https://anchor.fm/s/2ab8734/podcast/play/34696288/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2021-5-2%2Fe3e53f67-d250-21ab-f84f-6b0f26c05a99.mp3
image: images/347957-1622624027917-cdf191defbf5.jpg
permalink: /:categories/:title/
transcript: true
---
Infrastructure as code offers many possibilities, but introduces a large amount of potential security vulnerabilities. How can Veeam help? I speak with Michael Cade to find out.

## Transcript

Chris Ward  0:03  
Welcome to another chinchilla squeaks, my new name is not really weekly anymore, so I've changed it. And especially in cube con weeks, I think I'm up to about interview four out of cube con at the moment. And I think I have three this week. So you can look forward to two more actually tomorrow. But my guest today is Michael Cade of V beam, or is it just him? I'm not sure. How do you actually pronounce a company, it is just the end, we're going to talk specifically around the subject of ransomware. But then does a whole bunch of different things. I was looking on the website yesterday, and as far as I can tell, you actually do quite a lot of different things. So let's maybe just dig a little bit into, to what veem offers overall.

Michael Cade  0:53  
Yeah, yeah. So VMs really focused on data management. So case management is a very broad, broad topic in in today's game, right. And beam 1314 years ago, started the journey of protected virtual machines, specifically vSphere, VMware virtual machines, then Hyper V, then branched out to physical machines, unstructured data, nazz, etc. And then, even more recently adopted a way of being able to protect cloud cloud workloads, such as IRAs, and SAS base workloads, office 365, those sorts of things. And then even more recently, at the back end of 2020, yeah, that that year that we don't talk about anymore. But it was really about protecting cloud native, protecting Kubernetes workloads, applications. Obviously, there's a very different focus. But in terms of who are using this today, but data is still prevalent, state data is still has its issues, data still has its failure scenarios, I think, is a good way of overarching all of these different platforms that we all have the ability of using and choice. And yeah, I think veem is very much focused on delivering the right solution for the right platform, wherever that may be.

Chris Ward  2:17  
Can we just just just go back a little bit of steps, sometimes, when I get so many new companies, sometimes it's interesting to hear a bit more of the story from older companies. So why did veem start in the first place? What was the situation 1112 years ago, that made the company? Yeah,

Michael Cade  2:37  
yeah, so the compelling challenge out there, so we're on that cusp of physical to virtual, and a lot of the I'm gonna call them legacy backup vendors, with the easy button for them, rather than innovating was to take their agents that they had on each and every single physical machine and move them into virtual machines, that now then times that by the VM sprawl era, where we just have VMs, for fun for doing all sorts of different things, we now have to manage all of these different agents as well and different operating systems, different applications. So veem came along and went well, that's not really the ideal way of being able to do this, what we should do is actually get into the underpinning infrastructure API's, and be able to leverage those to be able to take a much more efficient backup of those virtual machines, which then reduces by being able to do it in an agentless approach, reduce the overhead of the virtual machines of the agents that were the legacy were putting on to those machines. But also, it allowed us to start hooking into API's around change, block tracking, and being able to leverage the storage layer of virtualization and kind of taking the using the abstraction layer for good, whether it was reduced backup, windows, reduce risk, all of that good stuff. So that's really where VMs started. And then they've accelerated through. And they also do something very similar with the public cloud with where we're protecting AWS as your GCP as well, right. We're using the underpinning API's.

Chris Ward  4:15  
And back in those days, and these days, well, let's say those days for now, what were the main challenges that the company was trying to prevent? What was what was getting in shouldn't have

Michael Cade  4:28  
it so interesting. So that was more around. And I would say that, so ransomware was still a thing. And I know that's what we're, we're here talking about, but it was definitely not in the news on a daily basis. The challenges were more.

Chris Ward  4:44  
I mean, it depends what news you read as

Michael Cade  4:48  
security has always been an issue, right? And I think backup backup is, is ultimately I was on a call earlier and I was talking about backup is generally quite quite a boring topic. Well, moving data from left to right, I've been in it six years I have, I think the the right to say that backup is a bit boring and always that, but it's a necessity that we, we kind of need it in the same as, like car insurance or house insurance, we need it. And we don't intend to have natural disasters and things go wrong. Yeah, set fire to things, but we need it. So I think that was the biggest challenge was mitigating risk, mitigating risk. The world of data was a very different world of data. like back then it's even more so now. Like businesses are built on on data today, they probably were back then as well. But it wasn't as front and center front of mind for the IT operations team. And I think maybe that's monetizable, I suppose. But yeah, that was probably the biggest challenge. And then also, we're on that wave of consolidation, being able to take those physical machines, consolidate them down from a virtualization point of view. Okay, that's a lot of change in a very short amount of period. Potentially training education meant that every not everyone was a an expert in virtualization and what could happen. So that then led to a lot of accidental errors, and still a failure scenario, things go wrong, people accidentally delete things, people accidentally move things into the wrong place that then get cleared out. accidental deletion is still and still is today is one of the biggest factors as to, oh, that's why you need a backup type type area. So that's probably like a snippet of that. And I mean,

Chris Ward  6:41  
it's interesting, because you don't just have the virtualized products, he also have physical desktop machines, and as is things like that. So I'm guessing this is something that generally enterprises want to, to install across their whole kind of infrastructure base from desktop users and laptop users up to Central servers and things like that, basically.

Michael Cade  7:05  
Yeah, exactly that. But when we go back to that 13 years ago, veem was very much focused on virtualization, they didn't have them surrounded, they didn't have a portfolio, they didn't have that platform that you see on the, on the website there. So that's very much. And the important thing as well from veem. And this is why, but I've been here for that long is that because I'm constantly interested and excited about what we're doing. Because it's not about ticking a box for an RFP, it's about taking that problem of agents going on a virtual machine, which is obviously the that was the rocket ship for them. In terms of customer adoption, and people buying into intervene, but they haven't just tick the box in terms of Oh, Nas backup, we're not just going to take an ndmp solution, stop protecting those workloads we're going to take, we're going to look at the problem. And we're going to look at the challenges around the problem that needs fixing. And we're going to innovate a new way of being able to do that. So we've, we implemented something called change for tracking. So rather than taking a full backup every day, which obviously takes time, the backup window takes pretty much all night on petabytes of data. Well, how do we how do we learn what has changed? Because we only need to take the backup of what's changed on a daily basis? I guess, yeah, eight? Yeah, exactly that. So on day one, we're going to obviously take everything but on day two, we're only going to take the small amount that's changed, or the relatively small amount compared to the rest. And that's really the so on each of those platform options that you see on the website. They're all they're not table stakes. There's always something in there that does something different to what the, I guess the status quo, what was there before or, or even what the native cloud does, for example, so I accepted your or

Chris Ward  9:04  
actually say, this is gonna be my next question. So let's go into that. So now we've added this Kubernetes option. Firstly, I just like to quickly ask when and when and why did the company decide to go into that space?

Michael Cade  9:19  
So strategically, we've partnered with caston. I think it was early. It was definitely early 2019 for an alliance partnership point of view. And I think it was then from a strategic point of view that we knew that this was a this was a good area of growth. We knew that for we also knew that Kubernetes is not going to be the answer to everything potentially less. Not a gambling man, but I'm pretty sure that virtualization physical cloud AI as pass etc, says they're not going away. This is just going to be another option to the the wealth of or the overwhelming or wealth of choices that we have out there. In terms of where do we run our applications? I think we see that from a data management point of view. And that was strategically why why that investment? Why that acquisition made made sense. Okay.

Chris Ward  10:22  
And how long had caston existed before that.

Michael Cade  10:26  
So I want to say 2016, that's put me on the spot there as well. But very much like to put it to put it into a point, we're at version four of the product. And that's a, generally those major releases are a are a six month release cycle. So okay, that should give you an idea of how old they are. Fair enough.

Chris Ward  10:55  
Okay. And so let's go back to where I interrupted for a second is because traditionally, I say traditionally, it sounds like a funny thing to say in relation to Kubernetes. But typically, Kubernetes is running on as many other things are AWS, Google Compute azula, maybe some other similar cloud vendors, who I'm sure for the most part all offer their own kind of backup offering security offerings, etc, etc. So yeah, why caston instead,

Michael Cade  11:28  
so so that's the interesting piece is then actually, they, the public cloud did not offer a way of being able to protect their own offerings of Kubernetes, they have the ability to protect certain elements, certain clouds, obviously have different, let's call them bells and whistles of being able to protect that. The key part to caston is that it doesn't matter where Kubernetes is running, custom will run in casting can give you the the protection that you need that as First and foremost, there's a few more other things that they do around application mobility, being able to store offsite copies of that and being able to transform into different clouds. So you might go all in today on as your but an A Ks. But tomorrow, you might want to move because the nature of Kubernetes enables you to do this is that you might want to move to Amazon Eks. And that's absolutely fine. There's no, I'm pretty sure that Microsoft don't give you that option of replicating workloads from as your to AWS and the same vice versa, wouldn't be very good from from their business angle about losing the consumption. But what we do is that caston is exactly that we can we can transform workloads from one cloud to it or one Kubernetes cluster platform to another. So that's one element of what we bring to the party around being agnostic to wherever that Kubernetes is running, whether it's on premises, running openshift. rancher.

Chris Ward  13:03  
Okay. Yeah, that makes perfect sense. So you want to have multi cloud these days. So if you rely too much on the backup and secure methods of one cloud, then that doesn't really help. So yes, yeah, exactly that. Yeah. Okay. And I mean, out of pure interest went away just by just cast them back up. So So yeah, so where is it up to you, you can opt in to where it gets its user configurable?

Michael Cade  13:33  
So yes, so the best way to explain it is that so custom runs within the same Kubernetes. cluster. And the important thing there is that everything that caston does is is also relevant to the Kubernetes API. So it lives and breathes the same API. And now the story that we told at the beginning of the talk about vSphere and how veem was founded and why veem hooked into the hypervisor layer. we leveraged the hypervisor API's to be able to take the best approach to being able to protect that workload, or custom does a very similar, a very similar thing. In terms of caste in itself. It's a very simple deployment, it's a Helm chart, okay, from a configuration point of view or disaster recovery point of view. We have disaster recovery built into our product. So we can send our counseling k 10 piece or casting k 10. Deployment over into as your into Gk really, you pick your cluster wherever that needs to be. Obviously, we've got then the ability to send other workloads into those clusters as well from a disaster recovery point of view. But then then, from a backup perspective, so we've got the ability to not only leverage the snapshots locally for really fast recovery, but then we've got the ability to offload those into object storage. We've got some interesting stuff coming as well around others. targets, one being NFS. So that's in the product today being able to just put push that to a local NFS server, rather than object, being able to to s3 compatible, being able to go to AWS s3, Microsoft as your Blob Storage, Google Cloud Storage. And then what's coming down the line, and it's pretty out there anyway, is, is around being able to go to beam backup and replication as a repository. So now you're tying everything into what you've just seen on beam.com, where those physical, virtual NAS, they all get pushed into a beam backup and replication repository. And then they can be seen and monitored and managed in this central location. So it's an option doesn't need to be there all points solutions as well, that's the important thing to that platform is you can run them all together, you made the point that some enterprises want everything protected. In some enterprises, one, I just want my Kubernetes environment protected by V net. And it's important that you've got flexibility and choice. Because we don't want to just say, Here's veem have everything, because that's not going to be conducive to what a lot of customers want or what they all want, if that makes sense.

Chris Ward  16:17  
And so the topic that we kind of came up on was ransomware and Kubernetes. So how does that relate? I mean, I kind of know what this could be about. But how does it relate relate specifically to veem and cast? And I mean, there have been examples of this recently with, you know, build systems being compromised. It's very relevant in the recent news. I don't know if that was Kubernetes, or not with the solar wind stuff. But you know, there's build systems that people just kind of think of all those problems are resolved, because it's all in code. But things can get in quite easily. So how did it How does caste and VM fit into that?

Michael Cade  17:04  
So the one the biggest example that I used in the talk last week at cube con, was around Hildegard, which is actually ransom or attackers were infiltrating into into your environment Kubernetes environment, they were setting up cam on your Kubernetes cluster, and then leveraging the cluster to mine cryptocurrency that's ultimately what we're doing. And that's very early. Yeah, and they were just and the nature of Kubernetes is that you could go in and you could delete aspects of it, but it would just keep on spinning up, and it would scale accordingly. It did everything that Kubernetes was designed to do. But I think if we rewind a touch, because this has been a VMs. beams, overall, or overarching architecture, it has very much lent itself to obviously protecting data, not only customer data for that insurance policy, that recovery, but also making sure that that data, when it lives in whatever location that be, it needs to be protected, it needs to be protected against ransomware. But this feature that customers just brought out, but also veem has had for a while is not focused on purely just ransomware. Think about accidental deletion. Think about malicious activity from inside like you can, you could go and read it right now, Chris, and you could go and buy network access to a customer to either someone that you want. Or you can pay $100 to get access to a network. And you might just have a little nose around or you might be malicious, and you might actually plant something that that does something. And that's that's absolutely happening. So. So the whole premise of immutability is by giving you the choice as to where you want to store your backups, whether they're virtual machines, whether they're physical machines, whether they're Kubernetes, stateful workloads, we want to make sure that they cannot be modified, they cannot be changed. And that's that immutability flag, that's the object lock API that we want to leverage to make sure that that is, first and foremost, that cannot be touched even from the backup administrator, they cannot change it even from the cloud administrator. They cannot change it short on like there is no way of being able to modify that data that is in that object storage bucket. So really, it's about protect, how do

Chris Ward  19:35  
you how do you how do you separate? The How do you separate wanted change versus unwanted change

Michael Cade  19:47  
though. So the way in which we write our backup format, and I'm speaking to the vmps first, but in fact, it's very similar is that so regardless of what image based backup that we write to, they will write into the same file format. So we have a V BK. And we have vi B's which the incremental backups. Remember I said about the change block tracking just the changes since the last backup. The we also in there, we have a metadata bank, a, or BBM file or metadata file, which controls which incremental backup is, is been used or which is current, what's top of the pile. So we leverage that to understand what is right. But once those vi B's and VB Ks go into this object storage bucket that is enabled for immutability with the object lock API, whether it's s3 or whether it's s3 compatible. veem doesn't we don't change those. They're immutable. We don't ever have to incrementally change them. We're adding files all the time. Now, the important part, though, is well, what happens if our retention on the veem server is 30 days? And the retention on let's call it AWS s3, but s3 compatible works as well, is 15 days. Well, then at that point, yes, they can be modified after that. 15 days, the VI B's and the VB Ks. But it's a to think about that as okay. There's a two key.

Chris Ward  21:19  
So Am I understanding correctly? Maybe? It's it's more like, kind of? Oh, yes. Buting? Because there was noise in the background? And then I don't know, what is the problem with recording back at home instead of if I understand correctly, so then it's more like, I have a cluster that's running, I do a backup of it. And something has got into that. And then I keep kind of restoring from a backup that's been optimized. Is that so

Michael Cade  21:57  
So? So there's so we've thought about that one as well. But so we do we have, we have a feature around that as well in that. And we've had that for a while. So the key key premises is that we're going to keep the backup files, they're immutable. So yeah, if you've put something into that backup file, then, and it's a time bomb, and it's going to go off on this day, every time you restore it, or it's gonna go off on reboot, or there's nothing that that feature will not save you that that feature will not help. However, okay. Okay. So hopefully that yeah, hopefully, that's clear. Where we have a feature that helps that is on the recovery, being able to scan that against antivirus software. So in an isolated environment, being able to scan that now, the same, so that that's something that we call secure store. So being able to run a scan of that through integrated antivirus. So whether that's Windows Defender, whether it's Symantec Endpoint Protection, or Isa, and there's others out there as well. But basically being able to, on the way back through being able to scan that that's more of a traditional way, that's the virtual machine. Now, when you get into Kubernetes, we've got the ability with caston, to if that is a concern that your container images full of vulnerabilities, but you need the data from the from the from the stateful, the persistent volume, so we when we have granular recovery, so we can recover that persistent volume to a, another cluster to pull the data out. We could also spin it up into its own new namespace. So we've got the flexibility of being granular there as well, so that we could again, pull the data out. And you could run a scan against that we can also push those persistent volumes back into a another pod or another application, another namespace. So there's a few options there. We don't have the integration into Cloud, native security vendors. Go in that way too much. And really, it's kind of out of scope when it comes to that discussion point of the continuous integration and that point, but yeah, they so two different things, but absolutely ransomware can sit stagnant in a file system for however long it needs to and then then attack. But this is a this is purely about if you think about the vbk format as a Word document that could be attached to an encrypted like, like any other file from ransomware. Yeah, well, the vbk format is just could be just as vulnerable. So we've thought about that and but having the vbk it has many different advantages because it allows us to do quite a lot of portability with that data as well. So being able to take physical machines directly restore them into the public cloud, being able to instantly recover them into VMware or Hyper V, regardless of where they came from. There's a lot of benefits from that. So one of the things that we just released in VBR, was the hardened Linux repository where that's your primary backup location. We're using the native Linux chatter, immutable flag, that also does a very similar thing to what we've discussed around object storage as well.

Chris Ward  25:31  
Okay, and it's interesting, because I'm not sure if I'm being slightly facetious here on the web page, it says number one Kubernetes backup. But it actually is there anyone else doing this? So it seems?

Michael Cade  25:48  
So? Yeah. And this is where the technologists hat comes on. Really? Is that? Yeah, no. Okay, in a way back up is is, is very new in this space. Yeah.

Chris Ward  26:01  
It's actually interesting. I was doing a wrap up post for cube con. And I kind of downplayed this. And now I'm thinking I need to apply it like I, I first encountered Docker and Kubernetes latterly, in those days, it was actually more me sauce, when I was working for a database provider, and doing persistent storage in containers very difficult then. And then it really seems like especially this cube con that became very mature. And there was loads of people I've spoken to over the past few months doing some kind of storage related thing in Kubernetes, is that the time has come? Basically.

Michael Cade  26:35  
Yeah, and it is super simple to deploy your database and have it up and running and scale up scale down all of the

Chris Ward  26:44  
blob, blob data and all the others. There's a there's an interview from not that long ago on the channel, if you're interested from Mineo as well, which is kind of similar i

Michael Cade  26:59  
mean, i o is a great option for us to store that data in an immutable fashion as well. So that it kind of goes hand in hand is that we're talking about using object storage as where we store that data that mean I O obviously runs can run on your Kubernetes cluster as well. So although we wouldn't say brought back up to the same location as your production, but mean, I might sit on one cluster and offer our object storage as a backup target, as well as maybe a content delivery network as well. But ultimately that yeah, it gives. That's a great, that's a great I guess, a nod to s3 compatible storage that we can store our backup to. Yeah, yeah. To go back to your your point around stateful, that I was involved in the the organization of cloud native data management days, which was a co located event at cube con. Okay. And obviously, there we're talking about data management, database vendors were involved as well as the community on how like, basically the tales from the field around data? Well, we know that data is generally going to be, if we call it data, we're going to give it the term state because everything else is is going to either being contained in the container. didn't really think that one through but but like a website is built into it, we don't care about it, because we can just bring the container back, when we start looking at databases that are consumed from an external source, and potentially added to from the external source. Things like version control, continuous delivery, that cannot, that doesn't capture the database. And as you'll know, there as well, Chris, is that Yeah, at that point, yeah, we can get all of the good configuration back. But that's not a lot of good without the persistent volume of all your customer data in. So that's really where we're really seeing an uptick in, in the in the market.

Chris Ward  28:58  
So if you are number one, in a field of one to coin, an old phrase, or number one in a very small field.

Michael Cade  29:06  
Yeah, I think small field is probably a fair There are so there are people that are doing things, but

Chris Ward  29:11  
how will you like if more and more people spot this as a potential business? How will you keep ahead of the competition?

Michael Cade  29:21  
So I think the biggest thing is, is that so I come from an infrastructure background. So creating backup jobs, creating policy, creating the the backups, looking into the database and creating the database backup on a scheduled basis. That's one area of being able to protect that workload. But as we know, from a Kubernetes point of view, people are deploying code they're changing. There's obviously a different way of delivery when it comes to Kubernetes or cloud native. So one of the things that we've done is, we've built our product on Native Kubernetes API's. Okay? So what that then enables is that as part of that continue continuous delivery, continuous deployment, where we can create hooks that whole get up small model to be able to create based on code commits code deployments, we can say, Okay, before we before we put this update into our system, let's just, let's just take a backup, an off the cuff backup, it's not scheduled, we're just going to do it an ad hoc, just so that if anything changes, if anything breaks, we got a restore point. Because the developer doesn't really care too much about the state of the data. Yeah. And yeah, also bothered about the data that

Chris Ward  30:50  
Yeah. As a database, perfect into that flow. Yeah. And then this is, I think, where a lot of projects are coming on board right now is making data, a first class citizen along with infrastructure and application and everything else in Kubernetes. And it's always been difficult. And I remember even remember, the days when I used to do CMS development. And something like Ruby on Rails migrations were the most amazing thing ever.

Michael Cade  31:22  
Evolution, isn't it? It's about the evolution of being able to adapt and exactly what you've said, Chris, about that data becomes kind of front and center for this cube con, it was very much Yeah, state ball was

Chris Ward  31:36  
never an exit. Now.

Michael Cade  31:39  
Looking at this world, it was all like everything is web scale, everything is server. Sorry, everything is stateless. spin up, spin down, get rid of it, pets versus cattle, all that stuff, which is still that's still very much the reason but data as

Chris Ward  31:54  
your field, you want to keep the field there all the time. Yeah, there you go.

All right. So veem is the e a m, and caston ksds. I do believe I just bring it up for a second if people want to get in touch with you, if people can. I think if you're looking at the video at sufficient size, you should be able to read that. Michael Cade one who's Michael Cade. No one.

Michael Cade  32:25  
Well, so. Yeah. So Michael Cade, like with no one. Yeah. He's an actor in a school TV show. He has less he has less followers than me. But I think we've had that we've had that spat on on Twitter, and that

Chris Ward  32:48  
I may have had this with the there's actually a proper Christian jeweler as well, a Canadian actor who we've had various disagreements.

And I will very, very quickly because I actually need to, to jump to another engagement. But it's very, very quickly say what's on the roadmap for the next six months.

Michael Cade  33:13  
So big focus is around integrated into Veen backup replication, making that platform more of an option or more of an achievable target to be able to store your backups. And this sort of stuff that we're doing around intelligence and policies that that's probably all like, I'm allowed to say before I get fired, but some really important stuff. So So that'll be that'll be really interesting. So I expect to see quite a bit more will there'll be another release around. Or another big release, we release every two weeks anyway, but there'll be another big release around cube con North America which hopefully will all be there in person that will be a very strange but exciting experience.

Chris Ward  33:56  
Hopefully, I'm currently trying to figure some stuff like that out for I've got speaking engagements again, it's like, oh, can I actually get very good, let's enter the the lottery that is. Anyway, let's getting this getting we're getting off subject and the UK is a little bit further ahead of Germany at the moment. So yes. But now anything can change sufficient it is rapidly changing here, much like the container, the container ecosystem. See? subtle, subtle, subtle pathway This is. So Michael, thank you very much for your time. And yeah, v v v double e a m.com. If you're interested in finding more and there is a relatively generous free edition, at least for kicking the tires to see if it suits you. And then it jumps up in price quite a bit. So I think you need to know that you definitely want this but I think you'll probably you will understand the use case if you're in that kind of space. I think

Michael Cade  35:03  
Yeah, so the big, big thing from a beam point of view is obviously community. So not only is it obviously tried before you potentially have to buy and see what it does, if it fixes a problems, the solution to a problem 100 nodes, which is,

Chris Ward  35:18  
which is quite a lot in in Kubernetes kind of world.

Michael Cade  35:22  
So, so the the free tier, especially from a customer's point of view, that gives you 10 nodes, so 10 worker nodes as well, free forever. All right, looking like a sales pitch. But yeah, I think it's

Chris Ward  35:36  
more because I like, like people on who watch and listen to the show to go and better go and try things. And that's kind of why I'm more interested in telling them, you know, yeah, yeah. Because developer audience like not necessarily people who signed the checks, but they want to go and experiment.

Michael Cade  35:53  
So the other thing that I'd point out, because not everyone wants to go and download some software from a Helm chart that they've never looked at before in play, which I completely agree. That's obviously an option you can do that as a free for. So 10, free worker nodes, free forever. But then there's also a hands on lab. Okay. So if you go to custom.io, hands on lab, you can walk through, and it walks through your scenario, but it actually gives you a Kubernetes cluster. Now, I'm not saying in fact, you can't go go and run your mission critical systems on there. But can I give you a look in the feel of of what it looks like? I think it turns out after an hour or so, but yeah, you've been warned. Don't. Don't start using that for your video streaming or anything like that.

Chris Ward  36:47  
All right. Thank you very much for your time. Lovely to speak with you. And

Michael Cade  36:52  
yeah. Cool, Chris. Thank you very much. Take

Chris Ward  36:55  
care. Bye bye.