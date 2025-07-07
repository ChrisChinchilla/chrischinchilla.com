---
title: "How blockchain will disrupt traditional computing"
publishDate: 2017-10-04 13:01:01 UTC
author: "Chris Ward"
categories: writing dzone
tags:
  - Blockchain
  - Computing
publication_url: "https://techbeacon.com/how-blockchain-will-disrupt-traditional-computing"
image: "/src/assets/images/articles/blockchain-disrupt-it.jpg"

---

[Blockchain-based
technologies](https://techbeacon.com/tags/blockchain){.markup--anchor
.markup--p-anchor data-href="https://techbeacon.com/tags/blockchain"
rel="noopener" target="_blank"} have moved away from just supporting
cryptocurrencies. One hot area for IT Ops is smart contracts, which let
you store, verify, and execute code on a blockchain. And multiple
projects now under way promise to replace traditional elements of the
compute stack, from processing to storage to communications, with this
approach.

### Blockchain is already changing IT operations {#354a .graf .graf--h3 .graf-after--p name="354a"}

Blockchain technology is already having an impact on these three core
building blocks of compute infrastructure:

<figure id="c649" class="graf graf--figure graf-after--p">
<img src="https://cdn-images-1.medium.com/max/800/0*BeKFg60CKvMvBnfW."
class="graf-image" data-image-id="0*BeKFg60CKvMvBnfW." data-width="614"
data-height="345" />
</figure>

*The projects that will transform the three core elements of computing:
storage, processing, and communications.*

### Processing {#620c .graf .graf--h3 .graf-after--p name="620c"}

Processing, one of the first areas that blockchain disrupted, has the
most mature ecosystem. In traditional computing, CPUs and graphics
processing units (GPU) handle processing logic (including modern,
cloud-based distributed processing), in collaboration with
high-performance processing algorithms, models, and tools such as
MapReduce, Spark, and TensorFlow.

#### Ethereum and Hyperledger {#57fe .graf .graf--h4 .graf-after--p name="57fe"}

[Ethereum](https://www.ethereum.org/){.markup--anchor .markup--p-anchor
data-href="https://www.ethereum.org/" rel="noopener" target="_blank"}
revolutionized blockchain when it allowed users to run other forms of
transactions on a blockchain aside from financial transactions, and it
underpins many of the other options described below.

Ethereum introduced the concept of smart contracts to the blockchain,
opening up a world of opportunities. Many blockchain-based projects
today use Ethereum, or something based on it, to handle logical
processing and verification.

[Hyperledger](https://www.hyperledger.org/){.markup--anchor
.markup--p-anchor data-href="https://www.hyperledger.org/"
rel="noopener" target="_blank"} consists of eight tools and projects.
Deciding which to use where is challenging, but you should start with
[Hyperledger
Fabric](https://www.hyperledger.org/projects/fabric){.markup--anchor
.markup--p-anchor
data-href="https://www.hyperledger.org/projects/fabric" rel="noopener"
target="_blank"}, which provides foundations for identity, privacy, and
processing, and build components on top of it. The good news is that the
entire Hyperledger project is designed for enterprise users, and the
tooling reflects that.

For example, Ethereum runs as either a public or private blockchain, but
Hyperledger Fabric is private. It offers a choice of enterprise-friendly
programming languages for smart contracts, while Ethereum uses its own
JavaScript-like language. And it lets you define your own understanding
of "consensus" and "currency." That may sound contrary to the principles
put forth by blockchain purists, but it's essential for widespread
adoption to occur.

For more detail on the differences between Ethereum, Hyperledger, and
[Corda](https://github.com/corda/corda){.markup--anchor
.markup--p-anchor data-href="https://github.com/corda/corda"
rel="noopener" target="_blank"} (for the finance sector), read this
[Philipp Sander blog
post](https://medium.com/@philippsandner/comparison-of-ethereum-hyperledger-fabric-and-corda-21c1bb9442f6){.markup--anchor
.markup--p-anchor
data-href="https://medium.com/@philippsandner/comparison-of-ethereum-hyperledger-fabric-and-corda-21c1bb9442f6"
target="_blank"}.

