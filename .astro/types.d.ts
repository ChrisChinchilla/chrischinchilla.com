declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"client": {
"chronosphere.md": {
  id: "chronosphere.md",
  slug: "chronosphere",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"codeship.md": {
  id: "codeship.md",
  slug: "codeship",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"consensys.md": {
  id: "consensys.md",
  slug: "consensys",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"coralogix.md": {
  id: "coralogix.md",
  slug: "coralogix",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"cultofmac.md": {
  id: "cultofmac.md",
  slug: "cultofmac",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"data-artisans.md": {
  id: "data-artisans.md",
  slug: "data-artisans",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"devspotlight.md": {
  id: "devspotlight.md",
  slug: "devspotlight",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"dgraph.md": {
  id: "dgraph.md",
  slug: "dgraph",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"dzone.md": {
  id: "dzone.md",
  slug: "dzone",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"envato.md": {
  id: "envato.md",
  slug: "envato",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"ethereum-foundation.md": {
  id: "ethereum-foundation.md",
  slug: "ethereum-foundation",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"eventstore.md": {
  id: "eventstore.md",
  slug: "eventstore",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"exoscale.md": {
  id: "exoscale.md",
  slug: "exoscale",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"facebook-messenger.md": {
  id: "facebook-messenger.md",
  slug: "facebook-messenger",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"faria.md": {
  id: "faria.md",
  slug: "faria",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"gitlab.md": {
  id: "gitlab.md",
  slug: "gitlab",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"here.md": {
  id: "here.md",
  slug: "here",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"humanitec.md": {
  id: "humanitec.md",
  slug: "humanitec",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"libcamera.md": {
  id: "libcamera.md",
  slug: "libcamera",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"pagerduty.md": {
  id: "pagerduty.md",
  slug: "pagerduty",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"progress.md": {
  id: "progress.md",
  slug: "progress",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"sitepoint.md": {
  id: "sitepoint.md",
  slug: "sitepoint",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"sqreen.md": {
  id: "sqreen.md",
  slug: "sqreen",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"takipi.md": {
  id: "takipi.md",
  slug: "takipi",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"techbeacon.md": {
  id: "techbeacon.md",
  slug: "techbeacon",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"unity.md": {
  id: "unity.md",
  slug: "unity",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
"weave.md": {
  id: "weave.md",
  slug: "weave",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
},
},
"post": {
"2016/2016-01-05-the-next-full-stack-language-server-side-swift-with-perfect.md": {
  id: "2016/2016-01-05-the-next-full-stack-language-server-side-swift-with-perfect.md",
  slug: "2016/2016-01-05-the-next-full-stack-language-server-side-swift-with-perfect",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-08-estonia-between-eat-west-and-the-world.md": {
  id: "2016/2016-01-08-estonia-between-eat-west-and-the-world.md",
  slug: "2016/2016-01-08-estonia-between-eat-west-and-the-world",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-09-turning-chip-shop-into-a-board-game.md": {
  id: "2016/2016-01-09-turning-chip-shop-into-a-board-game.md",
  slug: "2016/2016-01-09-turning-chip-shop-into-a-board-game",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-11-getting-to-know-volley.md": {
  id: "2016/2016-01-11-getting-to-know-volley.md",
  slug: "2016/2016-01-11-getting-to-know-volley",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-12-blink-a-programmable-indicator-for-developer-needs.md": {
  id: "2016/2016-01-12-blink-a-programmable-indicator-for-developer-needs.md",
  slug: "2016/2016-01-12-blink-a-programmable-indicator-for-developer-needs",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-15-how-to-auto-deploy-from-github-to-your-server.md": {
  id: "2016/2016-01-15-how-to-auto-deploy-from-github-to-your-server.md",
  slug: "2016/2016-01-15-how-to-auto-deploy-from-github-to-your-server",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-18-celebrity-death-netflix-vs-digital-nomads-and-introducing-the-enthusiastic-amateur.md": {
  id: "2016/2016-01-18-celebrity-death-netflix-vs-digital-nomads-and-introducing-the-enthusiastic-amateur.md",
  slug: "2016/2016-01-18-celebrity-death-netflix-vs-digital-nomads-and-introducing-the-enthusiastic-amateur",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-18-using-layout-managers-to-craft-awesome-android-interfaces.md": {
  id: "2016/2016-01-18-using-layout-managers-to-craft-awesome-android-interfaces.md",
  slug: "2016/2016-01-18-using-layout-managers-to-craft-awesome-android-interfaces",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-21-display-data-sets-in-indesign-with-porky.md": {
  id: "2016/2016-01-21-display-data-sets-in-indesign-with-porky.md",
  slug: "2016/2016-01-21-display-data-sets-in-indesign-with-porky",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-24-meetup-and-conference-etiquette-revisited.md": {
  id: "2016/2016-01-24-meetup-and-conference-etiquette-revisited.md",
  slug: "2016/2016-01-24-meetup-and-conference-etiquette-revisited",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-27-using-classy-to-create-style-sheets-for-hative-ios-apps.md": {
  id: "2016/2016-01-27-using-classy-to-create-style-sheets-for-hative-ios-apps.md",
  slug: "2016/2016-01-27-using-classy-to-create-style-sheets-for-hative-ios-apps",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-01-28-playtesting-back-open.md": {
  id: "2016/2016-01-28-playtesting-back-open.md",
  slug: "2016/2016-01-28-playtesting-back-open",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-02-03-CR8-a-collection-of-utility-scripts-for-working-with-clusters.md": {
  id: "2016/2016-02-03-CR8-a-collection-of-utility-scripts-for-working-with-clusters.md",
  slug: "2016/2016-02-03-cr8-a-collection-of-utility-scripts-for-working-with-clusters",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-02-03-Ctop-a-top-tool-for-crate-clusters.md": {
  id: "2016/2016-02-03-Ctop-a-top-tool-for-crate-clusters.md",
  slug: "2016/2016-02-03-ctop-a-top-tool-for-crate-clusters",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-02-12-outputting-data-to-the-user-interface.md": {
  id: "2016/2016-02-12-outputting-data-to-the-user-interface.md",
  slug: "2016/2016-02-12-outputting-data-to-the-user-interface",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-02-14-healthy-travel-working-on-the-road-and-the-inefficiency-of-travel.md": {
  id: "2016/2016-02-14-healthy-travel-working-on-the-road-and-the-inefficiency-of-travel.md",
  slug: "2016/2016-02-14-healthy-travel-working-on-the-road-and-the-inefficiency-of-travel",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-02-21-preparing-your-android-app-for-release.md": {
  id: "2016/2016-02-21-preparing-your-android-app-for-release.md",
  slug: "2016/2016-02-21-preparing-your-android-app-for-release",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-02-22-tech-tribes-and-being-an-outsider-amongst-outsiders.md": {
  id: "2016/2016-02-22-tech-tribes-and-being-an-outsider-amongst-outsiders.md",
  slug: "2016/2016-02-22-tech-tribes-and-being-an-outsider-amongst-outsiders",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-02-24-migrating-your-android-or-ios-app-from-parse.md": {
  id: "2016/2016-02-24-migrating-your-android-or-ios-app-from-parse.md",
  slug: "2016/2016-02-24-migrating-your-android-or-ios-app-from-parse",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-03-01-are-you-really-a-tech-company.md": {
  id: "2016/2016-03-01-are-you-really-a-tech-company.md",
  slug: "2016/2016-03-01-are-you-really-a-tech-company",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-03-06-print-at-home-chip-shop-released.md": {
  id: "2016/2016-03-06-print-at-home-chip-shop-released.md",
  slug: "2016/2016-03-06-print-at-home-chip-shop-released",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-03-16-displaying-images-on-your-android-interface.md": {
  id: "2016/2016-03-16-displaying-images-on-your-android-interface.md",
  slug: "2016/2016-03-16-displaying-images-on-your-android-interface",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-03-21-physical-and-mental-health-for-developers.md": {
  id: "2016/2016-03-21-physical-and-mental-health-for-developers.md",
  slug: "2016/2016-03-21-physical-and-mental-health-for-developers",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-03-22-understanding-the-docker-ecosystem.md": {
  id: "2016/2016-03-22-understanding-the-docker-ecosystem.md",
  slug: "2016/2016-03-22-understanding-the-docker-ecosystem",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-03-25-past-present-future-swift.md": {
  id: "2016/2016-03-25-past-present-future-swift.md",
  slug: "2016/2016-03-25-past-present-future-swift",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-04-06-managing-data-storage-with-blockchain-and-bigchaindb.md": {
  id: "2016/2016-04-06-managing-data-storage-with-blockchain-and-bigchaindb.md",
  slug: "2016/2016-04-06-managing-data-storage-with-blockchain-and-bigchaindb",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-04-13-real-world-use-cases-of-nosql-databases.md": {
  id: "2016/2016-04-13-real-world-use-cases-of-nosql-databases.md",
  slug: "2016/2016-04-13-real-world-use-cases-of-nosql-databases",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-04-14-the-shortlist-of-docker-hosting.md": {
  id: "2016/2016-04-14-the-shortlist-of-docker-hosting.md",
  slug: "2016/2016-04-14-the-shortlist-of-docker-hosting",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-04-17-a-1001-crate-cluster-with-microsoft-azure.md": {
  id: "2016/2016-04-17-a-1001-crate-cluster-with-microsoft-azure.md",
  slug: "2016/2016-04-17-a-1001-crate-cluster-with-microsoft-azure",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-04-27-dependency-management-with-the-swift-package-manager.md": {
  id: "2016/2016-04-27-dependency-management-with-the-swift-package-manager.md",
  slug: "2016/2016-04-27-dependency-management-with-the-swift-package-manager",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-04-29-a-week-in-berlin-meetups.md": {
  id: "2016/2016-04-29-a-week-in-berlin-meetups.md",
  slug: "2016/2016-04-29-a-week-in-berlin-meetups",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-03-teaching-people-to-code.md": {
  id: "2016/2016-05-03-teaching-people-to-code.md",
  slug: "2016/2016-05-03-teaching-people-to-code",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-20-observations-on-albania-and-australia-in-eurovision.md": {
  id: "2016/2016-05-20-observations-on-albania-and-australia-in-eurovision.md",
  slug: "2016/2016-05-20-observations-on-albania-and-australia-in-eurovision",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-23-desktop-node-apps-with-electron.m.md": {
  id: "2016/2016-05-23-desktop-node-apps-with-electron.m.md",
  slug: "2016/2016-05-23-desktop-node-apps-with-electronm",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-24-8-key-announcements-for-android.md": {
  id: "2016/2016-05-24-8-key-announcements-for-android.md",
  slug: "2016/2016-05-24-8-key-announcements-for-android",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-25-an-introduction-to-the-docker-trusted-registry.md": {
  id: "2016/2016-05-25-an-introduction-to-the-docker-trusted-registry.md",
  slug: "2016/2016-05-25-an-introduction-to-the-docker-trusted-registry",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-25-teaching-programming.md": {
  id: "2016/2016-05-25-teaching-programming.md",
  slug: "2016/2016-05-25-teaching-programming",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-30-generation-xbox-how-videogames-invaded-hollywood-by-jamie-russell.md": {
  id: "2016/2016-05-30-generation-xbox-how-videogames-invaded-hollywood-by-jamie-russell.md",
  slug: "2016/2016-05-30-generation-xbox-how-videogames-invaded-hollywood-by-jamie-russell",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-30-the-offline-coding-challenge.md": {
  id: "2016/2016-05-30-the-offline-coding-challenge.md",
  slug: "2016/2016-05-30-the-offline-coding-challenge",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-05-30-the-story-of-english-by-robert-mccrum-robert-macneil.md": {
  id: "2016/2016-05-30-the-story-of-english-by-robert-mccrum-robert-macneil.md",
  slug: "2016/2016-05-30-the-story-of-english-by-robert-mccrum-robert-macneil",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-06-09-what-do-apples-app-store-changes-mean-for-developers.md": {
  id: "2016/2016-06-09-what-do-apples-app-store-changes-mean-for-developers.md",
  slug: "2016/2016-06-09-what-do-apples-app-store-changes-mean-for-developers",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-06-22-otto-next-generation-vagrant.md": {
  id: "2016/2016-06-22-otto-next-generation-vagrant.md",
  slug: "2016/2016-06-22-otto-next-generation-vagrant",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-06-22-otto-the-next-generation-of-vagrant.md": {
  id: "2016/2016-06-22-otto-the-next-generation-of-vagrant.md",
  slug: "2016/2016-06-22-otto-the-next-generation-of-vagrant",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-07-01-which-continuous-integration-tools-support-bitbucket.md": {
  id: "2016/2016-07-01-which-continuous-integration-tools-support-bitbucket.md",
  slug: "2016/2016-07-01-which-continuous-integration-tools-support-bitbucket",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-07-06-rapid-iot-development-with-the-relayr-android-app-and-sdk.md": {
  id: "2016/2016-07-06-rapid-iot-development-with-the-relayr-android-app-and-sdk.md",
  slug: "2016/2016-07-06-rapid-iot-development-with-the-relayr-android-app-and-sdk",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-07-21-an-introduction-to-docker-for-mac.md": {
  id: "2016/2016-07-21-an-introduction-to-docker-for-mac.md",
  slug: "2016/2016-07-21-an-introduction-to-docker-for-mac",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-07-21-introduction-to-docker-for-mac.md": {
  id: "2016/2016-07-21-introduction-to-docker-for-mac.md",
  slug: "2016/2016-07-21-introduction-to-docker-for-mac",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-08-02-whats-new-in-appcode.md": {
  id: "2016/2016-08-02-whats-new-in-appcode.md",
  slug: "2016/2016-08-02-whats-new-in-appcode",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-08-20-communist-and-cultural-effects-on-tech- communities.md": {
  id: "2016/2016-08-20-communist-and-cultural-effects-on-tech- communities.md",
  slug: "2016/2016-08-20-communist-and-cultural-effects-on-tech--communities",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-08-22-editors-friend-for-atom.md": {
  id: "2016/2016-08-22-editors-friend-for-atom.md",
  slug: "2016/2016-08-22-editors-friend-for-atom",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-08-24-a-beginner-s-guide-to-the-dockerfile.md": {
  id: "2016/2016-08-24-a-beginner-s-guide-to-the-dockerfile.md",
  slug: "2016/2016-08-24-a-beginner-s-guide-to-the-dockerfile",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-08-24-medium-exporter-for-atom.md": {
  id: "2016/2016-08-24-medium-exporter-for-atom.md",
  slug: "2016/2016-08-24-medium-exporter-for-atom",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-08-29-building-your-first-blockchain-app-with-eris.md": {
  id: "2016/2016-08-29-building-your-first-blockchain-app-with-eris.md",
  slug: "2016/2016-08-29-building-your-first-blockchain-app-with-eris",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-08-31-making-atom-awesome -my-setup.md": {
  id: "2016/2016-08-31-making-atom-awesome -my-setup.md",
  slug: "2016/2016-08-31-making-atom-awesome-my-setup",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-09-06-the-weekly-squeak-9th-september.md": {
  id: "2016/2016-09-06-the-weekly-squeak-9th-september.md",
  slug: "2016/2016-09-06-the-weekly-squeak-9th-september",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-09-12-exploring-the-evive.md": {
  id: "2016/2016-09-12-exploring-the-evive.md",
  slug: "2016/2016-09-12-exploring-the-evive",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-09-16-from-ukge-to-essen.md": {
  id: "2016/2016-09-16-from-ukge-to-essen.md",
  slug: "2016/2016-09-16-from-ukge-to-essen",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-09-18-the-weekly-squeak-18th-september.md": {
  id: "2016/2016-09-18-the-weekly-squeak-18th-september.md",
  slug: "2016/2016-09-18-the-weekly-squeak-18th-september",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-09-22-an-introduction-to-coreos.md": {
  id: "2016/2016-09-22-an-introduction-to-coreos.md",
  slug: "2016/2016-09-22-an-introduction-to-coreos",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-10-07-developing-add-ons-for-enterprise-apps-like-jira.md": {
  id: "2016/2016-10-07-developing-add-ons-for-enterprise-apps-like-jira.md",
  slug: "2016/2016-10-07-developing-add-ons-for-enterprise-apps-like-jira",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-10-08-from-belgrade-to-berlin.md": {
  id: "2016/2016-10-08-from-belgrade-to-berlin.md",
  slug: "2016/2016-10-08-from-belgrade-to-berlin",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-10-11-a-documentation-crash-course.md": {
  id: "2016/2016-10-11-a-documentation-crash-course.md",
  slug: "2016/2016-10-11-a-documentation-crash-course",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-10-18-how-i-wrote-the-atom-medium-exporter-and-how-you-can-help-make-it-better.md": {
  id: "2016/2016-10-18-how-i-wrote-the-atom-medium-exporter-and-how-you-can-help-make-it-better.md",
  slug: "2016/2016-10-18-how-i-wrote-the-atom-medium-exporter-and-how-you-can-help-make-it-better",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-10-25-hands-on-with-the-yoga-book.md": {
  id: "2016/2016-10-25-hands-on-with-the-yoga-book.md",
  slug: "2016/2016-10-25-hands-on-with-the-yoga-book",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-10-27-hello-again-from-apple.md": {
  id: "2016/2016-10-27-hello-again-from-apple.md",
  slug: "2016/2016-10-27-hello-again-from-apple",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-11-16-web-summit-2016-iot-learning-chatbots-biohacking.md": {
  id: "2016/2016-11-16-web-summit-2016-iot-learning-chatbots-biohacking.md",
  slug: "2016/2016-11-16-web-summit-2016-iot-learning-chatbots-biohacking",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-11-23-improve-documentation-by-automating-spelling-and-.md": {
  id: "2016/2016-11-23-improve-documentation-by-automating-spelling-and-.md",
  slug: "2016/2016-11-23-improve-documentation-by-automating-spelling-and-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-12-11-my-problems-with-this-time-of-year.md": {
  id: "2016/2016-12-11-my-problems-with-this-time-of-year.md",
  slug: "2016/2016-12-11-my-problems-with-this-time-of-year",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-12-20-tech-your-privilege-at-the-door.md": {
  id: "2016/2016-12-20-tech-your-privilege-at-the-door.md",
  slug: "2016/2016-12-20-tech-your-privilege-at-the-door",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-12-21-testing-code-examples-in-documentation.md": {
  id: "2016/2016-12-21-testing-code-examples-in-documentation.md",
  slug: "2016/2016-12-21-testing-code-examples-in-documentation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2016/2016-12-29-2016-in-review.md": {
  id: "2016/2016-12-29-2016-in-review.md",
  slug: "2016/2016-12-29-2016-in-review",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-01-05-build-and-program-with-sam-labs-curious-cars.md": {
  id: "2017/2017-01-05-build-and-program-with-sam-labs-curious-cars.md",
  slug: "2017/2017-01-05-build-and-program-with-sam-labs-curious-cars",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-01-13-a-switchers-tale-my-week-with-windows.md": {
  id: "2017/2017-01-13-a-switchers-tale-my-week-with-windows.md",
  slug: "2017/2017-01-13-a-switchers-tale-my-week-with-windows",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-01-17-java-free-android.md": {
  id: "2017/2017-01-17-java-free-android.md",
  slug: "2017/2017-01-17-java-free-android",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-01-20-build-native-apps-in-the-browser-with-configure-it.md": {
  id: "2017/2017-01-20-build-native-apps-in-the-browser-with-configure-it.md",
  slug: "2017/2017-01-20-build-native-apps-in-the-browser-with-configure-it",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-01-31-automating-screenshots-in-documentation.md": {
  id: "2017/2017-01-31-automating-screenshots-in-documentation.md",
  slug: "2017/2017-01-31-automating-screenshots-in-documentation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-02-07-a-switchers-tale-my-weeks-with-linux.md": {
  id: "2017/2017-02-07-a-switchers-tale-my-weeks-with-linux.md",
  slug: "2017/2017-02-07-a-switchers-tale-my-weeks-with-linux",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-02-16-from-hackathon-to-help-system.md": {
  id: "2017/2017-02-16-from-hackathon-to-help-system.md",
  slug: "2017/2017-02-16-from-hackathon-to-help-system",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-02-23-setapp-aims-to-solve-the-app-problem-for-macs.md": {
  id: "2017/2017-02-23-setapp-aims-to-solve-the-app-problem-for-macs.md",
  slug: "2017/2017-02-23-setapp-aims-to-solve-the-app-problem-for-macs",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-02-28-preventing-sql-injections-and-other-vulnerabilities-in-python.md": {
  id: "2017/2017-02-28-preventing-sql-injections-and-other-vulnerabilities-in-python.md",
  slug: "2017/2017-02-28-preventing-sql-injections-and-other-vulnerabilities-in-python",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-02-mobile-world-congress-2017.md": {
  id: "2017/2017-03-02-mobile-world-congress-2017.md",
  slug: "2017/2017-03-02-mobile-world-congress-2017",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-02-sydney-event-transitioning-into-api-technical-wri.md": {
  id: "2017/2017-03-02-sydney-event-transitioning-into-api-technical-wri.md",
  slug: "2017/2017-03-02-sydney-event-transitioning-into-api-technical-wri",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-04-the-highlights-of-mobile-world-congress-2017.md": {
  id: "2017/2017-03-04-the-highlights-of-mobile-world-congress-2017.md",
  slug: "2017/2017-03-04-the-highlights-of-mobile-world-congress-2017",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-09-teaching-children-to-code.md": {
  id: "2017/2017-03-09-teaching-children-to-code.md",
  slug: "2017/2017-03-09-teaching-children-to-code",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-10-whats-next-google-announces-new-features-for-its-cloud.md": {
  id: "2017/2017-03-10-whats-next-google-announces-new-features-for-its-cloud.md",
  slug: "2017/2017-03-10-whats-next-google-announces-new-features-for-its-cloud",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-14-docker-secrets-management.md": {
  id: "2017/2017-03-14-docker-secrets-management.md",
  slug: "2017/2017-03-14-docker-secrets-management",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-19-berlin-the-blockchain-capital-of-the-world.md": {
  id: "2017/2017-03-19-berlin-the-blockchain-capital-of-the-world.md",
  slug: "2017/2017-03-19-berlin-the-blockchain-capital-of-the-world",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-21-the-internet-of-industrial-things.md": {
  id: "2017/2017-03-21-the-internet-of-industrial-things.md",
  slug: "2017/2017-03-21-the-internet-of-industrial-things",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-03-28-cebit-2017-business-as-usual.md": {
  id: "2017/2017-03-28-cebit-2017-business-as-usual.md",
  slug: "2017/2017-03-28-cebit-2017-business-as-usual",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-04-enterprising-israel.md": {
  id: "2017/2017-04-04-enterprising-israel.md",
  slug: "2017/2017-04-04-enterprising-israel",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-04-tech-salary-trends-2017.md": {
  id: "2017/2017-04-04-tech-salary-trends-2017.md",
  slug: "2017/2017-04-04-tech-salary-trends-2017",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-05-about-ship-at-docker.md": {
  id: "2017/2017-04-05-about-ship-at-docker.md",
  slug: "2017/2017-04-05-about-ship-at-docker",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-11-jvm-free-kotlin-with-kotlinnative.md": {
  id: "2017/2017-04-11-jvm-free-kotlin-with-kotlinnative.md",
  slug: "2017/2017-04-11-jvm-free-kotlin-with-kotlinnative",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-11-realities-challenges-digital-nomad.md": {
  id: "2017/2017-04-11-realities-challenges-digital-nomad.md",
  slug: "2017/2017-04-11-realities-challenges-digital-nomad",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-14-preventing-sql-injections-in-ruby.md": {
  id: "2017/2017-04-14-preventing-sql-injections-in-ruby.md",
  slug: "2017/2017-04-14-preventing-sql-injections-in-ruby",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-17-real-time-ocr-for-mobile-apps-with-rtr-sdk.md": {
  id: "2017/2017-04-17-real-time-ocr-for-mobile-apps-with-rtr-sdk.md",
  slug: "2017/2017-04-17-real-time-ocr-for-mobile-apps-with-rtr-sdk",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-18-docker-for-windows-linux-and-mac.md": {
  id: "2017/2017-04-18-docker-for-windows-linux-and-mac.md",
  slug: "2017/2017-04-18-docker-for-windows-linux-and-mac",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-21-an-introduction-to-speech-synthesis-markup-language.md": {
  id: "2017/2017-04-21-an-introduction-to-speech-synthesis-markup-language.md",
  slug: "2017/2017-04-21-an-introduction-to-speech-synthesis-markup-language",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-28-smarter-app-notifications-with-openback.md": {
  id: "2017/2017-04-28-smarter-app-notifications-with-openback.md",
  slug: "2017/2017-04-28-smarter-app-notifications-with-openback",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-04-29-a-developers-guide-to-better-presentations-part-1-stage-craft.md": {
  id: "2017/2017-04-29-a-developers-guide-to-better-presentations-part-1-stage-craft.md",
  slug: "2017/2017-04-29-a-developers-guide-to-better-presentations-part-1-stage-craft",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-05-17-bucharest-a-crash-course-in-software-craftsm.md": {
  id: "2017/2017-05-17-bucharest-a-crash-course-in-software-craftsm.md",
  slug: "2017/2017-05-17-bucharest-a-crash-course-in-software-craftsm",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-05-19-feeling-fabulous-with-queer-tech.md": {
  id: "2017/2017-05-19-feeling-fabulous-with-queer-tech.md",
  slug: "2017/2017-05-19-feeling-fabulous-with-queer-tech",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-05-21-mobile-and-web-app-testing-with-sauce-labs.md": {
  id: "2017/2017-05-21-mobile-and-web-app-testing-with-sauce-labs.md",
  slug: "2017/2017-05-21-mobile-and-web-app-testing-with-sauce-labs",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-05-24-ci-workflows-and-bots.md": {
  id: "2017/2017-05-24-ci-workflows-and-bots.md",
  slug: "2017/2017-05-24-ci-workflows-and-bots",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-05-27-interview-with-manish-gupta-of-redis-labs.md": {
  id: "2017/2017-05-27-interview-with-manish-gupta-of-redis-labs.md",
  slug: "2017/2017-05-27-interview-with-manish-gupta-of-redis-labs",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-05-29-paddle-merges-with-devmate.md": {
  id: "2017/2017-05-29-paddle-merges-with-devmate.md",
  slug: "2017/2017-05-29-paddle-merges-with-devmate",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-05-31-pilosa-a-new-kind-of-database-index-interview.md": {
  id: "2017/2017-05-31-pilosa-a-new-kind-of-database-index-interview.md",
  slug: "2017/2017-05-31-pilosa-a-new-kind-of-database-index-interview",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-04-founder-of-opera-and-vivaldi-jon-stephenson-von-t.md": {
  id: "2017/2017-06-04-founder-of-opera-and-vivaldi-jon-stephenson-von-t.md",
  slug: "2017/2017-06-04-founder-of-opera-and-vivaldi-jon-stephenson-von-t",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-12-huwawei-p10-a-powerful-small-package.md": {
  id: "2017/2017-06-12-huwawei-p10-a-powerful-small-package.md",
  slug: "2017/2017-06-12-huwawei-p10-a-powerful-small-package",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-18-screeps-the-mmo-sandbox-game-for-programmers.md": {
  id: "2017/2017-06-18-screeps-the-mmo-sandbox-game-for-programmers.md",
  slug: "2017/2017-06-18-screeps-the-mmo-sandbox-game-for-programmers",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-19-chatting-with-chip-childers-cto-of-cloud-foundry.md": {
  id: "2017/2017-06-19-chatting-with-chip-childers-cto-of-cloud-foundry.md",
  slug: "2017/2017-06-19-chatting-with-chip-childers-cto-of-cloud-foundry",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-19-chip-childers-cto-of-cloud-foundry.md": {
  id: "2017/2017-06-19-chip-childers-cto-of-cloud-foundry.md",
  slug: "2017/2017-06-19-chip-childers-cto-of-cloud-foundry",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-20-hashicorp-tools-useful-for-continuous-integration.md": {
  id: "2017/2017-06-20-hashicorp-tools-useful-for-continuous-integration.md",
  slug: "2017/2017-06-20-hashicorp-tools-useful-for-continuous-integration",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-21-how-to-automatically-track-your-time-and-productivity-with-timing-app.md": {
  id: "2017/2017-06-21-how-to-automatically-track-your-time-and-productivity-with-timing-app.md",
  slug: "2017/2017-06-21-how-to-automatically-track-your-time-and-productivity-with-timing-app",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-26-hashicorp-tools-useful-for-continuous-integration.md": {
  id: "2017/2017-06-26-hashicorp-tools-useful-for-continuous-integration.md",
  slug: "2017/2017-06-26-hashicorp-tools-useful-for-continuous-integration",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-28-docker-monitoring-5-methods-for-monitoring-java-applications-in-docker.md": {
  id: "2017/2017-06-28-docker-monitoring-5-methods-for-monitoring-java-applications-in-docker.md",
  slug: "2017/2017-06-28-docker-monitoring-5-methods-for-monitoring-java-applications-in-docker",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-06-30-pravin-halady-of-nodesource-enterprise-ready-node.md": {
  id: "2017/2017-06-30-pravin-halady-of-nodesource-enterprise-ready-node.md",
  slug: "2017/2017-06-30-pravin-halady-of-nodesource-enterprise-ready-node",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-01-pioneering-education-biotech-and-blockchain-podca.md": {
  id: "2017/2017-07-01-pioneering-education-biotech-and-blockchain-podca.md",
  slug: "2017/2017-07-01-pioneering-education-biotech-and-blockchain-podca",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-06-pravin-halady-of-nodesource-enterprise-ready-nodejs.md": {
  id: "2017/2017-07-06-pravin-halady-of-nodesource-enterprise-ready-nodejs.md",
  slug: "2017/2017-07-06-pravin-halady-of-nodesource-enterprise-ready-nodejs",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-07-hyperledger-s-brian-behlendorf-blockchain-for-bus.md": {
  id: "2017/2017-07-07-hyperledger-s-brian-behlendorf-blockchain-for-bus.md",
  slug: "2017/2017-07-07-hyperledger-s-brian-behlendorf-blockchain-for-bus",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-11-must-listen-software-engineering-podcast-episodes.md": {
  id: "2017/2017-07-11-must-listen-software-engineering-podcast-episodes.md",
  slug: "2017/2017-07-11-must-listen-software-engineering-podcast-episodes",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-12-a-comparison-of-docker-guis.md": {
  id: "2017/2017-07-12-a-comparison-of-docker-guis.md",
  slug: "2017/2017-07-12-a-comparison-of-docker-guis",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-17-startupbootcamp-demo-day-transport-energy.md": {
  id: "2017/2017-07-17-startupbootcamp-demo-day-transport-energy.md",
  slug: "2017/2017-07-17-startupbootcamp-demo-day-transport-energy",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-18-helping-make-open-source-secure-compliant-and-sus.md": {
  id: "2017/2017-07-18-helping-make-open-source-secure-compliant-and-sus.md",
  slug: "2017/2017-07-18-helping-make-open-source-secure-compliant-and-sus",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-18-lucas-carlson-of-automic-taking-devops-beyond-dev.md": {
  id: "2017/2017-07-18-lucas-carlson-of-automic-taking-devops-beyond-dev.md",
  slug: "2017/2017-07-18-lucas-carlson-of-automic-taking-devops-beyond-dev",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-19-a-comparison-of-docker-guis.md": {
  id: "2017/2017-07-19-a-comparison-of-docker-guis.md",
  slug: "2017/2017-07-19-a-comparison-of-docker-guis",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-19-postman-pro-features-now-free-for-smaller-project.md": {
  id: "2017/2017-07-19-postman-pro-features-now-free-for-smaller-project.md",
  slug: "2017/2017-07-19-postman-pro-features-now-free-for-smaller-project",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-21-affect-tech-society-interview-yael-eisenstat.md": {
  id: "2017/2017-07-21-affect-tech-society-interview-yael-eisenstat.md",
  slug: "2017/2017-07-21-affect-tech-society-interview-yael-eisenstat",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-21-becoming-the-first-cyborgs-with-liviu-babitz.md": {
  id: "2017/2017-07-21-becoming-the-first-cyborgs-with-liviu-babitz.md",
  slug: "2017/2017-07-21-becoming-the-first-cyborgs-with-liviu-babitz",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-26-getting-started-podcasting-mac.md": {
  id: "2017/2017-07-26-getting-started-podcasting-mac.md",
  slug: "2017/2017-07-26-getting-started-podcasting-mac",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-26-steadily-serving-the-web-for-12-years-liam-crilly.md": {
  id: "2017/2017-07-26-steadily-serving-the-web-for-12-years-liam-crilly.md",
  slug: "2017/2017-07-26-steadily-serving-the-web-for-12-years-liam-crilly",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-07-28-heroku-logging-coralogix.md": {
  id: "2017/2017-07-28-heroku-logging-coralogix.md",
  slug: "2017/2017-07-28-heroku-logging-coralogix",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-08-10-scrimba-a-new-way-to-teach-and-learn-code.md": {
  id: "2017/2017-08-10-scrimba-a-new-way-to-teach-and-learn-code.md",
  slug: "2017/2017-08-10-scrimba-a-new-way-to-teach-and-learn-code",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-08-11-indiastack-disrupting-the-second-most-populous-na.md": {
  id: "2017/2017-08-11-indiastack-disrupting-the-second-most-populous-na.md",
  slug: "2017/2017-08-11-indiastack-disrupting-the-second-most-populous-na",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-08-18-pepperdata-bringing-devops-practices-to-the-big-d.md": {
  id: "2017/2017-08-18-pepperdata-bringing-devops-practices-to-the-big-d.md",
  slug: "2017/2017-08-18-pepperdata-bringing-devops-practices-to-the-big-d",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-08-21-how-get-started-computer-science-course-roundup.md": {
  id: "2017/2017-08-21-how-get-started-computer-science-course-roundup.md",
  slug: "2017/2017-08-21-how-get-started-computer-science-course-roundup",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-08-23-bringing-devops-practices-to-database-administrat.md": {
  id: "2017/2017-08-23-bringing-devops-practices-to-database-administrat.md",
  slug: "2017/2017-08-23-bringing-devops-practices-to-database-administrat",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-08-23-tools-and-practices-for-documenting-microservices.md": {
  id: "2017/2017-08-23-tools-and-practices-for-documenting-microservices.md",
  slug: "2017/2017-08-23-tools-and-practices-for-documenting-microservices",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-08-30-bringing-touch-bar-support-to-the-atom-text-edito.md": {
  id: "2017/2017-08-30-bringing-touch-bar-support-to-the-atom-text-edito.md",
  slug: "2017/2017-08-30-bringing-touch-bar-support-to-the-atom-text-edito",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-09-06-data-science-in-a-box-with-dataiku.md": {
  id: "2017/2017-09-06-data-science-in-a-box-with-dataiku.md",
  slug: "2017/2017-09-06-data-science-in-a-box-with-dataiku",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-09-08-blockwatch-demystifying-the-ico.md": {
  id: "2017/2017-09-08-blockwatch-demystifying-the-ico.md",
  slug: "2017/2017-09-08-blockwatch-demystifying-the-ico",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-09-15-ifa-berlin-2017-full-of-smarts.md": {
  id: "2017/2017-09-15-ifa-berlin-2017-full-of-smarts.md",
  slug: "2017/2017-09-15-ifa-berlin-2017-full-of-smarts",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-09-18-sencha-releases-extreact-bringing-their-custom-co.md": {
  id: "2017/2017-09-18-sencha-releases-extreact-bringing-their-custom-co.md",
  slug: "2017/2017-09-18-sencha-releases-extreact-bringing-their-custom-co",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-09-19-does-graphql-reduce-the-need-for-documentation.md": {
  id: "2017/2017-09-19-does-graphql-reduce-the-need-for-documentation.md",
  slug: "2017/2017-09-19-does-graphql-reduce-the-need-for-documentation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-09-26-does-graphql-reduce-the-need-for-documentation.md": {
  id: "2017/2017-09-26-does-graphql-reduce-the-need-for-documentation.md",
  slug: "2017/2017-09-26-does-graphql-reduce-the-need-for-documentation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-09-28-blockwatch-cryptogovernment-and-blockchain-market.md": {
  id: "2017/2017-09-28-blockwatch-cryptogovernment-and-blockchain-market.md",
  slug: "2017/2017-09-28-blockwatch-cryptogovernment-and-blockchain-market",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-09-28-node-logging-best-practices-tips.md": {
  id: "2017/2017-09-28-node-logging-best-practices-tips.md",
  slug: "2017/2017-09-28-node-logging-best-practices-tips",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-10-02-thierry-carrez-on-the-release-of-openstack-pike-p.md": {
  id: "2017/2017-10-02-thierry-carrez-on-the-release-of-openstack-pike-p.md",
  slug: "2017/2017-10-02-thierry-carrez-on-the-release-of-openstack-pike-p",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-10-03-a-guide-to-ubuntu-core-and-snaps.md": {
  id: "2017/2017-10-03-a-guide-to-ubuntu-core-and-snaps.md",
  slug: "2017/2017-10-03-a-guide-to-ubuntu-core-and-snaps",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-10-13-blockwatch-the-9984-summit.md": {
  id: "2017/2017-10-13-blockwatch-the-9984-summit.md",
  slug: "2017/2017-10-13-blockwatch-the-9984-summit",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-10-16-github-universe-2017-collaboration-and-communicat.md": {
  id: "2017/2017-10-16-github-universe-2017-collaboration-and-communicat.md",
  slug: "2017/2017-10-16-github-universe-2017-collaboration-and-communicat",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-10-19-an-overview-of-the-kontena-platform.md": {
  id: "2017/2017-10-19-an-overview-of-the-kontena-platform.md",
  slug: "2017/2017-10-19-an-overview-of-the-kontena-platform",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-10-24-managing-your-business-apps-with-apperian-an-inte.md": {
  id: "2017/2017-10-24-managing-your-business-apps-with-apperian-an-inte.md",
  slug: "2017/2017-10-24-managing-your-business-apps-with-apperian-an-inte",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-10-27-how-to-program-a-robot-interview.md": {
  id: "2017/2017-10-27-how-to-program-a-robot-interview.md",
  slug: "2017/2017-10-27-how-to-program-a-robot-interview",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-06-are-we-all-doomed-your-role-in-the-ethics-of-tech.md": {
  id: "2017/2017-11-06-are-we-all-doomed-your-role-in-the-ethics-of-tech.md",
  slug: "2017/2017-11-06-are-we-all-doomed-your-role-in-the-ethics-of-tech",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-08-complex-event-processing-with-flink-an-update-on-.md": {
  id: "2017/2017-11-08-complex-event-processing-with-flink-an-update-on-.md",
  slug: "2017/2017-11-08-complex-event-processing-with-flink-an-update-on-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-10-a-writer-s-guide-to-conversational-interfaces.md": {
  id: "2017/2017-11-10-a-writer-s-guide-to-conversational-interfaces.md",
  slug: "2017/2017-11-10-a-writer-s-guide-to-conversational-interfaces",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-10-what-can-musicians-and-programmers-learn-from-eac.md": {
  id: "2017/2017-11-10-what-can-musicians-and-programmers-learn-from-eac.md",
  slug: "2017/2017-11-10-what-can-musicians-and-programmers-learn-from-eac",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-11-ruby-logging-best-practices-tips.md": {
  id: "2017/2017-11-11-ruby-logging-best-practices-tips.md",
  slug: "2017/2017-11-11-ruby-logging-best-practices-tips",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-18-blockwatch-tools-for-working-with-solidity.md": {
  id: "2017/2017-11-18-blockwatch-tools-for-working-with-solidity.md",
  slug: "2017/2017-11-18-blockwatch-tools-for-working-with-solidity",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-27-graphcool-the-graphql-backend-development-framewo.md": {
  id: "2017/2017-11-27-graphcool-the-graphql-backend-development-framewo.md",
  slug: "2017/2017-11-27-graphcool-the-graphql-backend-development-framewo",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-27-wtd-episode-11-combining-forces-for-documentation.md": {
  id: "2017/2017-11-27-wtd-episode-11-combining-forces-for-documentation.md",
  slug: "2017/2017-11-27-wtd-episode-11-combining-forces-for-documentation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-11-29-going-serverless-compare-your-faas-options.md": {
  id: "2017/2017-11-29-going-serverless-compare-your-faas-options.md",
  slug: "2017/2017-11-29-going-serverless-compare-your-faas-options",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-04-creating-augmented-reality-and-iot-experiences-wi.md": {
  id: "2017/2017-12-04-creating-augmented-reality-and-iot-experiences-wi.md",
  slug: "2017/2017-12-04-creating-augmented-reality-and-iot-experiences-wi",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-05-going-serverless-compare-your-faas-options.md": {
  id: "2017/2017-12-05-going-serverless-compare-your-faas-options.md",
  slug: "2017/2017-12-05-going-serverless-compare-your-faas-options",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-06-yow-conferences-for-australian-developers-by-deve.md": {
  id: "2017/2017-12-06-yow-conferences-for-australian-developers-by-deve.md",
  slug: "2017/2017-12-06-yow-conferences-for-australian-developers-by-deve",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-13-an-interview-with-circleci-cto-rob-zuber-audio.md": {
  id: "2017/2017-12-13-an-interview-with-circleci-cto-rob-zuber-audio.md",
  slug: "2017/2017-12-13-an-interview-with-circleci-cto-rob-zuber-audio",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-26-an-overview-of-the-kontena-platform.md": {
  id: "2017/2017-12-26-an-overview-of-the-kontena-platform.md",
  slug: "2017/2017-12-26-an-overview-of-the-kontena-platform",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-27-2017-in-review.md": {
  id: "2017/2017-12-27-2017-in-review.md",
  slug: "2017/2017-12-27-2017-in-review",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-27-habitat-from-chef-build-deploy-and-manage-your-cl.md": {
  id: "2017/2017-12-27-habitat-from-chef-build-deploy-and-manage-your-cl.md",
  slug: "2017/2017-12-27-habitat-from-chef-build-deploy-and-manage-your-cl",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-28-distributing-operational-knowledge-across-a-team.md": {
  id: "2017/2017-12-28-distributing-operational-knowledge-across-a-team.md",
  slug: "2017/2017-12-28-distributing-operational-knowledge-across-a-team",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2017/2017-12-31-blockwatch-berlin-blockchain-day-panel-podcast.md": {
  id: "2017/2017-12-31-blockwatch-berlin-blockchain-day-panel-podcast.md",
  slug: "2017/2017-12-31-blockwatch-berlin-blockchain-day-panel-podcast",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-01-04-adding-a-cms-to-your-static-site-with-netlify-cms.md": {
  id: "2018/2018-01-04-adding-a-cms-to-your-static-site-with-netlify-cms.md",
  slug: "2018/2018-01-04-adding-a-cms-to-your-static-site-with-netlify-cms",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-01-04-apache-flink-in-2017-year-in-review.md": {
  id: "2018/2018-01-04-apache-flink-in-2017-year-in-review.md",
  slug: "2018/2018-01-04-apache-flink-in-2017-year-in-review",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-01-06-distributing-operational-knowledge-across-a-team.md": {
  id: "2018/2018-01-06-distributing-operational-knowledge-across-a-team.md",
  slug: "2018/2018-01-06-distributing-operational-knowledge-across-a-team",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-01-11-how-to-size-your-apache-flink-cluster-a-back-of-t.md": {
  id: "2018/2018-01-11-how-to-size-your-apache-flink-cluster-a-back-of-t.md",
  slug: "2018/2018-01-11-how-to-size-your-apache-flink-cluster-a-back-of-t",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-01-14-create-cross-platform-voice-applications-with-jov.md": {
  id: "2018/2018-01-14-create-cross-platform-voice-applications-with-jov.md",
  slug: "2018/2018-01-14-create-cross-platform-voice-applications-with-jov",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-01-18-container-and-serverless-predictions-for-2018-wit.md": {
  id: "2018/2018-01-18-container-and-serverless-predictions-for-2018-wit.md",
  slug: "2018/2018-01-18-container-and-serverless-predictions-for-2018-wit",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-01-23-managing-large-state-in-apache-flink-an-intro-to-checkpointing.md": {
  id: "2018/2018-01-23-managing-large-state-in-apache-flink-an-intro-to-checkpointing.md",
  slug: "2018/2018-01-23-managing-large-state-in-apache-flink-an-intro-to-checkpointing",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-01-30-optimize-your-cloud-native-infrastructure-with-re.md": {
  id: "2018/2018-01-30-optimize-your-cloud-native-infrastructure-with-re.md",
  slug: "2018/2018-01-30-optimize-your-cloud-native-infrastructure-with-re",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-02-01-a-roundup-of-managed-kubernetes-platforms.md": {
  id: "2018/2018-02-01-a-roundup-of-managed-kubernetes-platforms.md",
  slug: "2018/2018-02-01-a-roundup-of-managed-kubernetes-platforms",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-02-07-what-will-red-hat-acquiring-coreos-mean-for-the-k.md": {
  id: "2018/2018-02-07-what-will-red-hat-acquiring-coreos-mean-for-the-k.md",
  slug: "2018/2018-02-07-what-will-red-hat-acquiring-coreos-mean-for-the-k",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-02-08-blockwatch-what-is-a-decentralized-exchange.md": {
  id: "2018/2018-02-08-blockwatch-what-is-a-decentralized-exchange.md",
  slug: "2018/2018-02-08-blockwatch-what-is-a-decentralized-exchange",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-02-16-lint-lint-and-away-linters-for-the-english-langua.md": {
  id: "2018/2018-02-16-lint-lint-and-away-linters-for-the-english-langua.md",
  slug: "2018/2018-02-16-lint-lint-and-away-linters-for-the-english-langua",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-02-18-aiva-the-artificial-intelligence-composer.md": {
  id: "2018/2018-02-18-aiva-the-artificial-intelligence-composer.md",
  slug: "2018/2018-02-18-aiva-the-artificial-intelligence-composer",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-02-22-embracing-the-chaos-of-chaos-engineering.md": {
  id: "2018/2018-02-22-embracing-the-chaos-of-chaos-engineering.md",
  slug: "2018/2018-02-22-embracing-the-chaos-of-chaos-engineering",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-02-an-interview-with-brian-gracely-on-red-hat-s-acqu.md": {
  id: "2018/2018-03-02-an-interview-with-brian-gracely-on-red-hat-s-acqu.md",
  slug: "2018/2018-03-02-an-interview-with-brian-gracely-on-red-hat-s-acqu",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-06-mobile-world-congress-2018-consolidation-and-coll.md": {
  id: "2018/2018-03-06-mobile-world-congress-2018-consolidation-and-coll.md",
  slug: "2018/2018-03-06-mobile-world-congress-2018-consolidation-and-coll",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-06-switchbot-a-smart-home-for-everyone.md": {
  id: "2018/2018-03-06-switchbot-a-smart-home-for-everyone.md",
  slug: "2018/2018-03-06-switchbot-a-smart-home-for-everyone",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-07-an-interview-with-brian-gracely-on-red-hat-s-acqu.md": {
  id: "2018/2018-03-07-an-interview-with-brian-gracely-on-red-hat-s-acqu.md",
  slug: "2018/2018-03-07-an-interview-with-brian-gracely-on-red-hat-s-acqu",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-11-docfx-the-next-documentation-tool-to-consider.md": {
  id: "2018/2018-03-11-docfx-the-next-documentation-tool-to-consider.md",
  slug: "2018/2018-03-11-docfx-the-next-documentation-tool-to-consider",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-21-sxsw-part-1-blockchain-and-spacetech.md": {
  id: "2018/2018-03-21-sxsw-part-1-blockchain-and-spacetech.md",
  slug: "2018/2018-03-21-sxsw-part-1-blockchain-and-spacetech",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-24-sxsw-part-2-fixing-tech-ai-and-startups.md": {
  id: "2018/2018-03-24-sxsw-part-2-fixing-tech-ai-and-startups.md",
  slug: "2018/2018-03-24-sxsw-part-2-fixing-tech-ai-and-startups",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-27-what-is-designops.md": {
  id: "2018/2018-03-27-what-is-designops.md",
  slug: "2018/2018-03-27-what-is-designops",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-03-28-do-we-need-the-world-s-first-emotional-processing.md": {
  id: "2018/2018-03-28-do-we-need-the-world-s-first-emotional-processing.md",
  slug: "2018/2018-03-28-do-we-need-the-world-s-first-emotional-processing",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-04-02-customizing-visual-studio-code-for-writing.md": {
  id: "2018/2018-04-02-customizing-visual-studio-code-for-writing.md",
  slug: "2018/2018-04-02-customizing-visual-studio-code-for-writing",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-04-03-the-international-crypto-community-comes-to-berli.md": {
  id: "2018/2018-04-03-the-international-crypto-community-comes-to-berli.md",
  slug: "2018/2018-04-03-the-international-crypto-community-comes-to-berli",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-04-12-tokenize-all-the-things-and-what-happens-next.md": {
  id: "2018/2018-04-12-tokenize-all-the-things-and-what-happens-next.md",
  slug: "2018/2018-04-12-tokenize-all-the-things-and-what-happens-next",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-04-13-will-linux-finally-win-the-desktop-war-because-no.md": {
  id: "2018/2018-04-13-will-linux-finally-win-the-desktop-war-because-no.md",
  slug: "2018/2018-04-13-will-linux-finally-win-the-desktop-war-because-no",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-04-26-the-promises-payoff-and-products-of-hybrid-clouds.md": {
  id: "2018/2018-04-26-the-promises-payoff-and-products-of-hybrid-clouds.md",
  slug: "2018/2018-04-26-the-promises-payoff-and-products-of-hybrid-clouds",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-04-30-production-scale-deep-learning-with-skymind.md": {
  id: "2018/2018-04-30-production-scale-deep-learning-with-skymind.md",
  slug: "2018/2018-04-30-production-scale-deep-learning-with-skymind",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-05-01-ready-for-bionic-beaver-what-s-new-in-ubuntu-18-0.md": {
  id: "2018/2018-05-01-ready-for-bionic-beaver-what-s-new-in-ubuntu-18-0.md",
  slug: "2018/2018-05-01-ready-for-bionic-beaver-what-s-new-in-ubuntu-18-0",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-05-02-the-promises-payoff-and-products-of-hybrid-clouds.md": {
  id: "2018/2018-05-02-the-promises-payoff-and-products-of-hybrid-clouds.md",
  slug: "2018/2018-05-02-the-promises-payoff-and-products-of-hybrid-clouds",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-05-07-news-from-kubecon-and-cloud-native-con-2018.md": {
  id: "2018/2018-05-07-news-from-kubecon-and-cloud-native-con-2018.md",
  slug: "2018/2018-05-07-news-from-kubecon-and-cloud-native-con-2018",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-05-14-ethics-for-designers-and-developers-at-the-first-.md": {
  id: "2018/2018-05-14-ethics-for-designers-and-developers-at-the-first-.md",
  slug: "2018/2018-05-14-ethics-for-designers-and-developers-at-the-first-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-05-15-is-quitting-bad-software-as-hard-as-becoming-vega.md": {
  id: "2018/2018-05-15-is-quitting-bad-software-as-hard-as-becoming-vega.md",
  slug: "2018/2018-05-15-is-quitting-bad-software-as-hard-as-becoming-vega",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-05-21-foss-backstage-for-everyone-in-open-source.md": {
  id: "2018/2018-05-21-foss-backstage-for-everyone-in-open-source.md",
  slug: "2018/2018-05-21-foss-backstage-for-everyone-in-open-source",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-05-28-customizing-sublime-text-for-writers.md": {
  id: "2018/2018-05-28-customizing-sublime-text-for-writers.md",
  slug: "2018/2018-05-28-customizing-sublime-text-for-writers",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-06-06-what-can-software-foundations-bring-to-your-proje.md": {
  id: "2018/2018-06-06-what-can-software-foundations-bring-to-your-proje.md",
  slug: "2018/2018-06-06-what-can-software-foundations-bring-to-your-proje",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-06-12-a-guide-to-the-hybrid-cloud-networking-landscape.md": {
  id: "2018/2018-06-12-a-guide-to-the-hybrid-cloud-networking-landscape.md",
  slug: "2018/2018-06-12-a-guide-to-the-hybrid-cloud-networking-landscape",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-06-14-computational-knowledge-with-stephen-wolfram.md": {
  id: "2018/2018-06-14-computational-knowledge-with-stephen-wolfram.md",
  slug: "2018/2018-06-14-computational-knowledge-with-stephen-wolfram",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-06-19-fostering-open-source-at-foss-backstage.md": {
  id: "2018/2018-06-19-fostering-open-source-at-foss-backstage.md",
  slug: "2018/2018-06-19-fostering-open-source-at-foss-backstage",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-06-26-discovering-the-true-meaning-of-innovation-with-l.md": {
  id: "2018/2018-06-26-discovering-the-true-meaning-of-innovation-with-l.md",
  slug: "2018/2018-06-26-discovering-the-true-meaning-of-innovation-with-l",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-06-26-what-is-blockchain.md": {
  id: "2018/2018-06-26-what-is-blockchain.md",
  slug: "2018/2018-06-26-what-is-blockchain",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-06-29-creating-your-own-whimsical-twitter-bot-with-trac.md": {
  id: "2018/2018-06-29-creating-your-own-whimsical-twitter-bot-with-trac.md",
  slug: "2018/2018-06-29-creating-your-own-whimsical-twitter-bot-with-trac",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-07-17-why-programmers-should-play-boardgames.md": {
  id: "2018/2018-07-17-why-programmers-should-play-boardgames.md",
  slug: "2018/2018-07-17-why-programmers-should-play-boardgames",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-07-18-how-to-market-blockchain-with-consensys-and-lisk.md": {
  id: "2018/2018-07-18-how-to-market-blockchain-with-consensys-and-lisk.md",
  slug: "2018/2018-07-18-how-to-market-blockchain-with-consensys-and-lisk",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-07-19-what-is-artificial-intelligence.md": {
  id: "2018/2018-07-19-what-is-artificial-intelligence.md",
  slug: "2018/2018-07-19-what-is-artificial-intelligence",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-07-20-embracing-the-chaos-of-chaos-engineering.md": {
  id: "2018/2018-07-20-embracing-the-chaos-of-chaos-engineering.md",
  slug: "2018/2018-07-20-embracing-the-chaos-of-chaos-engineering",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-07-27-blockwatch-a-week-in-berlin-blockchain.md": {
  id: "2018/2018-07-27-blockwatch-a-week-in-berlin-blockchain.md",
  slug: "2018/2018-07-27-blockwatch-a-week-in-berlin-blockchain",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-07-31-what-smart-home-iot-platform-should-you-use.md": {
  id: "2018/2018-07-31-what-smart-home-iot-platform-should-you-use.md",
  slug: "2018/2018-07-31-what-smart-home-iot-platform-should-you-use",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-08-14-vale-for-spelling-grammar-style-and-readability-l.md": {
  id: "2018/2018-08-14-vale-for-spelling-grammar-style-and-readability-l.md",
  slug: "2018/2018-08-14-vale-for-spelling-grammar-style-and-readability-l",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-08-20-blockwatch-ripple-coil-codius-and-malta-summit.md": {
  id: "2018/2018-08-20-blockwatch-ripple-coil-codius-and-malta-summit.md",
  slug: "2018/2018-08-20-blockwatch-ripple-coil-codius-and-malta-summit",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-08-30-eyeo-adblocker-plus-and-the-future-of-funding.md": {
  id: "2018/2018-08-30-eyeo-adblocker-plus-and-the-future-of-funding.md",
  slug: "2018/2018-08-30-eyeo-adblocker-plus-and-the-future-of-funding",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-09-05-afrolynk-african-tech-and-entrepreneurship.md": {
  id: "2018/2018-09-05-afrolynk-african-tech-and-entrepreneurship.md",
  slug: "2018/2018-09-05-afrolynk-african-tech-and-entrepreneurship",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-09-09-building-chatbots-in-react-with-botonic.md": {
  id: "2018/2018-09-09-building-chatbots-in-react-with-botonic.md",
  slug: "2018/2018-09-09-building-chatbots-in-react-with-botonic",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-09-13-what-apple-s-september-announcements-might-mean-f.md": {
  id: "2018/2018-09-13-what-apple-s-september-announcements-might-mean-f.md",
  slug: "2018/2018-09-13-what-apple-s-september-announcements-might-mean-f",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-09-15-ifalicious-europe-s-consumer-tech-fair-trends.md": {
  id: "2018/2018-09-15-ifalicious-europe-s-consumer-tech-fair-trends.md",
  slug: "2018/2018-09-15-ifalicious-europe-s-consumer-tech-fair-trends",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-09-27-creating-a-smart-home-with-conrad-connect.md": {
  id: "2018/2018-09-27-creating-a-smart-home-with-conrad-connect.md",
  slug: "2018/2018-09-27-creating-a-smart-home-with-conrad-connect",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-10-18-best-tools-for-debugging-distributed-applications.md": {
  id: "2018/2018-10-18-best-tools-for-debugging-distributed-applications.md",
  slug: "2018/2018-10-18-best-tools-for-debugging-distributed-applications",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-10-19-github-universe-2018-enterprise-enterprise-enterp.md": {
  id: "2018/2018-10-19-github-universe-2018-enterprise-enterprise-enterp.md",
  slug: "2018/2018-10-19-github-universe-2018-enterprise-enterprise-enterp",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-10-24-secure-yourself-for-national-cyber-security-aware.md": {
  id: "2018/2018-10-24-secure-yourself-for-national-cyber-security-aware.md",
  slug: "2018/2018-10-24-secure-yourself-for-national-cyber-security-aware",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-11-02-blockwatch-the-aeternity-blockchain.md": {
  id: "2018/2018-11-02-blockwatch-the-aeternity-blockchain.md",
  slug: "2018/2018-11-02-blockwatch-the-aeternity-blockchain",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-11-08-what-is-continuous-integration.md": {
  id: "2018/2018-11-08-what-is-continuous-integration.md",
  slug: "2018/2018-11-08-what-is-continuous-integration",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-11-12-our-5g-futures-at-5gtechritory.md": {
  id: "2018/2018-11-12-our-5g-futures-at-5gtechritory.md",
  slug: "2018/2018-11-12-our-5g-futures-at-5gtechritory",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-11-27-5g-and-alibaba-cloud-with-tony-cheng.md": {
  id: "2018/2018-11-27-5g-and-alibaba-cloud-with-tony-cheng.md",
  slug: "2018/2018-11-27-5g-and-alibaba-cloud-with-tony-cheng",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-12-03-thoughtworks-technology-radar-19-cloud-chaos-and-.md": {
  id: "2018/2018-12-03-thoughtworks-technology-radar-19-cloud-chaos-and-.md",
  slug: "2018/2018-12-03-thoughtworks-technology-radar-19-cloud-chaos-and-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-12-11-a-year-in-review-blockchainops-entrepreneur.md": {
  id: "2018/2018-12-11-a-year-in-review-blockchainops-entrepreneur.md",
  slug: "2018/2018-12-11-a-year-in-review-blockchainops-entrepreneur",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2018/2018-12-13-openstack-summit-berlin-2018-running-your-cloud.md": {
  id: "2018/2018-12-13-openstack-summit-berlin-2018-running-your-cloud.md",
  slug: "2018/2018-12-13-openstack-summit-berlin-2018-running-your-cloud",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-02-14-embleema-the-blockchain-that-lets-you-own-your-he.md": {
  id: "2019/2019-02-14-embleema-the-blockchain-that-lets-you-own-your-he.md",
  slug: "2019/2019-02-14-embleema-the-blockchain-that-lets-you-own-your-he",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-03-06-smart-contract-utilities-with-zeppelinos-deployin.md": {
  id: "2019/2019-03-06-smart-contract-utilities-with-zeppelinos-deployin.md",
  slug: "2019/2019-03-06-smart-contract-utilities-with-zeppelinos-deployin",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-03-12-developer-relations-and-tech-evangelism-with-rach.md": {
  id: "2019/2019-03-12-developer-relations-and-tech-evangelism-with-rach.md",
  slug: "2019/2019-03-12-developer-relations-and-tech-evangelism-with-rach",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-03-12-writing-on-kauri.md": {
  id: "2019/2019-03-12-writing-on-kauri.md",
  slug: "2019/2019-03-12-writing-on-kauri",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-03-14-march-13th-an-improved-reading-and-writing-experi.md": {
  id: "2019/2019-03-14-march-13th-an-improved-reading-and-writing-experi.md",
  slug: "2019/2019-03-14-march-13th-an-improved-reading-and-writing-experi",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-03-19-installing-ipfs.md": {
  id: "2019/2019-03-19-installing-ipfs.md",
  slug: "2019/2019-03-19-installing-ipfs",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-03-19-peer-to-peer-hypermedia-with-ipfs.md": {
  id: "2019/2019-03-19-peer-to-peer-hypermedia-with-ipfs.md",
  slug: "2019/2019-03-19-peer-to-peer-hypermedia-with-ipfs",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-03-26-true-anonymity-privacy-and-snapps-with-simon-harm.md": {
  id: "2019/2019-03-26-true-anonymity-privacy-and-snapps-with-simon-harm.md",
  slug: "2019/2019-03-26-true-anonymity-privacy-and-snapps-with-simon-harm",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-03-28-reading-on-kauri.md": {
  id: "2019/2019-03-28-reading-on-kauri.md",
  slug: "2019/2019-03-28-reading-on-kauri",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-04-12-kauri-celebrates-500th-post.md": {
  id: "2019/2019-04-12-kauri-celebrates-500th-post.md",
  slug: "2019/2019-04-12-kauri-celebrates-500th-post",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-04-18-removing-the-lid-on-kata-containers.md": {
  id: "2019/2019-04-18-removing-the-lid-on-kata-containers.md",
  slug: "2019/2019-04-18-removing-the-lid-on-kata-containers",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-04-23-google-s-season-of-docs-fostering-open-source-col.md": {
  id: "2019/2019-04-23-google-s-season-of-docs-fostering-open-source-col.md",
  slug: "2019/2019-04-23-google-s-season-of-docs-fostering-open-source-col",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-04-23-openstack-stein-kubernetes-and-bare-metal.md": {
  id: "2019/2019-04-23-openstack-stein-kubernetes-and-bare-metal.md",
  slug: "2019/2019-04-23-openstack-stein-kubernetes-and-bare-metal",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-04-24-will-the-opera-web3-wallet-drive-adoption.md": {
  id: "2019/2019-04-24-will-the-opera-web3-wallet-drive-adoption.md",
  slug: "2019/2019-04-24-will-the-opera-web3-wallet-drive-adoption",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-04-26-april-25th-2019-newsletter.md": {
  id: "2019/2019-04-26-april-25th-2019-newsletter.md",
  slug: "2019/2019-04-26-april-25th-2019-newsletter",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-05-08-mojobot-the-world-s-first-tangible-coding-robot-a.md": {
  id: "2019/2019-05-08-mojobot-the-world-s-first-tangible-coding-robot-a.md",
  slug: "2019/2019-05-08-mojobot-the-world-s-first-tangible-coding-robot-a",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-05-20-fluree-blockchain-graphql-and-more-all-in-one-dat.md": {
  id: "2019/2019-05-20-fluree-blockchain-graphql-and-more-all-in-one-dat.md",
  slug: "2019/2019-05-20-fluree-blockchain-graphql-and-more-all-in-one-dat",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-05-20-q-and-a-making-open-source-more-accessible-to-ent.md": {
  id: "2019/2019-05-20-q-and-a-making-open-source-more-accessible-to-ent.md",
  slug: "2019/2019-05-20-q-and-a-making-open-source-more-accessible-to-ent",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-05-20-revolutionizing-health-data-with-arkhn.md": {
  id: "2019/2019-05-20-revolutionizing-health-data-with-arkhn.md",
  slug: "2019/2019-05-20-revolutionizing-health-data-with-arkhn",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-05-21-fluree-blockchain-graphql-and-more-all-in-one-dat.md": {
  id: "2019/2019-05-21-fluree-blockchain-graphql-and-more-all-in-one-dat.md",
  slug: "2019/2019-05-21-fluree-blockchain-graphql-and-more-all-in-one-dat",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-05-21-revolutionizing-health-data-with-arkhn.md": {
  id: "2019/2019-05-21-revolutionizing-health-data-with-arkhn.md",
  slug: "2019/2019-05-21-revolutionizing-health-data-with-arkhn",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-05-24-creating-a-serverless-application-with-kendoreact.md": {
  id: "2019/2019-05-24-creating-a-serverless-application-with-kendoreact.md",
  slug: "2019/2019-05-24-creating-a-serverless-application-with-kendoreact",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-06-06-secureth-guidelines-getting-started.md": {
  id: "2019/2019-06-06-secureth-guidelines-getting-started.md",
  slug: "2019/2019-06-06-secureth-guidelines-getting-started",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-06-11-pengwin-linux-optimized-for-the-windows-subsystem.md": {
  id: "2019/2019-06-11-pengwin-linux-optimized-for-the-windows-subsystem.md",
  slug: "2019/2019-06-11-pengwin-linux-optimized-for-the-windows-subsystem",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-07-07-netlify-dev-test-the-netlify-hosting-platform-loc.md": {
  id: "2019/2019-07-07-netlify-dev-test-the-netlify-hosting-platform-loc.md",
  slug: "2019/2019-07-07-netlify-dev-test-the-netlify-hosting-platform-loc",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-07-11-the-international-accessibility-standards-you-need-to-follow.md": {
  id: "2019/2019-07-11-the-international-accessibility-standards-you-need-to-follow.md",
  slug: "2019/2019-07-11-the-international-accessibility-standards-you-need-to-follow",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-07-16-the-wcag-accessibility-regulations-you-need-to-know.md": {
  id: "2019/2019-07-16-the-wcag-accessibility-regulations-you-need-to-know.md",
  slug: "2019/2019-07-16-the-wcag-accessibility-regulations-you-need-to-know",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-07-18-bosque-microsoft-s-new-programming-language.md": {
  id: "2019/2019-07-18-bosque-microsoft-s-new-programming-language.md",
  slug: "2019/2019-07-18-bosque-microsoft-s-new-programming-language",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-07-19-bosque-microsoft-s-new-programming-language.md": {
  id: "2019/2019-07-19-bosque-microsoft-s-new-programming-language.md",
  slug: "2019/2019-07-19-bosque-microsoft-s-new-programming-language",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-07-23-vision-disabilities-and-what-you-need-for-accessibility.md": {
  id: "2019/2019-07-23-vision-disabilities-and-what-you-need-for-accessibility.md",
  slug: "2019/2019-07-23-vision-disabilities-and-what-you-need-for-accessibility",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-07-29-auditory-disabilities-and-what-you-need-for-accessibility.md": {
  id: "2019/2019-07-29-auditory-disabilities-and-what-you-need-for-accessibility.md",
  slug: "2019/2019-07-29-auditory-disabilities-and-what-you-need-for-accessibility",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-07-30-motor-disabilities-and-what-you-need-for-accessibility.md": {
  id: "2019/2019-07-30-motor-disabilities-and-what-you-need-for-accessibility.md",
  slug: "2019/2019-07-30-motor-disabilities-and-what-you-need-for-accessibility",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-08-01-accessibility-regulations-you-need-to-follow-section-508.md": {
  id: "2019/2019-08-01-accessibility-regulations-you-need-to-follow-section-508.md",
  slug: "2019/2019-08-01-accessibility-regulations-you-need-to-follow-section-508",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-08-20-7-ways-to-make-your-angular-app-more-accessible.md": {
  id: "2019/2019-08-20-7-ways-to-make-your-angular-app-more-accessible.md",
  slug: "2019/2019-08-20-7-ways-to-make-your-angular-app-more-accessible",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-08-23-top-5-resources-for-web-app-accessibility.md": {
  id: "2019/2019-08-23-top-5-resources-for-web-app-accessibility.md",
  slug: "2019/2019-08-23-top-5-resources-for-web-app-accessibility",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-08-30-ethberlin-2019-decentralized-heatathon.md": {
  id: "2019/2019-08-30-ethberlin-2019-decentralized-heatathon.md",
  slug: "2019/2019-08-30-ethberlin-2019-decentralized-heatathon",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-09-03-stories-from-kubecon-ibm-announces-razee-a-multi-.md": {
  id: "2019/2019-09-03-stories-from-kubecon-ibm-announces-razee-a-multi-.md",
  slug: "2019/2019-09-03-stories-from-kubecon-ibm-announces-razee-a-multi-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-09-05-stories-from-kubecon-with-jason-mcgee-cto-ibm-clo.md": {
  id: "2019/2019-09-05-stories-from-kubecon-with-jason-mcgee-cto-ibm-clo.md",
  slug: "2019/2019-09-05-stories-from-kubecon-with-jason-mcgee-cto-ibm-clo",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-09-11-fluree-blockchain-graphql-and-more-all-in-one-dat.md": {
  id: "2019/2019-09-11-fluree-blockchain-graphql-and-more-all-in-one-dat.md",
  slug: "2019/2019-09-11-fluree-blockchain-graphql-and-more-all-in-one-dat",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-09-18-stories-from-kubecon-carmine-rimi-of-canonical.md": {
  id: "2019/2019-09-18-stories-from-kubecon-carmine-rimi-of-canonical.md",
  slug: "2019/2019-09-18-stories-from-kubecon-carmine-rimi-of-canonical",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-10-03-multipass-and-microk8s-the-quickest-route-to-ubun.md": {
  id: "2019/2019-10-03-multipass-and-microk8s-the-quickest-route-to-ubun.md",
  slug: "2019/2019-10-03-multipass-and-microk8s-the-quickest-route-to-ubun",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-10-12-a-fullstack-dapp-for-creating-tokens.md": {
  id: "2019/2019-10-12-a-fullstack-dapp-for-creating-tokens.md",
  slug: "2019/2019-10-12-a-fullstack-dapp-for-creating-tokens",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-10-12-create-a-hello-world-fullstack-dapp.md": {
  id: "2019/2019-10-12-create-a-hello-world-fullstack-dapp.md",
  slug: "2019/2019-10-12-create-a-hello-world-fullstack-dapp",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-10-17-a-fullstack-dapp-for-creating-unique-tradable-tok.md": {
  id: "2019/2019-10-17-a-fullstack-dapp-for-creating-unique-tradable-tok.md",
  slug: "2019/2019-10-17-a-fullstack-dapp-for-creating-unique-tradable-tok",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-11-14-documentation-structure.md": {
  id: "2019/2019-11-14-documentation-structure.md",
  slug: "2019/2019-11-14-documentation-structure",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-11-14-why-write-documentation.md": {
  id: "2019/2019-11-14-why-write-documentation.md",
  slug: "2019/2019-11-14-why-write-documentation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-11-18-language-and-understandable-writing.md": {
  id: "2019/2019-11-18-language-and-understandable-writing.md",
  slug: "2019/2019-11-18-language-and-understandable-writing",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-11-20-multipass-and-microk8s-the-quickest-route-to-ubun.md": {
  id: "2019/2019-11-20-multipass-and-microk8s-the-quickest-route-to-ubun.md",
  slug: "2019/2019-11-20-multipass-and-microk8s-the-quickest-route-to-ubun",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-11-25-iost-the-decentralized-internet-of-services.md": {
  id: "2019/2019-11-25-iost-the-decentralized-internet-of-services.md",
  slug: "2019/2019-11-25-iost-the-decentralized-internet-of-services",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-12-16-revisiting-desktop-linux-drowning-in-the-deep-end.md": {
  id: "2019/2019-12-16-revisiting-desktop-linux-drowning-in-the-deep-end.md",
  slug: "2019/2019-12-16-revisiting-desktop-linux-drowning-in-the-deep-end",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2019/2019-12-30-what-to-expect-in-open-source-software-in-the-nex.md": {
  id: "2019/2019-12-30-what-to-expect-in-open-source-software-in-the-nex.md",
  slug: "2019/2019-12-30-what-to-expect-in-open-source-software-in-the-nex",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-01-15-ces-2020-highlights-for-the-more-technically-mind.md": {
  id: "2020/2020-01-15-ces-2020-highlights-for-the-more-technically-mind.md",
  slug: "2020/2020-01-15-ces-2020-highlights-for-the-more-technically-mind",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-01-27-kong-api-platform-for-multi-cloud-and-hybrid-orga.md": {
  id: "2020/2020-01-27-kong-api-platform-for-multi-cloud-and-hybrid-orga.md",
  slug: "2020/2020-01-27-kong-api-platform-for-multi-cloud-and-hybrid-orga",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-02-04-introducing-starlingx-3-0-for-edge-computing-and-.md": {
  id: "2020/2020-02-04-introducing-starlingx-3-0-for-edge-computing-and-.md",
  slug: "2020/2020-02-04-introducing-starlingx-3-0-for-edge-computing-and-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-02-05-introducing-starlingx-3-0-for-edge-computing-and-.md": {
  id: "2020/2020-02-05-introducing-starlingx-3-0-for-edge-computing-and-.md",
  slug: "2020/2020-02-05-introducing-starlingx-3-0-for-edge-computing-and-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-02-19-automate-task-creation-with-the-todo-bot.md": {
  id: "2020/2020-02-19-automate-task-creation-with-the-todo-bot.md",
  slug: "2020/2020-02-19-automate-task-creation-with-the-todo-bot",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-02-27-talking-uber-level-monitoring-with-martin-mao-of-.md": {
  id: "2020/2020-02-27-talking-uber-level-monitoring-with-martin-mao-of-.md",
  slug: "2020/2020-02-27-talking-uber-level-monitoring-with-martin-mao-of-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-04-managing-documentation-shareholders-with-chris-ward-of-ethereum.md": {
  id: "2020/2020-03-04-managing-documentation-shareholders-with-chris-ward-of-ethereum.md",
  slug: "2020/2020-03-04-managing-documentation-shareholders-with-chris-ward-of-ethereum",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-09-preaching-the-api-gospel-an-interview-with-the-ap.md": {
  id: "2020/2020-03-09-preaching-the-api-gospel-an-interview-with-the-ap.md",
  slug: "2020/2020-03-09-preaching-the-api-gospel-an-interview-with-the-ap",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-09-the-future-of-tech-conferences-in-the-wake-of-cor.md": {
  id: "2020/2020-03-09-the-future-of-tech-conferences-in-the-wake-of-cor.md",
  slug: "2020/2020-03-09-the-future-of-tech-conferences-in-the-wake-of-cor",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-10-preaching-the-api-gospel-an-interview-with-the-ap.md": {
  id: "2020/2020-03-10-preaching-the-api-gospel-an-interview-with-the-ap.md",
  slug: "2020/2020-03-10-preaching-the-api-gospel-an-interview-with-the-ap",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-10-the-future-of-tech-conferences-in-the-wake-of-cor.md": {
  id: "2020/2020-03-10-the-future-of-tech-conferences-in-the-wake-of-cor.md",
  slug: "2020/2020-03-10-the-future-of-tech-conferences-in-the-wake-of-cor",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-11-make-tracking-agreements-simple-compliance-dashboard.md": {
  id: "2020/2020-03-11-make-tracking-agreements-simple-compliance-dashboard.md",
  slug: "2020/2020-03-11-make-tracking-agreements-simple-compliance-dashboard",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-18-troubleshoot-delays-with-code-review-analytics.md": {
  id: "2020/2020-03-18-troubleshoot-delays-with-code-review-analytics.md",
  slug: "2020/2020-03-18-troubleshoot-delays-with-code-review-analytics",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-23-6-interesting-trends-from-the-latest-cncf-survey.md": {
  id: "2020/2020-03-23-6-interesting-trends-from-the-latest-cncf-survey.md",
  slug: "2020/2020-03-23-6-interesting-trends-from-the-latest-cncf-survey",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-03-31-how-hedera-hashgraph-is-revolutionizing-distribut.md": {
  id: "2020/2020-03-31-how-hedera-hashgraph-is-revolutionizing-distribut.md",
  slug: "2020/2020-03-31-how-hedera-hashgraph-is-revolutionizing-distribut",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-04-01-learning-to-code-with-swift-playgrounds.md": {
  id: "2020/2020-04-01-learning-to-code-with-swift-playgrounds.md",
  slug: "2020/2020-04-01-learning-to-code-with-swift-playgrounds",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-04-21-cybersecurity-during-a-pandemic-an-interview-with.md": {
  id: "2020/2020-04-21-cybersecurity-during-a-pandemic-an-interview-with.md",
  slug: "2020/2020-04-21-cybersecurity-during-a-pandemic-an-interview-with",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-04-22-benefits-of-containerization.md": {
  id: "2020/2020-04-22-benefits-of-containerization.md",
  slug: "2020/2020-04-22-benefits-of-containerization",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-04-22-ubuntu-20-04-lts-focal-fossa-enterprise-ready.md": {
  id: "2020/2020-04-22-ubuntu-20-04-lts-focal-fossa-enterprise-ready.md",
  slug: "2020/2020-04-22-ubuntu-20-04-lts-focal-fossa-enterprise-ready",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-04-23-big-boy.md": {
  id: "2020/2020-04-23-big-boy.md",
  slug: "2020/2020-04-23-big-boy",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-04-23-crit-test-dummies-special-the-phantasmal-owlbear-.md": {
  id: "2020/2020-04-23-crit-test-dummies-special-the-phantasmal-owlbear-.md",
  slug: "2020/2020-04-23-crit-test-dummies-special-the-phantasmal-owlbear-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-04-24-parent-child-pipelines.md": {
  id: "2020/2020-04-24-parent-child-pipelines.md",
  slug: "2020/2020-04-24-parent-child-pipelines",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-04-30-deploy-with-kubectl-hands-on-with-kubernetes.md": {
  id: "2020/2020-04-30-deploy-with-kubectl-hands-on-with-kubernetes.md",
  slug: "2020/2020-04-30-deploy-with-kubectl-hands-on-with-kubernetes",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-05-05-grafana-the-open-observability-platform.md": {
  id: "2020/2020-05-05-grafana-the-open-observability-platform.md",
  slug: "2020/2020-05-05-grafana-the-open-observability-platform",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-05-14-github-satellite-2020-gone-remote-but-not-forgott.md": {
  id: "2020/2020-05-14-github-satellite-2020-gone-remote-but-not-forgott.md",
  slug: "2020/2020-05-14-github-satellite-2020-gone-remote-but-not-forgott",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-05-14-openstack-ussuri-intelligent-automation.md": {
  id: "2020/2020-05-14-openstack-ussuri-intelligent-automation.md",
  slug: "2020/2020-05-14-openstack-ussuri-intelligent-automation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-05-17-measuring-metrics-in-open-source-projects.md": {
  id: "2020/2020-05-17-measuring-metrics-in-open-source-projects.md",
  slug: "2020/2020-05-17-measuring-metrics-in-open-source-projects",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-05-19-three-git-pull-requests.md": {
  id: "2020/2020-05-19-three-git-pull-requests.md",
  slug: "2020/2020-05-19-three-git-pull-requests",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-06-05-handling-environment-variables-with-kubernetes.md": {
  id: "2020/2020-06-05-handling-environment-variables-with-kubernetes.md",
  slug: "2020/2020-06-05-handling-environment-variables-with-kubernetes",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-06-16-benefits-and-best-practices-of-continuous-delivery.md": {
  id: "2020/2020-06-16-benefits-and-best-practices-of-continuous-delivery.md",
  slug: "2020/2020-06-16-benefits-and-best-practices-of-continuous-delivery",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-06-19-continuous-integration-vs-continuous-delivery-vs-continuous-deployment.md": {
  id: "2020/2020-06-19-continuous-integration-vs-continuous-delivery-vs-continuous-deployment.md",
  slug: "2020/2020-06-19-continuous-integration-vs-continuous-delivery-vs-continuous-deployment",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-06-23-create-a-random-board-game-generator-using-micros.md": {
  id: "2020/2020-06-23-create-a-random-board-game-generator-using-micros.md",
  slug: "2020/2020-06-23-create-a-random-board-game-generator-using-micros",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-06-30-ephemeral-environments-for-testing.md": {
  id: "2020/2020-06-30-ephemeral-environments-for-testing.md",
  slug: "2020/2020-06-30-ephemeral-environments-for-testing",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-07-10-crit-test-dummies-ep-5-how-to-raise-a-dragon.md": {
  id: "2020/2020-07-10-crit-test-dummies-ep-5-how-to-raise-a-dragon.md",
  slug: "2020/2020-07-10-crit-test-dummies-ep-5-how-to-raise-a-dragon",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-07-15-developer-experience-roundtable-continuous-improvement-nigel-simpson-erik-muttersbach.md": {
  id: "2020/2020-07-15-developer-experience-roundtable-continuous-improvement-nigel-simpson-erik-muttersbach.md",
  slug: "2020/2020-07-15-developer-experience-roundtable-continuous-improvement-nigel-simpson-erik-muttersbach",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-07-31-crit-test-dummies-episode-6-mistress-of-blood-tow.md": {
  id: "2020/2020-07-31-crit-test-dummies-episode-6-mistress-of-blood-tow.md",
  slug: "2020/2020-07-31-crit-test-dummies-episode-6-mistress-of-blood-tow",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-08-06-sandbox-environments-for-testing.md": {
  id: "2020/2020-08-06-sandbox-environments-for-testing.md",
  slug: "2020/2020-08-06-sandbox-environments-for-testing",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-08-24-such-devoted-sisters-lgbt-pride-special.md": {
  id: "2020/2020-08-24-such-devoted-sisters-lgbt-pride-special.md",
  slug: "2020/2020-08-24-such-devoted-sisters-lgbt-pride-special",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-08-26-reducing-support-overload-with-an-einstein-powere.md": {
  id: "2020/2020-08-26-reducing-support-overload-with-an-einstein-powere.md",
  slug: "2020/2020-08-26-reducing-support-overload-with-an-einstein-powere",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-09-18-dxpos-api-design-and-rest-client-insomnia.md": {
  id: "2020/2020-09-18-dxpos-api-design-and-rest-client-insomnia.md",
  slug: "2020/2020-09-18-dxpos-api-design-and-rest-client-insomnia",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-09-20-creating-a-cross-platform-todo-aggregator-with-fl.md": {
  id: "2020/2020-09-20-creating-a-cross-platform-todo-aggregator-with-fl.md",
  slug: "2020/2020-09-20-creating-a-cross-platform-todo-aggregator-with-fl",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-09-21-configuration-version-changes-kubernetes-apps.md": {
  id: "2020/2020-09-21-configuration-version-changes-kubernetes-apps.md",
  slug: "2020/2020-09-21-configuration-version-changes-kubernetes-apps",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-09-23-the-weekly-squeak-tanmai-gopal-of-hasura.md": {
  id: "2020/2020-09-23-the-weekly-squeak-tanmai-gopal-of-hasura.md",
  slug: "2020/2020-09-23-the-weekly-squeak-tanmai-gopal-of-hasura",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-09-29-crit-test-dummies-ep-7-bubble-bubble-toil-and-tro.md": {
  id: "2020/2020-09-29-crit-test-dummies-ep-7-bubble-bubble-toil-and-tro.md",
  slug: "2020/2020-09-29-crit-test-dummies-ep-7-bubble-bubble-toil-and-tro",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-10-06-developer-experience.md": {
  id: "2020/2020-10-06-developer-experience.md",
  slug: "2020/2020-10-06-developer-experience",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-10-12-why-zalando-built-own-developer-platform.md": {
  id: "2020/2020-10-12-why-zalando-built-own-developer-platform.md",
  slug: "2020/2020-10-12-why-zalando-built-own-developer-platform",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-10-18-crit-test-dummies-episode-8-corruption-of-skyhorn.md": {
  id: "2020/2020-10-18-crit-test-dummies-episode-8-corruption-of-skyhorn.md",
  slug: "2020/2020-10-18-crit-test-dummies-episode-8-corruption-of-skyhorn",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-10-23-amazon-elasticache-for-redis-polarsquad-hackathon.md": {
  id: "2020/2020-10-23-amazon-elasticache-for-redis-polarsquad-hackathon.md",
  slug: "2020/2020-10-23-amazon-elasticache-for-redis-polarsquad-hackathon",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-11-02-tournament-of-tokens-one-shot-special.md": {
  id: "2020/2020-11-02-tournament-of-tokens-one-shot-special.md",
  slug: "2020/2020-11-02-tournament-of-tokens-one-shot-special",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-11-04-testing-hotfixes.md": {
  id: "2020/2020-11-04-testing-hotfixes.md",
  slug: "2020/2020-11-04-testing-hotfixes",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-11-16-haunting-of-owlbear-lodge-halloween-special.md": {
  id: "2020/2020-11-16-haunting-of-owlbear-lodge-halloween-special.md",
  slug: "2020/2020-11-16-haunting-of-owlbear-lodge-halloween-special",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-11-21-crit-test-dummies-ep-10-mined-your-head-pt-1.md": {
  id: "2020/2020-11-21-crit-test-dummies-ep-10-mined-your-head-pt-1.md",
  slug: "2020/2020-11-21-crit-test-dummies-ep-10-mined-your-head-pt-1",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-11-21-crit-test-dummies-ep-9-mined-your-head-pt-1.md": {
  id: "2020/2020-11-21-crit-test-dummies-ep-9-mined-your-head-pt-1.md",
  slug: "2020/2020-11-21-crit-test-dummies-ep-9-mined-your-head-pt-1",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-11-22-crit-test-dummies-ep-9-mined-your-head-pt-2.md": {
  id: "2020/2020-11-22-crit-test-dummies-ep-9-mined-your-head-pt-2.md",
  slug: "2020/2020-11-22-crit-test-dummies-ep-9-mined-your-head-pt-2",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-11-23-why-sport1-developer-platform.md": {
  id: "2020/2020-11-23-why-sport1-developer-platform.md",
  slug: "2020/2020-11-23-why-sport1-developer-platform",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-11-24-why-github-developer-platform.md": {
  id: "2020/2020-11-24-why-github-developer-platform.md",
  slug: "2020/2020-11-24-why-github-developer-platform",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-12-15-api-design-developer-experience.md": {
  id: "2020/2020-12-15-api-design-developer-experience.md",
  slug: "2020/2020-12-15-api-design-developer-experience",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-12-28-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt.md": {
  id: "2020/2020-12-28-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt.md",
  slug: "2020/2020-12-28-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2020/2020-12-29-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt.md": {
  id: "2020/2020-12-29-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt.md",
  slug: "2020/2020-12-29-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-01-14-screenshot-tool-comparison.md": {
  id: "2021/2021-01-14-screenshot-tool-comparison.md",
  slug: "2021/2021-01-14-screenshot-tool-comparison",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-01-22-scaling-your-team-alongside-kubernetes.md": {
  id: "2021/2021-01-22-scaling-your-team-alongside-kubernetes.md",
  slug: "2021/2021-01-22-scaling-your-team-alongside-kubernetes",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-02-10-developer-experience-documentation.md": {
  id: "2021/2021-02-10-developer-experience-documentation.md",
  slug: "2021/2021-02-10-developer-experience-documentation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-02-25-why-development-teams-should-play-roleplaying-gam.md": {
  id: "2021/2021-02-25-why-development-teams-should-play-roleplaying-gam.md",
  slug: "2021/2021-02-25-why-development-teams-should-play-roleplaying-gam",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-03-03-gitops-pros-and-cons.md": {
  id: "2021/2021-03-03-gitops-pros-and-cons.md",
  slug: "2021/2021-03-03-gitops-pros-and-cons",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-03-25-crit-test-dummies-ep-11-pt2-the-crumbling-stairs.md": {
  id: "2021/2021-03-25-crit-test-dummies-ep-11-pt2-the-crumbling-stairs.md",
  slug: "2021/2021-03-25-crit-test-dummies-ep-11-pt2-the-crumbling-stairs",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-03-25-crit-test-dummies-ep-11-the-crumbling-stairs-pt-1.md": {
  id: "2021/2021-03-25-crit-test-dummies-ep-11-the-crumbling-stairs-pt-1.md",
  slug: "2021/2021-03-25-crit-test-dummies-ep-11-the-crumbling-stairs-pt-1",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-03-25-devx5-developer-experience-deep-dive-with-twilio.md": {
  id: "2021/2021-03-25-devx5-developer-experience-deep-dive-with-twilio.md",
  slug: "2021/2021-03-25-devx5-developer-experience-deep-dive-with-twilio",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-03-26-crit-test-dummies-ep-12-pt1-battle-royale.md": {
  id: "2021/2021-03-26-crit-test-dummies-ep-12-pt1-battle-royale.md",
  slug: "2021/2021-03-26-crit-test-dummies-ep-12-pt1-battle-royale",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-03-26-crit-test-dummies-ep-12-pt2-battle-royale.md": {
  id: "2021/2021-03-26-crit-test-dummies-ep-12-pt2-battle-royale.md",
  slug: "2021/2021-03-26-crit-test-dummies-ep-12-pt2-battle-royale",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-04-08-ctd-shadow-of-ebondeath-pt-2-ep-13.md": {
  id: "2021/2021-04-08-ctd-shadow-of-ebondeath-pt-2-ep-13.md",
  slug: "2021/2021-04-08-ctd-shadow-of-ebondeath-pt-2-ep-13",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-04-08-ctd-shadow-of-ebondeath-pt1-ep-13.md": {
  id: "2021/2021-04-08-ctd-shadow-of-ebondeath-pt1-ep-13.md",
  slug: "2021/2021-04-08-ctd-shadow-of-ebondeath-pt1-ep-13",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-04-09-ctd-three-faces-of-night-pt-1-ep-14.md": {
  id: "2021/2021-04-09-ctd-three-faces-of-night-pt-1-ep-14.md",
  slug: "2021/2021-04-09-ctd-three-faces-of-night-pt-1-ep-14",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-04-09-ctd-three-faces-of-night-pt-2-ep-14.md": {
  id: "2021/2021-04-09-ctd-three-faces-of-night-pt-2-ep-14.md",
  slug: "2021/2021-04-09-ctd-three-faces-of-night-pt-2-ep-14",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-04-10-supers-and-sorcery-one-shot-special-by-crit-test-.md": {
  id: "2021/2021-04-10-supers-and-sorcery-one-shot-special-by-crit-test-.md",
  slug: "2021/2021-04-10-supers-and-sorcery-one-shot-special-by-crit-test-",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-04-20-10-great-podcasts-software-test-engineers.md": {
  id: "2021/2021-04-20-10-great-podcasts-software-test-engineers.md",
  slug: "2021/2021-04-20-10-great-podcasts-software-test-engineers",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-04-22-devx5-developer-experience-deep-dive-with-bannerb.md": {
  id: "2021/2021-04-22-devx5-developer-experience-deep-dive-with-bannerb.md",
  slug: "2021/2021-04-22-devx5-developer-experience-deep-dive-with-bannerb",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-05-06-devx5-developer-experience-deep-dive-with-gitpod.md": {
  id: "2021/2021-05-06-devx5-developer-experience-deep-dive-with-gitpod.md",
  slug: "2021/2021-05-06-devx5-developer-experience-deep-dive-with-gitpod",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-05-20-kubecon-2021.md": {
  id: "2021/2021-05-20-kubecon-2021.md",
  slug: "2021/2021-05-20-kubecon-2021",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-05-27-an-introduction-to-promql.md": {
  id: "2021/2021-05-27-an-introduction-to-promql.md",
  slug: "2021/2021-05-27-an-introduction-to-promql",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-06-17-devx5-rapidly-build-websites-with-tailwind-css.md": {
  id: "2021/2021-06-17-devx5-rapidly-build-websites-with-tailwind-css.md",
  slug: "2021/2021-06-17-devx5-rapidly-build-websites-with-tailwind-css",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-06-24-how-can-recording-and-roll-up-rules-help-your-metrics.md": {
  id: "2021/2021-06-24-how-can-recording-and-roll-up-rules-help-your-metrics.md",
  slug: "2021/2021-06-24-how-can-recording-and-roll-up-rules-help-your-metrics",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-06-28-ctd-white-dragon-mountain-pt-2-ep-15.md": {
  id: "2021/2021-06-28-ctd-white-dragon-mountain-pt-2-ep-15.md",
  slug: "2021/2021-06-28-ctd-white-dragon-mountain-pt-2-ep-15",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-06-28-ctd-white-dragon-mountain-pt1-ep-15.md": {
  id: "2021/2021-06-28-ctd-white-dragon-mountain-pt1-ep-15.md",
  slug: "2021/2021-06-28-ctd-white-dragon-mountain-pt1-ep-15",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-06-30-ctd-winter-wonderland-ep-16-pt-1.md": {
  id: "2021/2021-06-30-ctd-winter-wonderland-ep-16-pt-1.md",
  slug: "2021/2021-06-30-ctd-winter-wonderland-ep-16-pt-1",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-07-01-devx5-fast-application-development-with-stepzen.md": {
  id: "2021/2021-07-01-devx5-fast-application-development-with-stepzen.md",
  slug: "2021/2021-07-01-devx5-fast-application-development-with-stepzen",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-07-15-devx5-code-based-music-collaboration-with-sonic-p.md": {
  id: "2021/2021-07-15-devx5-code-based-music-collaboration-with-sonic-p.md",
  slug: "2021/2021-07-15-devx5-code-based-music-collaboration-with-sonic-p",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-07-15-why-your-software-teams-need-internal-developer-platform.md": {
  id: "2021/2021-07-15-why-your-software-teams-need-internal-developer-platform.md",
  slug: "2021/2021-07-15-why-your-software-teams-need-internal-developer-platform",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-07-22-open-source-monitoring-landscape.md": {
  id: "2021/2021-07-22-open-source-monitoring-landscape.md",
  slug: "2021/2021-07-22-open-source-monitoring-landscape",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-07-25-ctd-finale-ep-17-pt-3.md": {
  id: "2021/2021-07-25-ctd-finale-ep-17-pt-3.md",
  slug: "2021/2021-07-25-ctd-finale-ep-17-pt-3",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-07-25-ctd-pride-2021-special.md": {
  id: "2021/2021-07-25-ctd-pride-2021-special.md",
  slug: "2021/2021-07-25-ctd-pride-2021-special",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-07-29-devx5-the-best-js-framework-with-next-js.md": {
  id: "2021/2021-07-29-devx5-the-best-js-framework-with-next-js.md",
  slug: "2021/2021-07-29-devx5-the-best-js-framework-with-next-js",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-08-03-eye-observability-jul.md": {
  id: "2021/2021-08-03-eye-observability-jul.md",
  slug: "2021/2021-08-03-eye-observability-jul",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-08-13-chronicles-of-ghaistala-intro-video.md": {
  id: "2021/2021-08-13-chronicles-of-ghaistala-intro-video.md",
  slug: "2021/2021-08-13-chronicles-of-ghaistala-intro-video",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-08-13-ep-1-origin-story-chronicles-of-ghaistala.md": {
  id: "2021/2021-08-13-ep-1-origin-story-chronicles-of-ghaistala.md",
  slug: "2021/2021-08-13-ep-1-origin-story-chronicles-of-ghaistala",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-08-13-ep-2-deals-in-the-dark-chronicles-of-ghaistala.md": {
  id: "2021/2021-08-13-ep-2-deals-in-the-dark-chronicles-of-ghaistala.md",
  slug: "2021/2021-08-13-ep-2-deals-in-the-dark-chronicles-of-ghaistala",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-08-13-ep-3-union-dues-chronicles-of-ghaistala.md": {
  id: "2021/2021-08-13-ep-3-union-dues-chronicles-of-ghaistala.md",
  slug: "2021/2021-08-13-ep-3-union-dues-chronicles-of-ghaistala",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-08-22-ep-4-leverage-chronicles-of-ghaistala.md": {
  id: "2021/2021-08-22-ep-4-leverage-chronicles-of-ghaistala.md",
  slug: "2021/2021-08-22-ep-4-leverage-chronicles-of-ghaistala",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-08-26-devx5-ship-apps-faster-with-netlify.md": {
  id: "2021/2021-08-26-devx5-ship-apps-faster-with-netlify.md",
  slug: "2021/2021-08-26-devx5-ship-apps-faster-with-netlify",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-08-31-eye-observability-aug.md": {
  id: "2021/2021-08-31-eye-observability-aug.md",
  slug: "2021/2021-08-31-eye-observability-aug",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-09-03-nextcloud-and-kubernetes-in-the-cloud-with-kuma-s.md": {
  id: "2021/2021-09-03-nextcloud-and-kubernetes-in-the-cloud-with-kuma-s.md",
  slug: "2021/2021-09-03-nextcloud-and-kubernetes-in-the-cloud-with-kuma-s",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-09-07-my-audio-video-production-setup.md": {
  id: "2021/2021-09-07-my-audio-video-production-setup.md",
  slug: "2021/2021-09-07-my-audio-video-production-setup",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-09-09-devx5-empowering-developers-with-rust.md": {
  id: "2021/2021-09-09-devx5-empowering-developers-with-rust.md",
  slug: "2021/2021-09-09-devx5-empowering-developers-with-rust",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-09-22-containers-days-hamburg.md": {
  id: "2021/2021-09-22-containers-days-hamburg.md",
  slug: "2021/2021-09-22-containers-days-hamburg",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-09-24-ep-5-up-up-and-away-chronicles-of-ghaistala.md": {
  id: "2021/2021-09-24-ep-5-up-up-and-away-chronicles-of-ghaistala.md",
  slug: "2021/2021-09-24-ep-5-up-up-and-away-chronicles-of-ghaistala",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-09-26-ep-6-the-light-chronicles-of-ghaistala.md": {
  id: "2021/2021-09-26-ep-6-the-light-chronicles-of-ghaistala.md",
  slug: "2021/2021-09-26-ep-6-the-light-chronicles-of-ghaistala",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-10-21-devx5-self-hosted-slack-with-mattermost.md": {
  id: "2021/2021-10-21-devx5-self-hosted-slack-with-mattermost.md",
  slug: "2021/2021-10-21-devx5-self-hosted-slack-with-mattermost",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-10-28-games-tools.md": {
  id: "2021/2021-10-28-games-tools.md",
  slug: "2021/2021-10-28-games-tools",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-10-28-open-source-tracing-landscape.md": {
  id: "2021/2021-10-28-open-source-tracing-landscape.md",
  slug: "2021/2021-10-28-open-source-tracing-landscape",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-10-31-eve-of-fall-ctd-halloween-special-21.md": {
  id: "2021/2021-10-31-eve-of-fall-ctd-halloween-special-21.md",
  slug: "2021/2021-10-31-eve-of-fall-ctd-halloween-special-21",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-11-04-devx5-workflow-automation-with-hashicorp.md": {
  id: "2021/2021-11-04-devx5-workflow-automation-with-hashicorp.md",
  slug: "2021/2021-11-04-devx5-workflow-automation-with-hashicorp",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-11-08-continuous-delivery-with-humanitec-postman-collection.md": {
  id: "2021/2021-11-08-continuous-delivery-with-humanitec-postman-collection.md",
  slug: "2021/2021-11-08-continuous-delivery-with-humanitec-postman-collection",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-11-11-eye-observability-nov.md": {
  id: "2021/2021-11-11-eye-observability-nov.md",
  slug: "2021/2021-11-11-eye-observability-nov",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-11-18-devx5-workflow-automation-with-hashicorp-pt2.md": {
  id: "2021/2021-11-18-devx5-workflow-automation-with-hashicorp-pt2.md",
  slug: "2021/2021-11-18-devx5-workflow-automation-with-hashicorp-pt2",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-11-18-pagerduty-chronosphere.md": {
  id: "2021/2021-11-18-pagerduty-chronosphere.md",
  slug: "2021/2021-11-18-pagerduty-chronosphere",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-11-27-that-sounds-interesting.md": {
  id: "2021/2021-11-27-that-sounds-interesting.md",
  slug: "2021/2021-11-27-that-sounds-interesting",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-12-02-devx5-workflow-automation-with-hashicorp.md": {
  id: "2021/2021-12-02-devx5-workflow-automation-with-hashicorp.md",
  slug: "2021/2021-12-02-devx5-workflow-automation-with-hashicorp",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-12-04-nanowrimo-2021.md": {
  id: "2021/2021-12-04-nanowrimo-2021.md",
  slug: "2021/2021-12-04-nanowrimo-2021",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-12-12-migrating-mac.md": {
  id: "2021/2021-12-12-migrating-mac.md",
  slug: "2021/2021-12-12-migrating-mac",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2021/2021-12-14-gke-autopilot.md": {
  id: "2021/2021-12-14-gke-autopilot.md",
  slug: "2021/2021-12-14-gke-autopilot",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-01-13-devops-tools.md": {
  id: "2022/2022-01-13-devops-tools.md",
  slug: "2022/2022-01-13-devops-tools",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-01-20-reducing-negative-language-documentation.md": {
  id: "2022/2022-01-20-reducing-negative-language-documentation.md",
  slug: "2022/2022-01-20-reducing-negative-language-documentation",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-01-27-tools-docs-as-code.md": {
  id: "2022/2022-01-27-tools-docs-as-code.md",
  slug: "2022/2022-01-27-tools-docs-as-code",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-02-06-the-differences-between-a-service-catalog-interna.md": {
  id: "2022/2022-02-06-the-differences-between-a-service-catalog-interna.md",
  slug: "2022/2022-02-06-the-differences-between-a-service-catalog-interna",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-02-07-the-differences-between-a-service-catalog-interna.md": {
  id: "2022/2022-02-07-the-differences-between-a-service-catalog-interna.md",
  slug: "2022/2022-02-07-the-differences-between-a-service-catalog-interna",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-02-20-how-setup-raspberry-pi-files-media.md": {
  id: "2022/2022-02-20-how-setup-raspberry-pi-files-media.md",
  slug: "2022/2022-02-20-how-setup-raspberry-pi-files-media",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-05-31-instrumenting-a-javascript-application-for-opente.md": {
  id: "2022/2022-05-31-instrumenting-a-javascript-application-for-opente.md",
  slug: "2022/2022-05-31-instrumenting-a-javascript-application-for-opente",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-06-26-open-source-monitoring-and-metrics-landscape.md": {
  id: "2022/2022-06-26-open-source-monitoring-and-metrics-landscape.md",
  slug: "2022/2022-06-26-open-source-monitoring-and-metrics-landscape",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-07-05-cloud-native-sustainability.md": {
  id: "2022/2022-07-05-cloud-native-sustainability.md",
  slug: "2022/2022-07-05-cloud-native-sustainability",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-07-10-increasing-cloud-native-sustainability-with-obser.md": {
  id: "2022/2022-07-10-increasing-cloud-native-sustainability-with-obser.md",
  slug: "2022/2022-07-10-increasing-cloud-native-sustainability-with-obser",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
"2022/2022-07-29-cristian-heilmann-principal-program-manager-devel.md": {
  id: "2022/2022-07-29-cristian-heilmann-principal-program-manager-devel.md",
  slug: "2022/2022-07-29-cristian-heilmann-principal-program-manager-devel",
  body: string,
  collection: "post",
  data: InferEntrySchema<"post">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
