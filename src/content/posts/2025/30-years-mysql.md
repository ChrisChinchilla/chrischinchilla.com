---
title: At 30 years old, can MySQL Revamp Itself for the AI Age?
publishDate: 2025-08-14T00:00:00.000Z
author: Chris Ward
categories:
  - writing
tags:
  - Databases
  - Mysql
  - AI
image: /src/assets/images/articles/mysql.jpg
summary: >-
  On May 23rd 2025, the MySQL database celebrated its 30th anniversary. Look at the usage trends for databases on DB-engine and MySQL and its owner since 2010, Oracle's own product occupy the top two spots. However, the same rankings show that the popularity of most of the top four is declining, especially for MySQL.
  
  It has been in slow decline since the era of "cloud computing" began, but like many other areas of technology, it is the demands of and for artificial intelligence (AI) that are causing the most pressure. As it celebrates its 30th year, what is the project doing to remain relevant and competitive in the new AI age? With rivals hot on its tail and some of its biggest competitors offering fully compatible, free alternatives, how does it plan to survive for another 30 years? 
---
On May 23rd 2025, the MySQL database celebrated its 30th anniversary. [Look at the usage trends for databases on DB-engine](https://db-engines.com/en/ranking)(a respected database comparison and ranking site) and MySQL and its owner since 2010, Oracle's own product occupy the top two spots. However, the same rankings show that [the popularity of most of the top four is declining](https://db-engines.com/en/ranking_definition), especially for MySQL.

It has been in slow decline since the era of "cloud computing" began, but like many other areas of technology, it is the demands of and for artificial intelligence (AI) that are causing the most pressure. As it celebrates its 30th year, what is the project doing to remain relevant and competitive in the new AI age? With rivals hot on its tail and some of its biggest competitors offering fully compatible, free alternatives, how does it plan to survive for another 30 years? 

But before looking to the future, let's take a quick trip back in time to understand the principles of databases like MySQL.

## The origins of relational databases and  SQL

At the heart of many applications is data, typically stored in a database. One of the oldest is a relational database, which defines entries as a series of columns and rows in tables. The rows represent entries, the columns the values of those entries, and a table is a collection of related data. You then relate data between tables referencing the unique IDs of rows. For example, you could relate a row in a table of authors to their articles in a table of articles.

This relational model originated as [an idea in 1970 in a paper by E.F. Codd](https://dl.acm.org/doi/10.1145/362384.362685). It wasn't until the beginning of the Web 2.0 era in the late 1990s that relational databases came into their own, powering many of the dynamic websites that emerged during that time. Even at the time of writing, [according to DB-Engines](https://db-engines.com/en/ranking), the top four most widely used databases are all relational, including MySQL and PostgreSQL. 

MySQL is open source and has been since its inception on May 23, 1995. However, it has a checkered ownership history, owned independently until 2008, when it was acquired by Sun Microsystems, and in 2010, Oracle acquired Sun. The Oracle acquisition caused such upset at the time that one of MySQL's creators, [Michael "Monty" Widenius](https://monty-says.blogspot.com/), forked (created a new open source alternative based on the current code) MySQL, creating the [MariaDB](https://mariadb.com/) project, which remains a popular alternative. [Percona](https://www.percona.com) also maintains a popular fork. 

As Peter Zaitsev, cofounder of Percona, noted why MySQL became popular in the first place and was his database of choice back in 1999.

"At the time, PostgreSQL was the database for smart people, and if you weren't smart enough for PostgreSQL, then you probably shouldn't be using a database at all. The MySQL approach was to be a database for everyone.  It understood that a lot of people had no clue what they were doing and made them successful. It focused on making things easy."

As the 2000s became the 2010s, developers adopted new approaches to cope with increased and sometimes unpredictable demand, leading to the emergence of new paradigms in NoSQL databases, collectively referred to as "Not only SQL". Typically, instead of using tables, rows, and columns, they use a single data structure of some form.

The "SQL" part of MySQL stands for "Structured Query Language", a language for managing and querying data, typically in relational databases. MySQL was not the first database to use SQL. It began in the 1970s, but the syntax has become so familiar for interacting with data that even the "alternative" NoSQL databases often boast compatibility with SQL.

More recently, subsets of NoSQL databases, Graph and Vector databases, which use graph and vector structures to represent and store data, experienced a resurgence in popularity. This is largely due to the growing adoption of the new wave of AI-based applications, which often read and write data in similar structures.
## Vector and Graph storage and search

**Vector** databases organize data as points in a multi-dimensional space. The point is the item of data, and its location relative to other points represents how it relates to other data. For example, a database stores two points that represent "cat" and "dog" closer to each other than "cat" and "microphone". This makes vector databases well-suited for use cases such as recommendation systems, anomaly detection, and, yes, the kinds of natural language processing and LLM retrieval-augmented generation (RAG) that many new AI tools use.

**Graph** databases also organize data as individual points, called nodes, and the relationships between them are edges. Think of a transit map or a spider's web, and that's basically how a graph database stores data. In some ways, this sounds like a relational database, but unlike tables and columns, the schema isn't fixed and can change over time. This makes graph databases well-suited to analytics and crucially for AI, knowledge graphs.

### How is MySQL tackling this?

For MySQL itself, it's unclear. The latest [version 9 added a new `VECTOR` data type](https://dev.mysql.com/doc/refman/9.0/en/vector.html), meaning it's possible to store vector data, but there are no vector search features yet. The open source community maintains plugins that add vector search, and [Oracle sells a commercial version of MySQL](https://www.oracle.com/mysql/) with vector storage and search.

[MariaDB added vector storage and search support](https://mariadb.org/projects/mariadb-vector/) in version 11.7 in November 2024.

## Stored programs and procedures

In many complex data-heavy applications, accessing databases is a speed and performance bottleneck. Stored procedures are a way to reduce communication between application code and the database by creating a batch of SQL commands that an application can then execute. They mean that a database administrator can focus on the tasks they excel at, rather than relying on a developer to write and maintain business logic.

As the lines between roles in modern software development projects blurred, some databases added support for stored programs, which, instead of using pure SQL, use a programming language.

NoSQL databases don't always have an exact equivalent to stored procedures and programs. They generally introduce more efficient ways to bring code logic closer to the database, such as the [MapReduce programming model](https://static.googleusercontent.com/media/research.google.com/es/us/archive/mapreduce-osdi04.pdf).

In the context of AI, stored procedures and programs help with tasks such as pre-processing large amounts of data before returning it to the application, and enable more real-time inference as data arrives in the database.
### How is MySQL tackling this?

MySQL has had stored procedures since version 5 in 2005, but [stored programs arrived in version 9](https://dev.mysql.com/doc/refman/9.3/en/srjs-examples.html), allowing you to store JavaScript programs.

Neither MariaDB nor Percona supports stored programs, but they do support stored procedures.

## Will it matter?

Ask for advice on database recommendations to create an AI-powered application, and the answers are options such as [Pinecone](https://www.pinecone.io/), [Milvus](https://milvus.io/), and [MongoDB](https://mongodb.com). [PostgreSQL](https://postgresql.org), only a year younger than MySQL, is the only SQL database that frequently appears thanks to its popular [pgvector plugin](https://github.com/pgvector/pgvector). However, so much has been built on top of MySQL over the past 30 years that it's not going anywhere anytime soon. Oracle and MySQL have a LOT of legacy users, so these new features will help those users transition to some form of AI-powered application. Will it be enough? Will it attract new users to MySQL?

As Zaitsev put it, "In 1999, when I was trying to find a database for a new startup project, MySQL was the fastest. It was fastest because it didn't support transactions (a mechanism that ensures data integrity of operations). MySQL said it would never support transactions. [But added support eventually in 2002](https://blogs.oracle.com/mysql/post/mysql-retrospective-the-early-years)."

It's never too late.