[Monax](https://monax.io/){.markup--anchor .markup--p-anchor
data-href="https://monax.io/" rel="noopener" target="_blank"} provides
SDKs for the finance, insurance, and logistics industries. Monax came
out in the same time frame as Ethereum and Hyperledger, and while it has
been eclipsed by those projects, it still contributes heavily to
upstream projects, and the project's community works hard to ensure that
the technology works well with others. For example, [it moved the core
open software to
Hyperledger](https://monax.io/blog/2017/02/28/why-were-joining-hyperledger/){.markup--anchor
.markup--p-anchor
data-href="https://monax.io/blog/2017/02/28/why-were-joining-hyperledger/"
rel="noopener" target="_blank"}, and the project is a member of [the
Enterprise Ethereum
Alliance](https://monax.io/2017/03/01/why-were-joining-the-enterprise-ethereum-alliance/){.markup--anchor
.markup--p-anchor
data-href="https://monax.io/2017/03/01/why-were-joining-the-enterprise-ethereum-alliance/"
rel="noopener" target="_blank"}.

Alternatives to Ethereum are emerging.
[Aeternity](https://www.aeternity.com/technology){.markup--anchor
.markup--p-anchor data-href="https://www.aeternity.com/technology"
rel="noopener" target="_blank"} simplifies things by focusing on
financial applications and removing state from the blockchain. [This
Reddit
post](https://www.reddit.com/r/ethereum/comments/5px7in/thoughts_on_aeternity_blockchain_project_vs/){.markup--anchor
.markup--p-anchor
data-href="https://www.reddit.com/r/ethereum/comments/5px7in/thoughts_on_aeternity_blockchain_project_vs/"
rel="noopener" target="_blank"} digs into details.

#### High-performance computing {#1070 .graf .graf--h4 .graf-after--p name="1070"}

The decentralized nature of blockchain should make it ideal for
massive-scale processing systems, but its design currently limits
scaling. Ambitious projects such as
[Golem](https://golem.network/index.html){.markup--anchor
.markup--p-anchor data-href="https://golem.network/index.html"
rel="noopener" target="_blank"} and
[iEx.ec](http://iex.ec/){.markup--anchor .markup--p-anchor
data-href="http://iex.ec/" rel="noopener" target="_blank"}, which aspire
to create decentralized supercomputers or cloud computing without vendor
lock-in, are ambitious projects that are still in the early stages.

The [TrueBit](https://truebit.io/){.markup--anchor .markup--p-anchor
data-href="https://truebit.io/" rel="noopener" target="_blank"} project
is attempting to solve this problem by offloading consensus to specific
computers in a network. There's not much detail on the project's
website, but it has published a [TrueBit
whitepaper](https://people.cs.uchicago.edu/~teutsch/papers/truebit.pdf){.markup--anchor
.markup--p-anchor
data-href="https://people.cs.uchicago.edu/~teutsch/papers/truebit.pdf"
rel="noopener" target="_blank"} that details how it might work.

The computing potential of blockchain hinges on the production success
of these projects, or projects like them. These communities say they are
confident that this will happen in the next year.

### Storage {#f6a6 .graf .graf--h3 .graf-after--p name="f6a6"}

Storage is a major area of blockchain disruption. Several offer a viable
option for large-scale storage, although they suffer from some of the
same blockchain issues mentioned above.

Traditional computing storage falls into two camps: file and database
storage. There are myriad options in both camps, from projects for
individual desktop machines to large-scale storage projects such as
HDFS, S3, MongoDB, and Cassandra.

Some of the key projects under way include:

<figure id="a685" class="graf graf--figure graf-after--p">
<img src="https://cdn-images-1.medium.com/max/800/0*OGoWG7sPIcczmgRA."
class="graf-image" data-image-id="0*OGoWG7sPIcczmgRA." data-width="614"
data-height="346" />
</figure>

*\* Note: This is just a summary; there are dozens of other cash and
asset projects under way.*

#### File storage {#394d .graf .graf--h4 .graf-after--p name="394d"}

[The InterPlanetary File System](https://ipfs.io/){.markup--anchor
.markup--p-anchor data-href="https://ipfs.io/" rel="noopener"
target="_blank"} (IPFS) project straddles storage and communication. One
of the early applications that looked at blockchain in a new way, IPFS
is fairly mature and has a developed ecosystem.

While the HTTP protocol downloads a single file from a single machine at
a time, IPFS downloads pieces of a file from multiple decentralized
machines simultaneously. In some ways, it's like torrenting, [but with
other ideas also thrown
in](https://discuss.ipfs.io/t/ipfs-vs-webtorrent-what-the-value-of-using-ipfs-instead-of-torrent-files/64/2){.markup--anchor
.markup--p-anchor
data-href="https://discuss.ipfs.io/t/ipfs-vs-webtorrent-what-the-value-of-using-ipfs-instead-of-torrent-files/64/2"
rel="noopener" target="_blank"}, such as Git. With considerations built
in for convenient file naming and solid use cases, it's a promising
technology. You can find client libraries for
[JavaScript](https://github.com/ipfs/js-ipfs-api){.markup--anchor
.markup--p-anchor data-href="https://github.com/ipfs/js-ipfs-api"
rel="noopener" target="_blank"},
[Python](https://github.com/ipfs/py-ipfs-api){.markup--anchor
.markup--p-anchor data-href="https://github.com/ipfs/py-ipfs-api"
rel="noopener" target="_blank"},
[Swift](https://github.com/ipfs/swift-ipfs-api){.markup--anchor
.markup--p-anchor data-href="https://github.com/ipfs/swift-ipfs-api"
rel="noopener" target="_blank"},
[C++](https://vasild.github.io/cpp-ipfs-api/){.markup--anchor
.markup--p-anchor data-href="https://vasild.github.io/cpp-ipfs-api/"
rel="noopener" target="_blank"}, and other languages. The project team
is trying hard to make using IPFS as seamless as possible.

Swarm is an Ethereum component that works in a similar way to IPFS, but
handles communication and storage of files. It doesn't offer such a
seamless way to get started, but if you are already investigating
Ethereum for its other components, then [read the documentation for more
details](http://swarm-guide.readthedocs.io/en/latest/introduction.html){.markup--anchor
.markup--p-anchor
data-href="http://swarm-guide.readthedocs.io/en/latest/introduction.html"
rel="noopener" target="_blank"}.

[Filecoin](https://filecoin.io/){.markup--anchor .markup--p-anchor
data-href="https://filecoin.io/" rel="noopener" target="_blank"} takes a
different approach, instead offering a mechanism for tracking
transactions between blocks of spare storage around data centers and the
Internet. It allows you to use traditional storage, but via a blockchain
layer that lets users bid for space you offer and tracks their usage of
it.

#### Databases {#1e1a .graf .graf--h4 .graf-after--p name="1e1a"}

[BigchainDB](https://www.bigchaindb.com/){.markup--anchor
.markup--p-anchor data-href="https://www.bigchaindb.com/" rel="noopener"
target="_blank"} takes one of the more interesting approaches, letting
an existing database
([MongoDB](https://www.mongodb.com/){.markup--anchor .markup--p-anchor
data-href="https://www.mongodb.com/" rel="noopener" target="_blank"} and
[RethinkDB](http://rethinkdb.com/){.markup--anchor .markup--p-anchor
data-href="http://rethinkdb.com/" rel="noopener" target="_blank"}) and a
blockchain layer focus on what they are both individually good at. This
gives you provable large-scale storage with a long track record, but
with the accountability and transaction support that blockchain offers.
The project has been in development for some time [but doesn't claim to
be production-ready
yet](https://docs.bigchaindb.com/en/latest/production-ready.html){.markup--anchor
.markup--p-anchor
data-href="https://docs.bigchaindb.com/en/latest/production-ready.html"
rel="noopener" target="_blank"}.

Because IPFS can read and write files while databases write them, it
made sense that someone would think of using IPFS as a database.
[OrbitDB](https://github.com/orbitdb/orbit-db){.markup--anchor
.markup--p-anchor data-href="https://github.com/orbitdb/orbit-db"
rel="noopener" target="_blank"} does that. This small open-source
project hasn't seen much activity in the last few months, but it's
perfect for web projects that need simple storage.

### Communication {#5d25 .graf .graf--h3 .graf-after--p name="5d25"}

Two venerable protocols, TCP/IP and HTTP, underpin the majority of
communication online, while other protocols and models work on top of
those. Although blockchain won't replace either protocol, some projects
are attempting to create standards for communication between
blockchain-based applications.

This is especially useful for competing organizations creating their own
applications. But some members of the community feel this moves them
away from the original intention of the technology and are keen to have
standard methods for keeping blockchains aware of each other.

Here are the key communications protocols and projects associated with
blockchain:

#### Interledger protocol {#a10f .graf .graf--h4 .graf-after--p name="a10f"}

Released by payment solution
[Ripple](http://ripple.com/){.markup--anchor .markup--p-anchor
data-href="http://ripple.com/" rel="noopener" target="_blank"}, the
[Interledger](https://interledger.org/){.markup--anchor
.markup--p-anchor data-href="https://interledger.org/" rel="noopener"
target="_blank"} protocol (ILP) aims to connect different
cryptocurrencies, but not more general blockchains. It abstracts
individual wallets, payment gateways, and banks, and allows developers
to code
[connectors](https://interledgerjs.github.io/ilp-connector/apidoc/){.markup--anchor
.markup--p-anchor
data-href="https://interledgerjs.github.io/ilp-connector/apidoc/"
rel="noopener" target="_blank"} between them.

#### Cosmos {#845d .graf .graf--h4 .graf-after--p name="845d"}

For broader blockchains,
[Cosmos](https://cosmos.network/){.markup--anchor .markup--p-anchor
data-href="https://cosmos.network/" rel="noopener" target="_blank"} aims
to create an "Internet of blockchains." That's a big task, and the team
[raised \$17 million in a
half-hour](https://fundraiser.cosmos.network/){.markup--anchor
.markup--p-anchor data-href="https://fundraiser.cosmos.network/"
rel="noopener" target="_blank"} by way of an initial coin offering
([ICO](https://en.wikipedia.org/wiki/Initial_coin_offering){.markup--anchor
.markup--p-anchor
data-href="https://en.wikipedia.org/wiki/Initial_coin_offering"
rel="noopener" target="_blank"}).

Not much detail has emerged as to how this will work, but according to
the project's
[whitepaper](https://cosmos.network/whitepaper){.markup--anchor
.markup--p-anchor data-href="https://cosmos.network/whitepaper"
rel="noopener" target="_blank"} and [this blog
post](https://medium.com/@cryptojudgement/cosmos-discovering-interoperability-of-blockchains-5f284d7867b7){.markup--anchor
.markup--p-anchor
data-href="https://medium.com/@cryptojudgement/cosmos-discovering-interoperability-of-blockchains-5f284d7867b7"
target="_blank"}, the approach will be to introduce an intermediary
token (an atom) that acts like a trading mechanism between tokens from
other blockchains. This will happen by way of hubs (the first will be
the Cosmos hub), while the atom allows for the system to fund itself. In
some ways it's like traditional exchange and translation mechanisms,
where you pay the middle person for their time.

#### Polkadot {#1bac .graf .graf--h4 .graf-after--p name="1bac"}

In a paper last year, [Polkadot](https://polkadot.io/){.markup--anchor
.markup--p-anchor data-href="https://polkadot.io/" rel="noopener"
target="_blank"} introduced the [concept of
parachains](http://github.com/polkadot-io/polkadotpaper/raw/master/PolkaDotPaper.pdf){.markup--anchor
.markup--p-anchor
data-href="http://github.com/polkadot-io/polkadotpaper/raw/master/PolkaDotPaper.pdf"
rel="noopener" target="_blank"}. While Cosmos focuses on token exchange,
Polkadot's approach focuses on the finalization of transactions. Think
of it as maintaining state as you would in a distributed application.

Parachains facilitate communication between blockchains but have no
power to finalize a transaction. Polkadot is in its early days, but you
can get more details by reading the whitepaper or [this blog
post](https://keepingstock.net/a-dummies-guide-to-polkadot-and-parachains-93708bd90775){.markup--anchor
.markup--p-anchor
data-href="https://keepingstock.net/a-dummies-guide-to-polkadot-and-parachains-93708bd90775"
rel="noopener" target="_blank"}.

#### Interplanetary Database (IPDB) {#5ccf .graf .graf--h4 .graf-after--p name="5ccf"}

[IPDB](https://ipdb.foundation/){.markup--anchor .markup--p-anchor
data-href="https://ipdb.foundation/" rel="noopener" target="_blank"}
builds on top of BigchainDB to offer something of a "network of
databases." Recognizing that blockchain projects are becoming
increasingly centralized, it wants to encourage its users to store data
in a governance model where there is no single owner or caretaker. A
bold statement, but again, technical implementation is yet to be
defined, as is the enthusiasm of private data holders.

### Other blockchain projects that could affect IT operations {#7430 .graf .graf--h3 .graf-after--p name="7430"}

There are a handful of other projects that, like Ethereum, fall into
more than one category. Here's a short list of such projects.

-   [[Project
    Bletchly](https://azure.microsoft.com/en-us/blog/bletchley-blockchain/){.markup--anchor
    .markup--li-anchor
    data-href="https://azure.microsoft.com/en-us/blog/bletchley-blockchain/"
    rel="noopener" target="_blank"}, in combination with Azure's
    [blockchain as a
    service](https://azure.microsoft.com/en-us/blog/ethereum-blockchain-as-a-service-now-on-azure/){.markup--anchor
    .markup--li-anchor
    data-href="https://azure.microsoft.com/en-us/blog/ethereum-blockchain-as-a-service-now-on-azure/"
    rel="noopener" target="_blank"}, is Microsoft's take on networking,
    consensus, database, and virtual machines for blockchain.]{#0d64}
-   [[Scuttlebot](http://scuttlebot.io/){.markup--anchor
    .markup--li-anchor data-href="http://scuttlebot.io/" rel="noopener"
    target="_blank"} is a peer-to-peer log store you can use for
    messaging or as a simple database. It's not explicitly a blockchain
    application, but it's similar in concept.]{#a13c}
-   [Several enterprises have created their own forks of projects with
    features they need. For example
    [Quorum](https://github.com/jpmorganchase/quorum){.markup--anchor
    .markup--li-anchor
    data-href="https://github.com/jpmorganchase/quorum" rel="noopener"
    target="_blank"}, from JPMorgan Chase, is an Ethereum fork that adds
    privacy and other consensus mechanisms.]{#bcc3}
-   [[Plasma](https://plasma.io/plasma.pdf){.markup--anchor
    .markup--li-anchor data-href="https://plasma.io/plasma.pdf"
    rel="noopener" target="_blank"} is a new proposal that attempts to
    solve blockchain's core issues with scalability and speed.Think of
    it as a simple version of Polkadot, but that connects chains of
    state.]{#c908}

### Are you ready for blockchain? {#7873 .graf .graf--h3 .graf-after--li name="7873"}

That's the blockchain landscape in a nutshell. Does all this mean that
IT will soon be replacing and managing today's compute, storage, and
communications technologies with blockchain-based technologies? Probably
not right away.

One of the biggest issues with blockchain technology, despite some
community members pushing for standards and collaboration, is the number
of projects competing to solve the same problems. For those technologies
to become viable, each needs to focus on solving the problems that are
holding the technology back from mainstream adoption.

That said, IT Ops pros would do well to watch this space carefully. Once
those problems are resolved, you may find yourself considering
blockchain-based options for replacing compute, storage, or
communication technology in your enterprise.

*This article was inspired by a slide in a presentation from blockchain
visionary* [*Trent McConaghy*](http://trent.st/){.markup--anchor
.markup--p-anchor data-href="http://trent.st/" rel="noopener"
target="_blank"}*, one of the founders of*
[*Ascribe*](https://www.ascribe.io/){.markup--anchor .markup--p-anchor
data-href="https://www.ascribe.io/" rel="noopener" target="_blank"}*,*
[*BigchainDB*](https://www.bigchaindb.com/){.markup--anchor
.markup--p-anchor data-href="https://www.bigchaindb.com/" rel="noopener"
target="_blank"}*, and the* [*IPDB
Foundation*](https://ipdb.foundation/){.markup--anchor .markup--p-anchor
data-href="https://ipdb.foundation/" rel="noopener" target="_blank"}*.*
