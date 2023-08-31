declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
	export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"books": {
"australian-veg-food-guide.md": {
	id: "australian-veg-food-guide.md";
  slug: "australian-veg-food-guide";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"collective-verses-2.md": {
	id: "collective-verses-2.md";
  slug: "collective-verses-2";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"developers-guide-to-technical-writing.md": {
	id: "developers-guide-to-technical-writing.md";
  slug: "developers-guide-to-technical-writing";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"flashbang-3.md": {
	id: "flashbang-3.md";
  slug: "flashbang-3";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"jumpstart-responsive-design.md": {
	id: "jumpstart-responsive-design.md";
  slug: "jumpstart-responsive-design";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"neon-pilgrim.md": {
	id: "neon-pilgrim.md";
  slug: "neon-pilgrim";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"small-gregarious-fiction-volume-1.md": {
	id: "small-gregarious-fiction-volume-1.md";
  slug: "small-gregarious-fiction-volume-1";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"surveying-the-wreckage.md": {
	id: "surveying-the-wreckage.md";
  slug: "surveying-the-wreckage";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"wrapped-in-pastry.md": {
	id: "wrapped-in-pastry.md";
  slug: "wrapped-in-pastry";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
};
"clients": {
"chronosphere.md": {
	id: "chronosphere.md";
  slug: "chronosphere";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"codeship.md": {
	id: "codeship.md";
  slug: "codeship";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"consensys.md": {
	id: "consensys.md";
  slug: "consensys";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"coralogix.md": {
	id: "coralogix.md";
  slug: "coralogix";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"cultofmac.md": {
	id: "cultofmac.md";
  slug: "cultofmac";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"data-artisans.md": {
	id: "data-artisans.md";
  slug: "data-artisans";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"devspotlight.md": {
	id: "devspotlight.md";
  slug: "devspotlight";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"dgraph.md": {
	id: "dgraph.md";
  slug: "dgraph";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"dzone.md": {
	id: "dzone.md";
  slug: "dzone";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"envato.md": {
	id: "envato.md";
  slug: "envato";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"ethereum-foundation.md": {
	id: "ethereum-foundation.md";
  slug: "ethereum-foundation";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"eventstore.md": {
	id: "eventstore.md";
  slug: "eventstore";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"exoscale.md": {
	id: "exoscale.md";
  slug: "exoscale";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"facebook-messenger.md": {
	id: "facebook-messenger.md";
  slug: "facebook-messenger";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"faria.md": {
	id: "faria.md";
  slug: "faria";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"gitlab.md": {
	id: "gitlab.md";
  slug: "gitlab";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"here.md": {
	id: "here.md";
  slug: "here";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"humanitec.md": {
	id: "humanitec.md";
  slug: "humanitec";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"libcamera.md": {
	id: "libcamera.md";
  slug: "libcamera";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"pagerduty.md": {
	id: "pagerduty.md";
  slug: "pagerduty";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"progress.md": {
	id: "progress.md";
  slug: "progress";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"sitepoint.md": {
	id: "sitepoint.md";
  slug: "sitepoint";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"sqreen.md": {
	id: "sqreen.md";
  slug: "sqreen";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"takipi.md": {
	id: "takipi.md";
  slug: "takipi";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"techbeacon.md": {
	id: "techbeacon.md";
  slug: "techbeacon";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"unity.md": {
	id: "unity.md";
  slug: "unity";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
"weave.md": {
	id: "weave.md";
  slug: "weave";
  body: string;
  collection: "clients";
  data: InferEntrySchema<"clients">
} & { render(): Render[".md"] };
};
"events": {
"2012-07-09-jquery-mobile.md": {
	id: "2012-07-09-jquery-mobile.md";
  slug: "2012-07-09-jquery-mobile";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2012-07-22-building-mobile-phone-apps-with-phonegap-and-titanium-accelerator.md": {
	id: "2012-07-22-building-mobile-phone-apps-with-phonegap-and-titanium-accelerator.md";
  slug: "2012-07-22-building-mobile-phone-apps-with-phonegap-and-titanium-accelerator";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2012-07-24-blogging-with-drupal.md": {
	id: "2012-07-24-blogging-with-drupal.md";
  slug: "2012-07-24-blogging-with-drupal";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2012-08-08-civicrm-and-wordpress.md": {
	id: "2012-08-08-civicrm-and-wordpress.md";
  slug: "2012-08-08-civicrm-and-wordpress";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2012-09-04-cosmic-horror-and-hp-lovecraft.md": {
	id: "2012-09-04-cosmic-horror-and-hp-lovecraft.md";
  slug: "2012-09-04-cosmic-horror-and-hp-lovecraft";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2012-09-05-hp-lovecraft-father-of-gothic-horror.md": {
	id: "2012-09-05-hp-lovecraft-father-of-gothic-horror.md";
  slug: "2012-09-05-hp-lovecraft-father-of-gothic-horror";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2012-10-27-drupal.md": {
	id: "2012-10-27-drupal.md";
  slug: "2012-10-27-drupal";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2012-10-29-customising-civicrm-md.md": {
	id: "2012-10-29-customising-civicrm-md.md";
  slug: "2012-10-29-customising-civicrm-md";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2013-03-12-why-your-image-of-the-world-could-be-wrong.md": {
	id: "2013-03-12-why-your-image-of-the-world-could-be-wrong.md";
  slug: "2013-03-12-why-your-image-of-the-world-could-be-wrong";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2013-05-07-tweak-test-and-debug-your-mobile-apps.md": {
	id: "2013-05-07-tweak-test-and-debug-your-mobile-apps.md";
  slug: "2013-05-07-tweak-test-and-debug-your-mobile-apps";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2013-07-17-power-your-mobile-presence-with-drupal.md": {
	id: "2013-07-17-power-your-mobile-presence-with-drupal.md";
  slug: "2013-07-17-power-your-mobile-presence-with-drupal";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2013-07-17-removing-barriers-in-engagement.md": {
	id: "2013-07-17-removing-barriers-in-engagement.md";
  slug: "2013-07-17-removing-barriers-in-engagement";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2013-07-23-drupal-devops-decoupling-demystifying-and-decomplicating.md": {
	id: "2013-07-23-drupal-devops-decoupling-demystifying-and-decomplicating.md";
  slug: "2013-07-23-drupal-devops-decoupling-demystifying-and-decomplicating";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2014-01-19-why-you-should-come-to-drupal-south.md": {
	id: "2014-01-19-why-you-should-come-to-drupal-south.md";
  slug: "2014-01-19-why-you-should-come-to-drupal-south";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2014-02-14-jms-cms-untangle-the-mess.md": {
	id: "2014-02-14-jms-cms-untangle-the-mess.md";
  slug: "2014-02-14-jms-cms-untangle-the-mess";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2014-02-20-cosmic-horror-and-hp-lovecraft.md": {
	id: "2014-02-20-cosmic-horror-and-hp-lovecraft.md";
  slug: "2014-02-20-cosmic-horror-and-hp-lovecraft";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2014-06-22-what-does-always-listening-mean-to-your-ux.md": {
	id: "2014-06-22-what-does-always-listening-mean-to-your-ux.md";
  slug: "2014-06-22-what-does-always-listening-mean-to-your-ux";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-04-13-crate-and-docker.md": {
	id: "2015-04-13-crate-and-docker.md";
  slug: "2015-04-13-crate-and-docker";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-04-23-scalable-databases.md": {
	id: "2015-04-23-scalable-databases.md";
  slug: "2015-04-23-scalable-databases";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-04-28-scale-your-database-like-your-application.md": {
	id: "2015-04-28-scale-your-database-like-your-application.md";
  slug: "2015-04-28-scale-your-database-like-your-application";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-05-14-oscal.md": {
	id: "2015-05-14-oscal.md";
  slug: "2015-05-14-oscal";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-05-21-idc-data-hub-vienna.md": {
	id: "2015-05-21-idc-data-hub-vienna.md";
  slug: "2015-05-21-idc-data-hub-vienna";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-05-28-powering-the-internet-of-things-with-distributed-databases.md": {
	id: "2015-05-28-powering-the-internet-of-things-with-distributed-databases.md";
  slug: "2015-05-28-powering-the-internet-of-things-with-distributed-databases";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-06-01-understanding-databases-for-distributed-docker-applications.md": {
	id: "2015-06-01-understanding-databases-for-distributed-docker-applications.md";
  slug: "2015-06-01-understanding-databases-for-distributed-docker-applications";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-06-04-understanding-databases-for-distributed-docker-applications.md": {
	id: "2015-06-04-understanding-databases-for-distributed-docker-applications.md";
  slug: "2015-06-04-understanding-databases-for-distributed-docker-applications";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-06-21-advocate-bits.md": {
	id: "2015-06-21-advocate-bits.md";
  slug: "2015-06-21-advocate-bits";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-06-21-printing-the-web.md": {
	id: "2015-06-21-printing-the-web.md";
  slug: "2015-06-21-printing-the-web";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-07-08-orchestrating-databases-with-docker.md": {
	id: "2015-07-08-orchestrating-databases-with-docker.md";
  slug: "2015-07-08-orchestrating-databases-with-docker";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-07-09-scale-your-database-like-your-application.md": {
	id: "2015-07-09-scale-your-database-like-your-application.md";
  slug: "2015-07-09-scale-your-database-like-your-application";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-08-31-documenting-your-story-crafting-a-good-presentation.md": {
	id: "2015-08-31-documenting-your-story-crafting-a-good-presentation.md";
  slug: "2015-08-31-documenting-your-story-crafting-a-good-presentation";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-09-17-understanding-databases-for-distributed-applications-md.md": {
	id: "2015-09-17-understanding-databases-for-distributed-applications-md.md";
  slug: "2015-09-17-understanding-databases-for-distributed-applications-md";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-09-24-developer-health.md": {
	id: "2015-09-24-developer-health.md";
  slug: "2015-09-24-developer-health";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-09-28-managing-distributed-data-with-apache-mesos.md": {
	id: "2015-09-28-managing-distributed-data-with-apache-mesos.md";
  slug: "2015-09-28-managing-distributed-data-with-apache-mesos";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-09-30-github-revisited-analyzing-100s-of-million-of-events-in-realtime.md": {
	id: "2015-09-30-github-revisited-analyzing-100s-of-million-of-events-in-realtime.md";
  slug: "2015-09-30-github-revisited-analyzing-100s-of-million-of-events-in-realtime";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-10-01-introducing-distributed-databases.md": {
	id: "2015-10-01-introducing-distributed-databases.md";
  slug: "2015-10-01-introducing-distributed-databases";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-10-03-introducing-distributed-databases.md": {
	id: "2015-10-03-introducing-distributed-databases.md";
  slug: "2015-10-03-introducing-distributed-databases";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-10-05-dublin-sql-md.md": {
	id: "2015-10-05-dublin-sql-md.md";
  slug: "2015-10-05-dublin-sql-md";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-10-05-understanding-distributed-databases.md": {
	id: "2015-10-05-understanding-distributed-databases.md";
  slug: "2015-10-05-understanding-distributed-databases";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-10-07-understanding-distributed.databases.md": {
	id: "2015-10-07-understanding-distributed.databases.md";
  slug: "2015-10-07-understanding-distributeddatabases";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2015-12-08-upfront-dec.md": {
	id: "2015-12-08-upfront-dec.md";
  slug: "2015-12-08-upfront-dec";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-01-07-rub-jan.md": {
	id: "2016-01-07-rub-jan.md";
  slug: "2016-01-07-rub-jan";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-01-19-art-games.md": {
	id: "2016-01-19-art-games.md";
  slug: "2016-01-19-art-games";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-01-30-fosdem.md": {
	id: "2016-01-30-fosdem.md";
  slug: "2016-01-30-fosdem";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-02-10-talk-and-play.md": {
	id: "2016-02-10-talk-and-play.md";
  slug: "2016-02-10-talk-and-play";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-02-20-poor-and-literate-short-stories.md": {
	id: "2016-02-20-poor-and-literate-short-stories.md";
  slug: "2016-02-20-poor-and-literate-short-stories";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-02-29-voxxed-vienna.md": {
	id: "2016-02-29-voxxed-vienna.md";
  slug: "2016-02-29-voxxed-vienna";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-03-17-the-past-present-and-future-of-swift.md": {
	id: "2016-03-17-the-past-present-and-future-of-swift.md";
  slug: "2016-03-17-the-past-present-and-future-of-swift";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-04-21-back-to-the-future-with-static-sites.md": {
	id: "2016-04-21-back-to-the-future-with-static-sites.md";
  slug: "2016-04-21-back-to-the-future-with-static-sites";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-05-05-better-documentation.md": {
	id: "2016-05-05-better-documentation.md";
  slug: "2016-05-05-better-documentation";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-05-15-latex-css-for-print.md": {
	id: "2016-05-15-latex-css-for-print.md";
  slug: "2016-05-15-latex-css-for-print";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-06-28-chip-shop-case-study.md": {
	id: "2016-06-28-chip-shop-case-study.md";
  slug: "2016-06-28-chip-shop-case-study";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-06-29-cross-platform-apps-with-electron.md": {
	id: "2016-06-29-cross-platform-apps-with-electron.md";
  slug: "2016-06-29-cross-platform-apps-with-electron";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-07-08-android-programming-without-java.md": {
	id: "2016-07-08-android-programming-without-java.md";
  slug: "2016-07-08-android-programming-without-java";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-09-12-the-future-of-cardboard.md": {
	id: "2016-09-12-the-future-of-cardboard.md";
  slug: "2016-09-12-the-future-of-cardboard";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-09-19-beyond-software-learning-from-other-technical-writers.md": {
	id: "2016-09-19-beyond-software-learning-from-other-technical-writers.md";
  slug: "2016-09-19-beyond-software-learning-from-other-technical-writers";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-09-29-your-favourite-new-language-the-future-of-swift.md": {
	id: "2016-09-29-your-favourite-new-language-the-future-of-swift.md";
  slug: "2016-09-29-your-favourite-new-language-the-future-of-swift";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-10-04-a-documentation-crash-course-for-developers.md": {
	id: "2016-10-04-a-documentation-crash-course-for-developers.md";
  slug: "2016-10-04-a-documentation-crash-course-for-developers";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-10-13-spiel-16.md": {
	id: "2016-10-13-spiel-16.md";
  slug: "2016-10-13-spiel-16";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-10-21-software-freedom-kosovo.md": {
	id: "2016-10-21-software-freedom-kosovo.md";
  slug: "2016-10-21-software-freedom-kosovo";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-11-07-web-summit.md": {
	id: "2016-11-07-web-summit.md";
  slug: "2016-11-07-web-summit";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2016-12-05-agile-the-docs.md": {
	id: "2016-12-05-agile-the-docs.md";
  slug: "2016-12-05-agile-the-docs";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-02-05-automating-docs.md": {
	id: "2017-02-05-automating-docs.md";
  slug: "2017-02-05-automating-docs";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-02-05-electron-solving-our-cross-platform-dreams.md": {
	id: "2017-02-05-electron-solving-our-cross-platform-dreams.md";
  slug: "2017-02-05-electron-solving-our-cross-platform-dreams";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-03-12-a-documentation-crash-course-for-developers.md": {
	id: "2017-03-12-a-documentation-crash-course-for-developers.md";
  slug: "2017-03-12-a-documentation-crash-course-for-developers";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-03-21-cebit.md": {
	id: "2017-03-21-cebit.md";
  slug: "2017-03-21-cebit";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-03-30-a-hackers-guide-to-the-atom-editor.md": {
	id: "2017-03-30-a-hackers-guide-to-the-atom-editor.md";
  slug: "2017-03-30-a-hackers-guide-to-the-atom-editor";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-04-25-the-future-of-cardboard.md": {
	id: "2017-04-25-the-future-of-cardboard.md";
  slug: "2017-04-25-the-future-of-cardboard";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-05-06-sex-tech.md": {
	id: "2017-05-06-sex-tech.md";
  slug: "2017-05-06-sex-tech";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-05-11-a-documentation-crash-course-for-developers.md": {
	id: "2017-05-11-a-documentation-crash-course-for-developers.md";
  slug: "2017-05-11-a-documentation-crash-course-for-developers";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-05-18-the-next-web.md": {
	id: "2017-05-18-the-next-web.md";
  slug: "2017-05-18-the-next-web";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-06-01-pioneers-festival2017.md": {
	id: "2017-06-01-pioneers-festival2017.md";
  slug: "2017-06-01-pioneers-festival2017";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-06-22-devoxx-poland.md": {
	id: "2017-06-22-devoxx-poland.md";
  slug: "2017-06-22-devoxx-poland";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-06-27-developer-week-community-night.md": {
	id: "2017-06-27-developer-week-community-night.md";
  slug: "2017-06-27-developer-week-community-night";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-06-28-developer-week-2017.md": {
	id: "2017-06-28-developer-week-2017.md";
  slug: "2017-06-28-developer-week-2017";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-09-01-ifa-berlin.md": {
	id: "2017-09-01-ifa-berlin.md";
  slug: "2017-09-01-ifa-berlin";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-09-05-berlin-podcasters.md": {
	id: "2017-09-05-berlin-podcasters.md";
  slug: "2017-09-05-berlin-podcasters";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-09-08-startup-night.md": {
	id: "2017-09-08-startup-night.md";
  slug: "2017-09-08-startup-night";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-09-10-write-the-docs-eu-2017.md": {
	id: "2017-09-10-write-the-docs-eu-2017.md";
  slug: "2017-09-10-write-the-docs-eu-2017";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-09-19-ixds-ifa-pre-work-talk-berlin.md": {
	id: "2017-09-19-ixds-ifa-pre-work-talk-berlin.md";
  slug: "2017-09-19-ixds-ifa-pre-work-talk-berlin";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-09-21-ixds-ifa-pre-work-talk-munich.md": {
	id: "2017-09-21-ixds-ifa-pre-work-talk-munich.md";
  slug: "2017-09-21-ixds-ifa-pre-work-talk-munich";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-09-29-it-arena.md": {
	id: "2017-09-29-it-arena.md";
  slug: "2017-09-29-it-arena";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-10-19-voxxed-belgrade-2017.md": {
	id: "2017-10-19-voxxed-belgrade-2017.md";
  slug: "2017-10-19-voxxed-belgrade-2017";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-10-21-changecon.md": {
	id: "2017-10-21-changecon.md";
  slug: "2017-10-21-changecon";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-11-24-write-the-docs-australia.md": {
	id: "2017-11-24-write-the-docs-australia.md";
  slug: "2017-11-24-write-the-docs-australia";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-12-04-finovate-dubai.md": {
	id: "2017-12-04-finovate-dubai.md";
  slug: "2017-12-04-finovate-dubai";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2017-12-27-ccc-leipzig.md": {
	id: "2017-12-27-ccc-leipzig.md";
  slug: "2017-12-27-ccc-leipzig";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-01-24-literally-speaking-dead-of-winter.md": {
	id: "2018-01-24-literally-speaking-dead-of-winter.md";
  slug: "2018-01-24-literally-speaking-dead-of-winter";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-01-30-api-days-paris.md": {
	id: "2018-01-30-api-days-paris.md";
  slug: "2018-01-30-api-days-paris";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-02-03-fosdem-2018.md": {
	id: "2018-02-03-fosdem-2018.md";
  slug: "2018-02-03-fosdem-2018";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-02-19-write-the-docs-amsterdam.md": {
	id: "2018-02-19-write-the-docs-amsterdam.md";
  slug: "2018-02-19-write-the-docs-amsterdam";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-02-20-investor-tea-time-pitch.md": {
	id: "2018-02-20-investor-tea-time-pitch.md";
  slug: "2018-02-20-investor-tea-time-pitch";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-02-21-bosch-connected-world.md": {
	id: "2018-02-21-bosch-connected-world.md";
  slug: "2018-02-21-bosch-connected-world";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-02-24-world-ia-day-berlin.md": {
	id: "2018-02-24-world-ia-day-berlin.md";
  slug: "2018-02-24-world-ia-day-berlin";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-02-26-mobile-world-congress-2018.md": {
	id: "2018-02-26-mobile-world-congress-2018.md";
  slug: "2018-02-26-mobile-world-congress-2018";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-03-09-sxsw-interactive.md": {
	id: "2018-03-09-sxsw-interactive.md";
  slug: "2018-03-09-sxsw-interactive";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-05-02-collision-conf.md": {
	id: "2018-05-02-collision-conf.md";
  slug: "2018-05-02-collision-conf";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-05-06-write-the-docs-us-2018.md": {
	id: "2018-05-06-write-the-docs-us-2018.md";
  slug: "2018-05-06-write-the-docs-us-2018";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-05-14-preventing-the-techpocalypse.md": {
	id: "2018-05-14-preventing-the-techpocalypse.md";
  slug: "2018-05-14-preventing-the-techpocalypse";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-05-19-documenting-projects-with-docfx.md": {
	id: "2018-05-19-documenting-projects-with-docfx.md";
  slug: "2018-05-19-documenting-projects-with-docfx";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-05-19-whats-the-difference-between-eventstore-and-blockchain.md": {
	id: "2018-05-19-whats-the-difference-between-eventstore-and-blockchain.md";
  slug: "2018-05-19-whats-the-difference-between-eventstore-and-blockchain";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-05-23-conversational-uis-for-writers.md": {
	id: "2018-05-23-conversational-uis-for-writers.md";
  slug: "2018-05-23-conversational-uis-for-writers";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-05-31-conversational-uis-for-writers.md": {
	id: "2018-05-31-conversational-uis-for-writers.md";
  slug: "2018-05-31-conversational-uis-for-writers";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-06-02-ukge-18.md": {
	id: "2018-06-02-ukge-18.md";
  slug: "2018-06-02-ukge-18";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-06-05-building-a-career-as-a-freelance-writer.md": {
	id: "2018-06-05-building-a-career-as-a-freelance-writer.md";
  slug: "2018-06-05-building-a-career-as-a-freelance-writer";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-06-08-login.md": {
	id: "2018-06-08-login.md";
  slug: "2018-06-08-login";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-06-14-foss-backstage.md": {
	id: "2018-06-14-foss-backstage.md";
  slug: "2018-06-14-foss-backstage";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-06-19-toa-18.md": {
	id: "2018-06-19-toa-18.md";
  slug: "2018-06-19-toa-18";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-06-25-documenting-projects-with-docfx.md": {
	id: "2018-06-25-documenting-projects-with-docfx.md";
  slug: "2018-06-25-documenting-projects-with-docfx";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-07-19-dappcon.md": {
	id: "2018-07-19-dappcon.md";
  slug: "2018-07-19-dappcon";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-07-23-blockchain-visionnaires-summit.md": {
	id: "2018-07-23-blockchain-visionnaires-summit.md";
  slug: "2018-07-23-blockchain-visionnaires-summit";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-07-27-building-a-career-as-a-freelance-writer.md": {
	id: "2018-07-27-building-a-career-as-a-freelance-writer.md";
  slug: "2018-07-27-building-a-career-as-a-freelance-writer";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-08-20-afrolynk.md": {
	id: "2018-08-20-afrolynk.md";
  slug: "2018-08-20-afrolynk";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-08-31-ifa-berlin.md": {
	id: "2018-08-31-ifa-berlin.md";
  slug: "2018-08-31-ifa-berlin";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-09-06-dezentral.md": {
	id: "2018-09-06-dezentral.md";
  slug: "2018-09-06-dezentral";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-09-08-write-the-docs-eu-2018.md": {
	id: "2018-09-08-write-the-docs-eu-2018.md";
  slug: "2018-09-08-write-the-docs-eu-2018";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-09-27-5g-techritory.md": {
	id: "2018-09-27-5g-techritory.md";
  slug: "2018-09-27-5g-techritory";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-09-28-it-arena-2018.md": {
	id: "2018-09-28-it-arena-2018.md";
  slug: "2018-09-28-it-arena-2018";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-10-02-pitching-to-the-press.md": {
	id: "2018-10-02-pitching-to-the-press.md";
  slug: "2018-10-02-pitching-to-the-press";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-10-03-explaining-the-unexplainable.md": {
	id: "2018-10-03-explaining-the-unexplainable.md";
  slug: "2018-10-03-explaining-the-unexplainable";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-10-25-sustain-summit.md": {
	id: "2018-10-25-sustain-summit.md";
  slug: "2018-10-25-sustain-summit";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-11-01-malta-blockchain-summit.md": {
	id: "2018-11-01-malta-blockchain-summit.md";
  slug: "2018-11-01-malta-blockchain-summit";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-11-05-web-summit.md": {
	id: "2018-11-05-web-summit.md";
  slug: "2018-11-05-web-summit";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-11-09-api-the-docs-london.md": {
	id: "2018-11-09-api-the-docs-london.md";
  slug: "2018-11-09-api-the-docs-london";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-11-13-openstack-summit-berlin.md": {
	id: "2018-11-13-openstack-summit-berlin.md";
  slug: "2018-11-13-openstack-summit-berlin";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-11-19-revision-berlin.md": {
	id: "2018-11-19-revision-berlin.md";
  slug: "2018-11-19-revision-berlin";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2018-11-20-codemotion-berlin.md": {
	id: "2018-11-20-codemotion-berlin.md";
  slug: "2018-11-20-codemotion-berlin";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-02-01-dddeurope.md": {
	id: "2019-02-01-dddeurope.md";
  slug: "2019-02-01-dddeurope";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-02-02-fosdem-2019.md": {
	id: "2019-02-02-fosdem-2019.md";
  slug: "2019-02-02-fosdem-2019";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-02-14-ethdenver.md": {
	id: "2019-02-14-ethdenver.md";
  slug: "2019-02-14-ethdenver";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-05-06-beyond-the-block-–-state-of-blockchain-adoption.md": {
	id: "2019-05-06-beyond-the-block-–-state-of-blockchain-adoption.md";
  slug: "2019-05-06-beyond-the-block--state-of-blockchain-adoption";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-05-06-crypto-oracle.md": {
	id: "2019-05-06-crypto-oracle.md";
  slug: "2019-05-06-crypto-oracle";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-05-06-latitude59.md": {
	id: "2019-05-06-latitude59.md";
  slug: "2019-05-06-latitude59";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-05-20-kubecon-eu.md": {
	id: "2019-05-20-kubecon-eu.md";
  slug: "2019-05-20-kubecon-eu";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-05-22-explain-yourself.md": {
	id: "2019-05-22-explain-yourself.md";
  slug: "2019-05-22-explain-yourself";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-06-04-emerge.md": {
	id: "2019-06-04-emerge.md";
  slug: "2019-06-04-emerge";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-06-05-ai-friend-or-foe.md": {
	id: "2019-06-05-ai-friend-or-foe.md";
  slug: "2019-06-05-ai-friend-or-foe";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-06-11-the-data-science-developer-experience.md": {
	id: "2019-06-11-the-data-science-developer-experience.md";
  slug: "2019-06-11-the-data-science-developer-experience";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-06-18-ethics-in-tech-a-practical-discussion-about-ai.md": {
	id: "2019-06-18-ethics-in-tech-a-practical-discussion-about-ai.md";
  slug: "2019-06-18-ethics-in-tech-a-practical-discussion-about-ai";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-08-23-ethberlin.md": {
	id: "2019-08-23-ethberlin.md";
  slug: "2019-08-23-ethberlin";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-09-06-startupnight.md": {
	id: "2019-09-06-startupnight.md";
  slug: "2019-09-06-startupnight";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-09-14-write-the-docs-prague-2019.md": {
	id: "2019-09-14-write-the-docs-prague-2019.md";
  slug: "2019-09-14-write-the-docs-prague-2019";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-09-26-heapcon.md": {
	id: "2019-09-26-heapcon.md";
  slug: "2019-09-26-heapcon";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-10-08-devcon.md": {
	id: "2019-10-08-devcon.md";
  slug: "2019-10-08-devcon";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-10-19-diffusion.md": {
	id: "2019-10-19-diffusion.md";
  slug: "2019-10-19-diffusion";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-10-22-apachecon.md": {
	id: "2019-10-22-apachecon.md";
  slug: "2019-10-22-apachecon";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-11-05-oreilly-velocity-conference.md": {
	id: "2019-11-05-oreilly-velocity-conference.md";
  slug: "2019-11-05-oreilly-velocity-conference";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-11-12-tcworld-conference-2019.md": {
	id: "2019-11-12-tcworld-conference-2019.md";
  slug: "2019-11-12-tcworld-conference-2019";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-11-25-data-natives-2019.md": {
	id: "2019-11-25-data-natives-2019.md";
  slug: "2019-11-25-data-natives-2019";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-11-27-5g-techritory.md": {
	id: "2019-11-27-5g-techritory.md";
  slug: "2019-11-27-5g-techritory";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2019-12-10-devrelcon-2019.md": {
	id: "2019-12-10-devrelcon-2019.md";
  slug: "2019-12-10-devrelcon-2019";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-01-30-sustain-summit.md": {
	id: "2020-01-30-sustain-summit.md";
  slug: "2020-01-30-sustain-summit";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-02-01-fosdem-2020.md": {
	id: "2020-02-01-fosdem-2020.md";
  slug: "2020-02-01-fosdem-2020";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-02-22-world-ia-day-2020.md": {
	id: "2020-02-22-world-ia-day-2020.md";
  slug: "2020-02-22-world-ia-day-2020";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-02-27-megacomm.md": {
	id: "2020-02-27-megacomm.md";
  slug: "2020-02-27-megacomm";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-03-06-foss-backstage.md": {
	id: "2020-03-06-foss-backstage.md";
  slug: "2020-03-06-foss-backstage";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-05-27-jamstack-london.md": {
	id: "2020-05-27-jamstack-london.md";
  slug: "2020-05-27-jamstack-london";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-08-13-kubecon-eu-2020.md": {
	id: "2020-08-13-kubecon-eu-2020.md";
  slug: "2020-08-13-kubecon-eu-2020";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-10-18-write-the-docs-eu-2020.md": {
	id: "2020-10-18-write-the-docs-eu-2020.md";
  slug: "2020-10-18-write-the-docs-eu-2020";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-12-04-write-the-docs-au.md": {
	id: "2020-12-04-write-the-docs-au.md";
  slug: "2020-12-04-write-the-docs-au";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2020-12-09-automate-api-perfection.md": {
	id: "2020-12-09-automate-api-perfection.md";
  slug: "2020-12-09-automate-api-perfection";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2021-02-20-arizona-stc.md": {
	id: "2021-02-20-arizona-stc.md";
  slug: "2021-02-20-arizona-stc";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2021-02-27-fosdem-2020.md": {
	id: "2021-02-27-fosdem-2020.md";
  slug: "2021-02-27-fosdem-2020";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2021-03-09-last-clubhouse.md": {
	id: "2021-03-09-last-clubhouse.md";
  slug: "2021-03-09-last-clubhouse";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2021-10-17-all-things-open.md": {
	id: "2021-10-17-all-things-open.md";
  slug: "2021-10-17-all-things-open";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2022-05-18-kubecon-eu-2022.md": {
	id: "2022-05-18-kubecon-eu-2022.md";
  slug: "2022-05-18-kubecon-eu-2022";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2022-06-01-soapconf.md": {
	id: "2022-06-01-soapconf.md";
  slug: "2022-06-01-soapconf";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2022-06-07-open-infra-summit.md": {
	id: "2022-06-07-open-infra-summit.md";
  slug: "2022-06-07-open-infra-summit";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2022-06-18-oscal.md": {
	id: "2022-06-18-oscal.md";
  slug: "2022-06-18-oscal";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2022-06-27-monitorama.md": {
	id: "2022-06-27-monitorama.md";
  slug: "2022-06-27-monitorama";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
"2022-11-08-tcworld.md": {
	id: "2022-11-08-tcworld.md";
  slug: "2022-11-08-tcworld";
  body: string;
  collection: "events";
  data: InferEntrySchema<"events">
} & { render(): Render[".md"] };
};
"games": {
"bamberg.md": {
	id: "bamberg.md";
  slug: "bamberg";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"chipshop.md": {
	id: "chipshop.md";
  slug: "chipshop";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"europop-vampire.md": {
	id: "europop-vampire.md";
  slug: "europop-vampire";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"expedition.md": {
	id: "expedition.md";
  slug: "expedition";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"fairy-trails.md": {
	id: "fairy-trails.md";
  slug: "fairy-trails";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"forests-of-pangaia.md": {
	id: "forests-of-pangaia.md";
  slug: "forests-of-pangaia";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"frostpunk.md": {
	id: "frostpunk.md";
  slug: "frostpunk";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"humanity-in-flames.md": {
	id: "humanity-in-flames.md";
  slug: "humanity-in-flames";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"odtwe.md": {
	id: "odtwe.md";
  slug: "odtwe";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"silicon-valley-mystery.md": {
	id: "silicon-valley-mystery.md";
  slug: "silicon-valley-mystery";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"solemscriptures.md": {
	id: "solemscriptures.md";
  slug: "solemscriptures";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"uprising.md": {
	id: "uprising.md";
  slug: "uprising";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
"wicked-ones.md": {
	id: "wicked-ones.md";
  slug: "wicked-ones";
  body: string;
  collection: "games";
  data: InferEntrySchema<"games">
} & { render(): Render[".md"] };
};
"posts": {
"2002/2002-10-04-apple-expo-2002-paris.md": {
	id: "2002/2002-10-04-apple-expo-2002-paris.md";
  slug: "2002/2002-10-04-apple-expo-2002-paris";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2002/2002-11-15-mac-expo-2002-london.md": {
	id: "2002/2002-11-15-mac-expo-2002-london.md";
  slug: "2002/2002-11-15-mac-expo-2002-london";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2003/2003-01-04-thinkfree-office-review.md": {
	id: "2003/2003-01-04-thinkfree-office-review.md";
  slug: "2003/2003-01-04-thinkfree-office-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2003/2003-01-04-workswell-review.md": {
	id: "2003/2003-01-04-workswell-review.md";
  slug: "2003/2003-01-04-workswell-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2003/2003-03-17-pinski-zoo-the-lawn-lincoln.md": {
	id: "2003/2003-03-17-pinski-zoo-the-lawn-lincoln.md";
  slug: "2003/2003-03-17-pinski-zoo-the-lawn-lincoln";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2003/2003-09-05-world-record-dj-attempt-and-rwanda-fund-appeal-null.md": {
	id: "2003/2003-09-05-world-record-dj-attempt-and-rwanda-fund-appeal-null.md";
  slug: "2003/2003-09-05-world-record-dj-attempt-and-rwanda-fund-appeal-null";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2003/2003-10-04-louis-elliot.md": {
	id: "2003/2003-10-04-louis-elliot.md";
  slug: "2003/2003-10-04-louis-elliot";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2005/2005-01-14-the-specials.md": {
	id: "2005/2005-01-14-the-specials.md";
  slug: "2005/2005-01-14-the-specials";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2005/2005-09-19-art-brut-battle-of-the-franchises-kilburn-luminaire.md": {
	id: "2005/2005-09-19-art-brut-battle-of-the-franchises-kilburn-luminaire.md";
  slug: "2005/2005-09-19-art-brut-battle-of-the-franchises-kilburn-luminaire";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2005/2005-09-19-simon-breed-camden-underworld.md": {
	id: "2005/2005-09-19-simon-breed-camden-underworld.md";
  slug: "2005/2005-09-19-simon-breed-camden-underworld";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2005/2005-10-11-bearsuit-highbury-buffalo-bar.md": {
	id: "2005/2005-10-11-bearsuit-highbury-buffalo-bar.md";
  slug: "2005/2005-10-11-bearsuit-highbury-buffalo-bar";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2005/2005-10-19-aberfeldy-islington-bar-academy.md": {
	id: "2005/2005-10-19-aberfeldy-islington-bar-academy.md";
  slug: "2005/2005-10-19-aberfeldy-islington-bar-academy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-01-29-the-fades-the-rhythm-factory.md": {
	id: "2006/2006-01-29-the-fades-the-rhythm-factory.md";
  slug: "2006/2006-01-29-the-fades-the-rhythm-factory";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-02-07-yo-zushi-the-spitz-london.md": {
	id: "2006/2006-02-07-yo-zushi-the-spitz-london.md";
  slug: "2006/2006-02-07-yo-zushi-the-spitz-london";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-02-10-milk-kan-12-bar-club.md": {
	id: "2006/2006-02-10-milk-kan-12-bar-club.md";
  slug: "2006/2006-02-10-milk-kan-12-bar-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-02-11-28-costumes-dublin-castle.md": {
	id: "2006/2006-02-11-28-costumes-dublin-castle.md";
  slug: "2006/2006-02-11-28-costumes-dublin-castle";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-03-07-these-new-puritans-brixton-windmill.md": {
	id: "2006/2006-03-07-these-new-puritans-brixton-windmill.md";
  slug: "2006/2006-03-07-these-new-puritans-brixton-windmill";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-03-15-ladyfuzz-kerfuffle.md": {
	id: "2006/2006-03-15-ladyfuzz-kerfuffle.md";
  slug: "2006/2006-03-15-ladyfuzz-kerfuffle";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-03-16-ludes-barfly-london.md": {
	id: "2006/2006-03-16-ludes-barfly-london.md";
  slug: "2006/2006-03-16-ludes-barfly-london";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-03-22-jeff-klein-the-hustler.md": {
	id: "2006/2006-03-22-jeff-klein-the-hustler.md";
  slug: "2006/2006-03-22-jeff-klein-the-hustler";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-03-24-the-television-personalities-the-barfly.md": {
	id: "2006/2006-03-24-the-television-personalities-the-barfly.md";
  slug: "2006/2006-03-24-the-television-personalities-the-barfly";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-04-18-and-what-will-be-left-of-them-the-dance-damn-you-dance-ep.md": {
	id: "2006/2006-04-18-and-what-will-be-left-of-them-the-dance-damn-you-dance-ep.md";
  slug: "2006/2006-04-18-and-what-will-be-left-of-them-the-dance-damn-you-dance-ep";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-04-18-betty-curse-god-this-hurts.md": {
	id: "2006/2006-04-18-betty-curse-god-this-hurts.md";
  slug: "2006/2006-04-18-betty-curse-god-this-hurts";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-04-18-sandy-dillon-pull-the-strings.md": {
	id: "2006/2006-04-18-sandy-dillon-pull-the-strings.md";
  slug: "2006/2006-04-18-sandy-dillon-pull-the-strings";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-04-18-the-bishops-the-only-place-i-can-look-is-down.md": {
	id: "2006/2006-04-18-the-bishops-the-only-place-i-can-look-is-down.md";
  slug: "2006/2006-04-18-the-bishops-the-only-place-i-can-look-is-down";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-04-18-the-boyfriends-adult-acne.md": {
	id: "2006/2006-04-18-the-boyfriends-adult-acne.md";
  slug: "2006/2006-04-18-the-boyfriends-adult-acne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-04-18-the-lodger-let-her-go.md": {
	id: "2006/2006-04-18-the-lodger-let-her-go.md";
  slug: "2006/2006-04-18-the-lodger-let-her-go";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-04-19-mc-lars-horris-93ft-east.md": {
	id: "2006/2006-04-19-mc-lars-horris-93ft-east.md";
  slug: "2006/2006-04-19-mc-lars-horris-93ft-east";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-07-broken-family-band-balls.md": {
	id: "2006/2006-05-07-broken-family-band-balls.md";
  slug: "2006/2006-05-07-broken-family-band-balls";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-07-jim-noir-my-patch.md": {
	id: "2006/2006-05-07-jim-noir-my-patch.md";
  slug: "2006/2006-05-07-jim-noir-my-patch";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-07-sol-seppy-93ft-east.md": {
	id: "2006/2006-05-07-sol-seppy-93ft-east.md";
  slug: "2006/2006-05-07-sol-seppy-93ft-east";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-07-the-playwrights-english-self-storage.md": {
	id: "2006/2006-05-07-the-playwrights-english-self-storage.md";
  slug: "2006/2006-05-07-the-playwrights-english-self-storage";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-12-scully-whos-a-terrorist-now.md": {
	id: "2006/2006-05-12-scully-whos-a-terrorist-now.md";
  slug: "2006/2006-05-12-scully-whos-a-terrorist-now";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-16-v-formation-little-heart.md": {
	id: "2006/2006-05-16-v-formation-little-heart.md";
  slug: "2006/2006-05-16-v-formation-little-heart";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-20-the-scare-vacuum-irony.md": {
	id: "2006/2006-05-20-the-scare-vacuum-irony.md";
  slug: "2006/2006-05-20-the-scare-vacuum-irony";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-23-marissa-nadler-diamond-heart.md": {
	id: "2006/2006-05-23-marissa-nadler-diamond-heart.md";
  slug: "2006/2006-05-23-marissa-nadler-diamond-heart";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-23-winterkids-tape-it.md": {
	id: "2006/2006-05-23-winterkids-tape-it.md";
  slug: "2006/2006-05-23-winterkids-tape-it";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-24-findlay-brown-the-social-london.md": {
	id: "2006/2006-05-24-findlay-brown-the-social-london.md";
  slug: "2006/2006-05-24-findlay-brown-the-social-london";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-24-pink-grease-ordinary-girl.md": {
	id: "2006/2006-05-24-pink-grease-ordinary-girl.md";
  slug: "2006/2006-05-24-pink-grease-ordinary-girl";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-31-jim-noir-kings-college.md": {
	id: "2006/2006-05-31-jim-noir-kings-college.md";
  slug: "2006/2006-05-31-jim-noir-kings-college";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-31-scully-hoxton-bar-and-restaurant.md": {
	id: "2006/2006-05-31-scully-hoxton-bar-and-restaurant.md";
  slug: "2006/2006-05-31-scully-hoxton-bar-and-restaurant";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-05-31-you-and-the-atom-bomb-demo.md": {
	id: "2006/2006-05-31-you-and-the-atom-bomb-demo.md";
  slug: "2006/2006-05-31-you-and-the-atom-bomb-demo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-07-camera-demo.md": {
	id: "2006/2006-06-07-camera-demo.md";
  slug: "2006/2006-06-07-camera-demo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-07-televise-songs-to-sing-in-a-and-e.md": {
	id: "2006/2006-06-07-televise-songs-to-sing-in-a-and-e.md";
  slug: "2006/2006-06-07-televise-songs-to-sing-in-a-and-e";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-08-at-the-lake-promo.md": {
	id: "2006/2006-06-08-at-the-lake-promo.md";
  slug: "2006/2006-06-08-at-the-lake-promo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-08-the-voices-the-voices.md": {
	id: "2006/2006-06-08-the-voices-the-voices.md";
  slug: "2006/2006-06-08-the-voices-the-voices";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-10-larrikin-love-kings-college.md": {
	id: "2006/2006-06-10-larrikin-love-kings-college.md";
  slug: "2006/2006-06-10-larrikin-love-kings-college";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-10-the-scare-the-buffalo-bar.md": {
	id: "2006/2006-06-10-the-scare-the-buffalo-bar.md";
  slug: "2006/2006-06-10-the-scare-the-buffalo-bar";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-13-findlay-brown-down-amongst-the-dead-men.md": {
	id: "2006/2006-06-13-findlay-brown-down-amongst-the-dead-men.md";
  slug: "2006/2006-06-13-findlay-brown-down-amongst-the-dead-men";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-13-jim-noir-eany-meany.md": {
	id: "2006/2006-06-13-jim-noir-eany-meany.md";
  slug: "2006/2006-06-13-jim-noir-eany-meany";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-13-roland-shanks-tarantula.md": {
	id: "2006/2006-06-13-roland-shanks-tarantula.md";
  slug: "2006/2006-06-13-roland-shanks-tarantula";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-14-snowfight-in-the-city-centre-demo.md": {
	id: "2006/2006-06-14-snowfight-in-the-city-centre-demo.md";
  slug: "2006/2006-06-14-snowfight-in-the-city-centre-demo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-20-jeremy-warmsley-i-promise.md": {
	id: "2006/2006-06-20-jeremy-warmsley-i-promise.md";
  slug: "2006/2006-06-20-jeremy-warmsley-i-promise";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-06-29-the-immediate-scala.md": {
	id: "2006/2006-06-29-the-immediate-scala.md";
  slug: "2006/2006-06-29-the-immediate-scala";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-07-07-the-noisettes.md": {
	id: "2006/2006-07-07-the-noisettes.md";
  slug: "2006/2006-07-07-the-noisettes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-07-12-the-needles-in-search-of-the-needles.md": {
	id: "2006/2006-07-12-the-needles-in-search-of-the-needles.md";
  slug: "2006/2006-07-12-the-needles-in-search-of-the-needles";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-07-29-winterkids-im-not-used-to-you.md": {
	id: "2006/2006-07-29-winterkids-im-not-used-to-you.md";
  slug: "2006/2006-07-29-winterkids-im-not-used-to-you";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-08-16-and-what-will-be-left-of-them-wet-weekend-on-july.md": {
	id: "2006/2006-08-16-and-what-will-be-left-of-them-wet-weekend-on-july.md";
  slug: "2006/2006-08-16-and-what-will-be-left-of-them-wet-weekend-on-july";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-08-16-billy-ruffian-demo.md": {
	id: "2006/2006-08-16-billy-ruffian-demo.md";
  slug: "2006/2006-08-16-billy-ruffian-demo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-08-16-bonnie-prince-billy-the-letting-go.md": {
	id: "2006/2006-08-16-bonnie-prince-billy-the-letting-go.md";
  slug: "2006/2006-08-16-bonnie-prince-billy-the-letting-go";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-08-16-doloroso-godless.md": {
	id: "2006/2006-08-16-doloroso-godless.md";
  slug: "2006/2006-08-16-doloroso-godless";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-08-16-james-yorkston-the-year-of-the-leopard.md": {
	id: "2006/2006-08-16-james-yorkston-the-year-of-the-leopard.md";
  slug: "2006/2006-08-16-james-yorkston-the-year-of-the-leopard";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-08-16-the-beauty-room-holding-on.md": {
	id: "2006/2006-08-16-the-beauty-room-holding-on.md";
  slug: "2006/2006-08-16-the-beauty-room-holding-on";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-08-16-vwf-wont-do-you-any-harm.md": {
	id: "2006/2006-08-16-vwf-wont-do-you-any-harm.md";
  slug: "2006/2006-08-16-vwf-wont-do-you-any-harm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-19-betty-curse-hear-lies.md": {
	id: "2006/2006-09-19-betty-curse-hear-lies.md";
  slug: "2006/2006-09-19-betty-curse-hear-lies";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-19-camera-ashes-and-dim-light.md": {
	id: "2006/2006-09-19-camera-ashes-and-dim-light.md";
  slug: "2006/2006-09-19-camera-ashes-and-dim-light";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-19-dan-sartain-join-dan-sartain.md": {
	id: "2006/2006-09-19-dan-sartain-join-dan-sartain.md";
  slug: "2006/2006-09-19-dan-sartain-join-dan-sartain";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-19-jay-bennett-the-magnificent-defeat.md": {
	id: "2006/2006-09-19-jay-bennett-the-magnificent-defeat.md";
  slug: "2006/2006-09-19-jay-bennett-the-magnificent-defeat";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-19-kate-myers-the-blanket-sky.md": {
	id: "2006/2006-09-19-kate-myers-the-blanket-sky.md";
  slug: "2006/2006-09-19-kate-myers-the-blanket-sky";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-19-the-album-leaf-into-the-blue-again.md": {
	id: "2006/2006-09-19-the-album-leaf-into-the-blue-again.md";
  slug: "2006/2006-09-19-the-album-leaf-into-the-blue-again";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-19-various-artists-house-of-the-rising-rat-vol-1.md": {
	id: "2006/2006-09-19-various-artists-house-of-the-rising-rat-vol-1.md";
  slug: "2006/2006-09-19-various-artists-house-of-the-rising-rat-vol-1";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-26-bright-eyes-noise-floor.md": {
	id: "2006/2006-09-26-bright-eyes-noise-floor.md";
  slug: "2006/2006-09-26-bright-eyes-noise-floor";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-26-brinkman-kirsten-dunst.md": {
	id: "2006/2006-09-26-brinkman-kirsten-dunst.md";
  slug: "2006/2006-09-26-brinkman-kirsten-dunst";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-26-iv-thieves-the-day-is-a-downer.md": {
	id: "2006/2006-09-26-iv-thieves-the-day-is-a-downer.md";
  slug: "2006/2006-09-26-iv-thieves-the-day-is-a-downer";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-26-mattafix-cool-down-the-place.md": {
	id: "2006/2006-09-26-mattafix-cool-down-the-place.md";
  slug: "2006/2006-09-26-mattafix-cool-down-the-place";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-26-new-rhodes-history-of-britain.md": {
	id: "2006/2006-09-26-new-rhodes-history-of-britain.md";
  slug: "2006/2006-09-26-new-rhodes-history-of-britain";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-26-the-answer-under-the-sky.md": {
	id: "2006/2006-09-26-the-answer-under-the-sky.md";
  slug: "2006/2006-09-26-the-answer-under-the-sky";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-09-26-zebrahead-postcards-from-hell.md": {
	id: "2006/2006-09-26-zebrahead-postcards-from-hell.md";
  slug: "2006/2006-09-26-zebrahead-postcards-from-hell";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-10-03-blah-blah-blah-93ft-east.md": {
	id: "2006/2006-10-03-blah-blah-blah-93ft-east.md";
  slug: "2006/2006-10-03-blah-blah-blah-93ft-east";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-10-11-bass-clef-a-smile-is-a-curve-that-straightens-most-things.md": {
	id: "2006/2006-10-11-bass-clef-a-smile-is-a-curve-that-straightens-most-things.md";
  slug: "2006/2006-10-11-bass-clef-a-smile-is-a-curve-that-straightens-most-things";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-10-11-holy-hail-county-fair.md": {
	id: "2006/2006-10-11-holy-hail-county-fair.md";
  slug: "2006/2006-10-11-holy-hail-county-fair";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-10-11-iain-archer-magnetic-north.md": {
	id: "2006/2006-10-11-iain-archer-magnetic-north.md";
  slug: "2006/2006-10-11-iain-archer-magnetic-north";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-10-11-rose-kemp-violence.md": {
	id: "2006/2006-10-11-rose-kemp-violence.md";
  slug: "2006/2006-10-11-rose-kemp-violence";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-10-11-the-hidden-cameras-awoo.md": {
	id: "2006/2006-10-11-the-hidden-cameras-awoo.md";
  slug: "2006/2006-10-11-the-hidden-cameras-awoo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-10-11-the-pipettes-judy.md": {
	id: "2006/2006-10-11-the-pipettes-judy.md";
  slug: "2006/2006-10-11-the-pipettes-judy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-10-19-the-hot-puppies-drill-hall-lincoln.md": {
	id: "2006/2006-10-19-the-hot-puppies-drill-hall-lincoln.md";
  slug: "2006/2006-10-19-the-hot-puppies-drill-hall-lincoln";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-11-13-14th-nov-2006-leaving-the-uk.md": {
	id: "2006/2006-11-13-14th-nov-2006-leaving-the-uk.md";
  slug: "2006/2006-11-13-14th-nov-2006-leaving-the-uk";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-11-13-14th-nov-2006.md": {
	id: "2006/2006-11-13-14th-nov-2006.md";
  slug: "2006/2006-11-13-14th-nov-2006";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-11-14-chapter-24-notting-hill-arts-club.md": {
	id: "2006/2006-11-14-chapter-24-notting-hill-arts-club.md";
  slug: "2006/2006-11-14-chapter-24-notting-hill-arts-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-11-14-delta-mainline-dublin-castle.md": {
	id: "2006/2006-11-14-delta-mainline-dublin-castle.md";
  slug: "2006/2006-11-14-delta-mainline-dublin-castle";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-11-14-murder-by-death-water-rats.md": {
	id: "2006/2006-11-14-murder-by-death-water-rats.md";
  slug: "2006/2006-11-14-murder-by-death-water-rats";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-11-14-nosferatu-d2-album-demos.md": {
	id: "2006/2006-11-14-nosferatu-d2-album-demos.md";
  slug: "2006/2006-11-14-nosferatu-d2-album-demos";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-12-08-9th-dec-2006-my-old-shoes.md": {
	id: "2006/2006-12-08-9th-dec-2006-my-old-shoes.md";
  slug: "2006/2006-12-08-9th-dec-2006-my-old-shoes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-12-08-9th-dec-2006.md": {
	id: "2006/2006-12-08-9th-dec-2006.md";
  slug: "2006/2006-12-08-9th-dec-2006";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-12-14-15th-december-2006.md": {
	id: "2006/2006-12-14-15th-december-2006.md";
  slug: "2006/2006-12-14-15th-december-2006";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-12-14-16th-dec-2006.md": {
	id: "2006/2006-12-14-16th-dec-2006.md";
  slug: "2006/2006-12-14-16th-dec-2006";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2006/2006-12-17-ilike-and-leaving-the-uk.md": {
	id: "2006/2006-12-17-ilike-and-leaving-the-uk.md";
  slug: "2006/2006-12-17-ilike-and-leaving-the-uk";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-05-festive-2007.md": {
	id: "2007/2007-01-05-festive-2007.md";
  slug: "2007/2007-01-05-festive-2007";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-10-music-review-catch-up.md": {
	id: "2007/2007-01-10-music-review-catch-up.md";
  slug: "2007/2007-01-10-music-review-catch-up";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-12-mira-calix-eyes-set-against-the-sky.md": {
	id: "2007/2007-01-12-mira-calix-eyes-set-against-the-sky.md";
  slug: "2007/2007-01-12-mira-calix-eyes-set-against-the-sky";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-13-clayton-blizzard-the-notting-hill-arts-club.md": {
	id: "2007/2007-01-13-clayton-blizzard-the-notting-hill-arts-club.md";
  slug: "2007/2007-01-13-clayton-blizzard-the-notting-hill-arts-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-16-the-dykeenies-waiting-for-go-ep.md": {
	id: "2007/2007-01-16-the-dykeenies-waiting-for-go-ep.md";
  slug: "2007/2007-01-16-the-dykeenies-waiting-for-go-ep";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-16-the-maccabees-ulu.md": {
	id: "2007/2007-01-16-the-maccabees-ulu.md";
  slug: "2007/2007-01-16-the-maccabees-ulu";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-18-dartz-once-twice-again.md": {
	id: "2007/2007-01-18-dartz-once-twice-again.md";
  slug: "2007/2007-01-18-dartz-once-twice-again";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-18-dive-dive-revenge-of-the-mechanical-dogs.md": {
	id: "2007/2007-01-18-dive-dive-revenge-of-the-mechanical-dogs.md";
  slug: "2007/2007-01-18-dive-dive-revenge-of-the-mechanical-dogs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-18-duke-garwood-emerald-palace.md": {
	id: "2007/2007-01-18-duke-garwood-emerald-palace.md";
  slug: "2007/2007-01-18-duke-garwood-emerald-palace";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-18-ellis-island-sound-the-good-seed.md": {
	id: "2007/2007-01-18-ellis-island-sound-the-good-seed.md";
  slug: "2007/2007-01-18-ellis-island-sound-the-good-seed";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-20-holy-war-religion-and-violence.md": {
	id: "2007/2007-01-20-holy-war-religion-and-violence.md";
  slug: "2007/2007-01-20-holy-war-religion-and-violence";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-23-orphan-boy-trophies-of-love.md": {
	id: "2007/2007-01-23-orphan-boy-trophies-of-love.md";
  slug: "2007/2007-01-23-orphan-boy-trophies-of-love";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-23-rose-kemp-a-handfull-of-hurricanes.md": {
	id: "2007/2007-01-23-rose-kemp-a-handfull-of-hurricanes.md";
  slug: "2007/2007-01-23-rose-kemp-a-handfull-of-hurricanes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-01-24-pop-levi-water-rats.md": {
	id: "2007/2007-01-24-pop-levi-water-rats.md";
  slug: "2007/2007-01-24-pop-levi-water-rats";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-24-the-twilight-singers-a-stitch-in-time-ep.md": {
	id: "2007/2007-02-24-the-twilight-singers-a-stitch-in-time-ep.md";
  slug: "2007/2007-02-24-the-twilight-singers-a-stitch-in-time-ep";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-24-the-vice-lovers-ep.md": {
	id: "2007/2007-02-24-the-vice-lovers-ep.md";
  slug: "2007/2007-02-24-the-vice-lovers-ep";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-26-arcturian-demo.md": {
	id: "2007/2007-02-26-arcturian-demo.md";
  slug: "2007/2007-02-26-arcturian-demo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-26-big-strides-always-together.md": {
	id: "2007/2007-02-26-big-strides-always-together.md";
  slug: "2007/2007-02-26-big-strides-always-together";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-26-iv-thieves-if-we-cant-escape-my-pretty.md": {
	id: "2007/2007-02-26-iv-thieves-if-we-cant-escape-my-pretty.md";
  slug: "2007/2007-02-26-iv-thieves-if-we-cant-escape-my-pretty";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-26-low-vs-diamond-the-water-rats-london.md": {
	id: "2007/2007-02-26-low-vs-diamond-the-water-rats-london.md";
  slug: "2007/2007-02-26-low-vs-diamond-the-water-rats-london";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-26-pocus-whiteface-demo.md": {
	id: "2007/2007-02-26-pocus-whiteface-demo.md";
  slug: "2007/2007-02-26-pocus-whiteface-demo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-26-spray-dog-karate-summer-camp.md": {
	id: "2007/2007-02-26-spray-dog-karate-summer-camp.md";
  slug: "2007/2007-02-26-spray-dog-karate-summer-camp";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-02-26-various-artists-fopp-award-for-new-music-2006.md": {
	id: "2007/2007-02-26-various-artists-fopp-award-for-new-music-2006.md";
  slug: "2007/2007-02-26-various-artists-fopp-award-for-new-music-2006";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-03-09-report-from-melbourne.md": {
	id: "2007/2007-03-09-report-from-melbourne.md";
  slug: "2007/2007-03-09-report-from-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-03-14-the-melbourne-athiest-society.md": {
	id: "2007/2007-03-14-the-melbourne-athiest-society.md";
  slug: "2007/2007-03-14-the-melbourne-athiest-society";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-04-14-glen-tilbrook-in-melbourne.md": {
	id: "2007/2007-04-14-glen-tilbrook-in-melbourne.md";
  slug: "2007/2007-04-14-glen-tilbrook-in-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-04-14-the-answer-the-evelyn-hotel-melbourne.md": {
	id: "2007/2007-04-14-the-answer-the-evelyn-hotel-melbourne.md";
  slug: "2007/2007-04-14-the-answer-the-evelyn-hotel-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-04-14-the-regular-johns-mint-chicks-the-bronx-hifi-club-melbourne.md": {
	id: "2007/2007-04-14-the-regular-johns-mint-chicks-the-bronx-hifi-club-melbourne.md";
  slug: "2007/2007-04-14-the-regular-johns-mint-chicks-the-bronx-hifi-club-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-04-28-an-australian-band-and-warehouse-parties.md": {
	id: "2007/2007-04-28-an-australian-band-and-warehouse-parties.md";
  slug: "2007/2007-04-28-an-australian-band-and-warehouse-parties";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-02-my-first-bike-accident.md": {
	id: "2007/2007-05-02-my-first-bike-accident.md";
  slug: "2007/2007-05-02-my-first-bike-accident";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-11-music-diversity-from-down-under.md": {
	id: "2007/2007-05-11-music-diversity-from-down-under.md";
  slug: "2007/2007-05-11-music-diversity-from-down-under";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-12-im-playing-an-extra.md": {
	id: "2007/2007-05-12-im-playing-an-extra.md";
  slug: "2007/2007-05-12-im-playing-an-extra";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-16-gangster-parties-eurovision-and-fanzines.md": {
	id: "2007/2007-05-16-gangster-parties-eurovision-and-fanzines.md";
  slug: "2007/2007-05-16-gangster-parties-eurovision-and-fanzines";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-18-children-collide-ding-dong-lounge.md": {
	id: "2007/2007-05-18-children-collide-ding-dong-lounge.md";
  slug: "2007/2007-05-18-children-collide-ding-dong-lounge";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-18-ninetynine-the-northcote-social-club.md": {
	id: "2007/2007-05-18-ninetynine-the-northcote-social-club.md";
  slug: "2007/2007-05-18-ninetynine-the-northcote-social-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-18-shooting-at-unarmed-men-baseball-exile.md": {
	id: "2007/2007-05-18-shooting-at-unarmed-men-baseball-exile.md";
  slug: "2007/2007-05-18-shooting-at-unarmed-men-baseball-exile";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-18-teenager-damn-arms-bootleg.md": {
	id: "2007/2007-05-18-teenager-damn-arms-bootleg.md";
  slug: "2007/2007-05-18-teenager-damn-arms-bootleg";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-18-the-kill-devil-hills-the-spanish-club.md": {
	id: "2007/2007-05-18-the-kill-devil-hills-the-spanish-club.md";
  slug: "2007/2007-05-18-the-kill-devil-hills-the-spanish-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-18-wa-music-showcase-the-spanish-club.md": {
	id: "2007/2007-05-18-wa-music-showcase-the-spanish-club.md";
  slug: "2007/2007-05-18-wa-music-showcase-the-spanish-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-22-white-party-and-the-burning-of-the-cutty-sark.md": {
	id: "2007/2007-05-22-white-party-and-the-burning-of-the-cutty-sark.md";
  slug: "2007/2007-05-22-white-party-and-the-burning-of-the-cutty-sark";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-05-31-my-first-afl-game.md": {
	id: "2007/2007-05-31-my-first-afl-game.md";
  slug: "2007/2007-05-31-my-first-afl-game";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-06-08-world-environment-day-and-debut-gigs.md": {
	id: "2007/2007-06-08-world-environment-day-and-debut-gigs.md";
  slug: "2007/2007-06-08-world-environment-day-and-debut-gigs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-06-12-politics-in-music-classical.md": {
	id: "2007/2007-06-12-politics-in-music-classical.md";
  slug: "2007/2007-06-12-politics-in-music-classical";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-06-16-bit-by-bats-roxannes-parlour.md": {
	id: "2007/2007-06-16-bit-by-bats-roxannes-parlour.md";
  slug: "2007/2007-06-16-bit-by-bats-roxannes-parlour";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-06-16-little-red-the-tote.md": {
	id: "2007/2007-06-16-little-red-the-tote.md";
  slug: "2007/2007-06-16-little-red-the-tote";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-06-16-operator-please-east-brunswick-club.md": {
	id: "2007/2007-06-16-operator-please-east-brunswick-club.md";
  slug: "2007/2007-06-16-operator-please-east-brunswick-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-06-16-peabody-and-intercooler-the-east-brunswick-club.md": {
	id: "2007/2007-06-16-peabody-and-intercooler-the-east-brunswick-club.md";
  slug: "2007/2007-06-16-peabody-and-intercooler-the-east-brunswick-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-06-27-interviewing-the-melbourne-zine-scene.md": {
	id: "2007/2007-06-27-interviewing-the-melbourne-zine-scene.md";
  slug: "2007/2007-06-27-interviewing-the-melbourne-zine-scene";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-07-06-closing-party-the-spanish-club-melbourne.md": {
	id: "2007/2007-07-06-closing-party-the-spanish-club-melbourne.md";
  slug: "2007/2007-07-06-closing-party-the-spanish-club-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-07-07-art-brut-its-a-bit-complicated.md": {
	id: "2007/2007-07-07-art-brut-its-a-bit-complicated.md";
  slug: "2007/2007-07-07-art-brut-its-a-bit-complicated";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-07-07-early-gray-wesley-anne.md": {
	id: "2007/2007-07-07-early-gray-wesley-anne.md";
  slug: "2007/2007-07-07-early-gray-wesley-anne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-07-07-hellyeah-mammal-billboard.md": {
	id: "2007/2007-07-07-hellyeah-mammal-billboard.md";
  slug: "2007/2007-07-07-hellyeah-mammal-billboard";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-07-07-maximo-park-our-earthly-pleasures.md": {
	id: "2007/2007-07-07-maximo-park-our-earthly-pleasures.md";
  slug: "2007/2007-07-07-maximo-park-our-earthly-pleasures";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-07-11-my-first-melbourne-community-cup.md": {
	id: "2007/2007-07-11-my-first-melbourne-community-cup.md";
  slug: "2007/2007-07-11-my-first-melbourne-community-cup";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-07-24-antescene-on-3cr.md": {
	id: "2007/2007-07-24-antescene-on-3cr.md";
  slug: "2007/2007-07-24-antescene-on-3cr";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-08-online-video-and-the-kaiser-chiefs.md": {
	id: "2007/2007-08-08-online-video-and-the-kaiser-chiefs.md";
  slug: "2007/2007-08-08-online-video-and-the-kaiser-chiefs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-14-eddie-current-suppression-ring-roxannes-parlour.md": {
	id: "2007/2007-08-14-eddie-current-suppression-ring-roxannes-parlour.md";
  slug: "2007/2007-08-14-eddie-current-suppression-ring-roxannes-parlour";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-14-gym-class-heroes-billboard.md": {
	id: "2007/2007-08-14-gym-class-heroes-billboard.md";
  slug: "2007/2007-08-14-gym-class-heroes-billboard";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-14-institut-polaire-city-walls-and-empires.md": {
	id: "2007/2007-08-14-institut-polaire-city-walls-and-empires.md";
  slug: "2007/2007-08-14-institut-polaire-city-walls-and-empires";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-14-jeff-strong-jeff-strong.md": {
	id: "2007/2007-08-14-jeff-strong-jeff-strong.md";
  slug: "2007/2007-08-14-jeff-strong-jeff-strong";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-14-ninetynine-worlds-of-space-worlds-of-population-worlds-of-robots.md": {
	id: "2007/2007-08-14-ninetynine-worlds-of-space-worlds-of-population-worlds-of-robots.md";
  slug: "2007/2007-08-14-ninetynine-worlds-of-space-worlds-of-population-worlds-of-robots";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-14-tilly-and-the-wall-toff-on-the-town.md": {
	id: "2007/2007-08-14-tilly-and-the-wall-toff-on-the-town.md";
  slug: "2007/2007-08-14-tilly-and-the-wall-toff-on-the-town";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-14-voxtrot-voxtrot.md": {
	id: "2007/2007-08-14-voxtrot-voxtrot.md";
  slug: "2007/2007-08-14-voxtrot-voxtrot";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-15-updates-from-melbourne.md": {
	id: "2007/2007-08-15-updates-from-melbourne.md";
  slug: "2007/2007-08-15-updates-from-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-08-22-politics-in-music-folk.md": {
	id: "2007/2007-08-22-politics-in-music-folk.md";
  slug: "2007/2007-08-22-politics-in-music-folk";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-01-new-work-new-amp.md": {
	id: "2007/2007-09-01-new-work-new-amp.md";
  slug: "2007/2007-09-01-new-work-new-amp";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-12.md": {
	id: "2007/2007-09-12.md";
  slug: "2007/2007-09-12";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-17-a-death-in-the-family-cockfight-shootout-young-and-restless-magic-dirt-collingwood-town-hall.md": {
	id: "2007/2007-09-17-a-death-in-the-family-cockfight-shootout-young-and-restless-magic-dirt-collingwood-town-hall.md";
  slug: "2007/2007-09-17-a-death-in-the-family-cockfight-shootout-young-and-restless-magic-dirt-collingwood-town-hall";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-17-bachelor-of-arts-interview.md": {
	id: "2007/2007-09-17-bachelor-of-arts-interview.md";
  slug: "2007/2007-09-17-bachelor-of-arts-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-17-batrider-manchester-lane-melbourne.md": {
	id: "2007/2007-09-17-batrider-manchester-lane-melbourne.md";
  slug: "2007/2007-09-17-batrider-manchester-lane-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-17-bitch-slap-pony-melbourne.md": {
	id: "2007/2007-09-17-bitch-slap-pony-melbourne.md";
  slug: "2007/2007-09-17-bitch-slap-pony-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-17-kaiser-chiefs-and-maximo-park-various.md": {
	id: "2007/2007-09-17-kaiser-chiefs-and-maximo-park-various.md";
  slug: "2007/2007-09-17-kaiser-chiefs-and-maximo-park-various";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-17-schvendes-ding-dong-melbourne.md": {
	id: "2007/2007-09-17-schvendes-ding-dong-melbourne.md";
  slug: "2007/2007-09-17-schvendes-ding-dong-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-17-the-stabs-ninetynine-love-of-diagrams-my-disco-trades-hall.md": {
	id: "2007/2007-09-17-the-stabs-ninetynine-love-of-diagrams-my-disco-trades-hall.md";
  slug: "2007/2007-09-17-the-stabs-ninetynine-love-of-diagrams-my-disco-trades-hall";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-09-24-i-heart-hiroshima-interview.md": {
	id: "2007/2007-09-24-i-heart-hiroshima-interview.md";
  slug: "2007/2007-09-24-i-heart-hiroshima-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-02-elevn-plus-one-makes-a-great-team.md": {
	id: "2007/2007-10-02-elevn-plus-one-makes-a-great-team.md";
  slug: "2007/2007-10-02-elevn-plus-one-makes-a-great-team";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-04-747s-interview.md": {
	id: "2007/2007-10-04-747s-interview.md";
  slug: "2007/2007-10-04-747s-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-04-ben-birchall-and-the-corrections-last-ditch-brigade.md": {
	id: "2007/2007-10-04-ben-birchall-and-the-corrections-last-ditch-brigade.md";
  slug: "2007/2007-10-04-ben-birchall-and-the-corrections-last-ditch-brigade";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-04-carus-and-the-true-believers-three-boxes.md": {
	id: "2007/2007-10-04-carus-and-the-true-believers-three-boxes.md";
  slug: "2007/2007-10-04-carus-and-the-true-believers-three-boxes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-04-i-heart-hiroshima-interview.md": {
	id: "2007/2007-10-04-i-heart-hiroshima-interview.md";
  slug: "2007/2007-10-04-i-heart-hiroshima-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-04-predicted-increase-in-international-students-news-feature.md": {
	id: "2007/2007-10-04-predicted-increase-in-international-students-news-feature.md";
  slug: "2007/2007-10-04-predicted-increase-in-international-students-news-feature";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-04-the-exploders-easy-and-the-sun.md": {
	id: "2007/2007-10-04-the-exploders-easy-and-the-sun.md";
  slug: "2007/2007-10-04-the-exploders-easy-and-the-sun";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-04-the-pictures-the-fantastic-sound-of-the-pictures.md": {
	id: "2007/2007-10-04-the-pictures-the-fantastic-sound-of-the-pictures.md";
  slug: "2007/2007-10-04-the-pictures-the-fantastic-sound-of-the-pictures";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-08-job-interviews-and-playing-in-geelong.md": {
	id: "2007/2007-10-08-job-interviews-and-playing-in-geelong.md";
  slug: "2007/2007-10-08-job-interviews-and-playing-in-geelong";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-08-politics-in-music-folk.md": {
	id: "2007/2007-10-08-politics-in-music-folk.md";
  slug: "2007/2007-10-08-politics-in-music-folk";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-12-international-students-and-capitalism.md": {
	id: "2007/2007-10-12-international-students-and-capitalism.md";
  slug: "2007/2007-10-12-international-students-and-capitalism";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-10-12-ned-collette-interview.md": {
	id: "2007/2007-10-12-ned-collette-interview.md";
  slug: "2007/2007-10-12-ned-collette-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-01-john-cage-prepared-piano-and-the-election-colouring-book.md": {
	id: "2007/2007-11-01-john-cage-prepared-piano-and-the-election-colouring-book.md";
  slug: "2007/2007-11-01-john-cage-prepared-piano-and-the-election-colouring-book";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-06-films-tv-and-warehouse-parties.md": {
	id: "2007/2007-11-06-films-tv-and-warehouse-parties.md";
  slug: "2007/2007-11-06-films-tv-and-warehouse-parties";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-08-interview-with-the-dardanelles.md": {
	id: "2007/2007-11-08-interview-with-the-dardanelles.md";
  slug: "2007/2007-11-08-interview-with-the-dardanelles";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-13-debut-albums-and-snail-racing.md": {
	id: "2007/2007-11-13-debut-albums-and-snail-racing.md";
  slug: "2007/2007-11-13-debut-albums-and-snail-racing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-bellaruche-fat-freddys-drop-metro.md": {
	id: "2007/2007-11-15-bellaruche-fat-freddys-drop-metro.md";
  slug: "2007/2007-11-15-bellaruche-fat-freddys-drop-metro";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-dardanelles-interview.md": {
	id: "2007/2007-11-15-dardanelles-interview.md";
  slug: "2007/2007-11-15-dardanelles-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-dr-dog-we-all-belong.md": {
	id: "2007/2007-11-15-dr-dog-we-all-belong.md";
  slug: "2007/2007-11-15-dr-dog-we-all-belong";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-john-cage-prepared-piano.md": {
	id: "2007/2007-11-15-john-cage-prepared-piano.md";
  slug: "2007/2007-11-15-john-cage-prepared-piano";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-ned-colette-interview.md": {
	id: "2007/2007-11-15-ned-colette-interview.md";
  slug: "2007/2007-11-15-ned-colette-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-sir-sly-hats-guy-blackman-northcote-social-club.md": {
	id: "2007/2007-11-15-sir-sly-hats-guy-blackman-northcote-social-club.md";
  slug: "2007/2007-11-15-sir-sly-hats-guy-blackman-northcote-social-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-sly-hats-interview.md": {
	id: "2007/2007-11-15-sly-hats-interview.md";
  slug: "2007/2007-11-15-sly-hats-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-snowman-the-drones-the-corner.md": {
	id: "2007/2007-11-15-snowman-the-drones-the-corner.md";
  slug: "2007/2007-11-15-snowman-the-drones-the-corner";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-the-drones-interview.md": {
	id: "2007/2007-11-15-the-drones-interview.md";
  slug: "2007/2007-11-15-the-drones-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-15-various-out-of-the-woods-and-trees.md": {
	id: "2007/2007-11-15-various-out-of-the-woods-and-trees.md";
  slug: "2007/2007-11-15-various-out-of-the-woods-and-trees";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-11-26-politics-in-music-melbourne.md": {
	id: "2007/2007-11-26-politics-in-music-melbourne.md";
  slug: "2007/2007-11-26-politics-in-music-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-06-children-collide-and-clutch-reviews.md": {
	id: "2007/2007-12-06-children-collide-and-clutch-reviews.md";
  slug: "2007/2007-12-06-children-collide-and-clutch-reviews";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-14-interview-with-embers.md": {
	id: "2007/2007-12-14-interview-with-embers.md";
  slug: "2007/2007-12-14-interview-with-embers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-20-bright-yellow-british-india-the-evelyn.md": {
	id: "2007/2007-12-20-bright-yellow-british-india-the-evelyn.md";
  slug: "2007/2007-12-20-bright-yellow-british-india-the-evelyn";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-20-children-collide-interview.md": {
	id: "2007/2007-12-20-children-collide-interview.md";
  slug: "2007/2007-12-20-children-collide-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-20-clutch-interview.md": {
	id: "2007/2007-12-20-clutch-interview.md";
  slug: "2007/2007-12-20-clutch-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-20-embers-interview.md": {
	id: "2007/2007-12-20-embers-interview.md";
  slug: "2007/2007-12-20-embers-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-20-ernest-ranglin-the-trojan-horns-the-espy.md": {
	id: "2007/2007-12-20-ernest-ranglin-the-trojan-horns-the-espy.md";
  slug: "2007/2007-12-20-ernest-ranglin-the-trojan-horns-the-espy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-20-goofang-spun-rivals-worlds-end-press-ding-dong-melbourne.md": {
	id: "2007/2007-12-20-goofang-spun-rivals-worlds-end-press-ding-dong-melbourne.md";
  slug: "2007/2007-12-20-goofang-spun-rivals-worlds-end-press-ding-dong-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2007/2007-12-20-plastic-palace-alice-the-spiegel-tent.md": {
	id: "2007/2007-12-20-plastic-palace-alice-the-spiegel-tent.md";
  slug: "2007/2007-12-20-plastic-palace-alice-the-spiegel-tent";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-01-10-chris-tt-interview.md": {
	id: "2008/2008-01-10-chris-tt-interview.md";
  slug: "2008/2008-01-10-chris-tt-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-01-10-josh-pyke-interview.md": {
	id: "2008/2008-01-10-josh-pyke-interview.md";
  slug: "2008/2008-01-10-josh-pyke-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-01-10-oocon-creative-writing.md": {
	id: "2008/2008-01-10-oocon-creative-writing.md";
  slug: "2008/2008-01-10-oocon-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-01-10-sore-thumb-creative-writing.md": {
	id: "2008/2008-01-10-sore-thumb-creative-writing.md";
  slug: "2008/2008-01-10-sore-thumb-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-01-10-unkle-interview.md": {
	id: "2008/2008-01-10-unkle-interview.md";
  slug: "2008/2008-01-10-unkle-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-03-13-from-the-jam-prince-of-wales.md": {
	id: "2008/2008-03-13-from-the-jam-prince-of-wales.md";
  slug: "2008/2008-03-13-from-the-jam-prince-of-wales";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-03-17-bill-bryson-a-short-history-of-nearly-everything.md": {
	id: "2008/2008-03-17-bill-bryson-a-short-history-of-nearly-everything.md";
  slug: "2008/2008-03-17-bill-bryson-a-short-history-of-nearly-everything";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-03-17-kamikaze-trio-group-seizure-talk-show-boy-shark-in-the-dark-tetrode-kink-the-noise-bar.md": {
	id: "2008/2008-03-17-kamikaze-trio-group-seizure-talk-show-boy-shark-in-the-dark-tetrode-kink-the-noise-bar.md";
  slug: "2008/2008-03-17-kamikaze-trio-group-seizure-talk-show-boy-shark-in-the-dark-tetrode-kink-the-noise-bar";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-09-image-man-creative-writing.md": {
	id: "2008/2008-04-09-image-man-creative-writing.md";
  slug: "2008/2008-04-09-image-man-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-09-random-sunday-creative-writing.md": {
	id: "2008/2008-04-09-random-sunday-creative-writing.md";
  slug: "2008/2008-04-09-random-sunday-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-28-baseball-missing-link.md": {
	id: "2008/2008-04-28-baseball-missing-link.md";
  slug: "2008/2008-04-28-baseball-missing-link";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-28-henry-rollins-comedy-theatre.md": {
	id: "2008/2008-04-28-henry-rollins-comedy-theatre.md";
  slug: "2008/2008-04-28-henry-rollins-comedy-theatre";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-28-the-knockouts-gentle-ben-and-his-sensitive-side-6ft-hick-ding-dong-lounge.md": {
	id: "2008/2008-04-28-the-knockouts-gentle-ben-and-his-sensitive-side-6ft-hick-ding-dong-lounge.md";
  slug: "2008/2008-04-28-the-knockouts-gentle-ben-and-his-sensitive-side-6ft-hick-ding-dong-lounge";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-28-tv-for-cats-skull-squadron-radiant-city-the-tote.md": {
	id: "2008/2008-04-28-tv-for-cats-skull-squadron-radiant-city-the-tote.md";
  slug: "2008/2008-04-28-tv-for-cats-skull-squadron-radiant-city-the-tote";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-28-young-and-restless-dardanelles-the-galvatrons-cassette-kids-flamingo-crash-reptiles-the-corner.md": {
	id: "2008/2008-04-28-young-and-restless-dardanelles-the-galvatrons-cassette-kids-flamingo-crash-reptiles-the-corner.md";
  slug: "2008/2008-04-28-young-and-restless-dardanelles-the-galvatrons-cassette-kids-flamingo-crash-reptiles-the-corner";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-29-actor-model-bachelor-of-arts-die-die-die-revolver.md": {
	id: "2008/2008-04-29-actor-model-bachelor-of-arts-die-die-die-revolver.md";
  slug: "2008/2008-04-29-actor-model-bachelor-of-arts-die-die-die-revolver";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-04-29-the-prester-quest-nicholas-jubber.md": {
	id: "2008/2008-04-29-the-prester-quest-nicholas-jubber.md";
  slug: "2008/2008-04-29-the-prester-quest-nicholas-jubber";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-05-25-let-it-out-creative-writing.md": {
	id: "2008/2008-05-25-let-it-out-creative-writing.md";
  slug: "2008/2008-05-25-let-it-out-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-05-26-city-life-creative-writing.md": {
	id: "2008/2008-05-26-city-life-creative-writing.md";
  slug: "2008/2008-05-26-city-life-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-05-26-dancing-on-the-edge-creative-writing.md": {
	id: "2008/2008-05-26-dancing-on-the-edge-creative-writing.md";
  slug: "2008/2008-05-26-dancing-on-the-edge-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-05-26-dream-creative-writing-dream.md": {
	id: "2008/2008-05-26-dream-creative-writing-dream.md";
  slug: "2008/2008-05-26-dream-creative-writing-dream";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-05-26-long-distance-call-creative-writing-sketch.md": {
	id: "2008/2008-05-26-long-distance-call-creative-writing-sketch.md";
  slug: "2008/2008-05-26-long-distance-call-creative-writing-sketch";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-05-26-text-talk-one-creative-writing.md": {
	id: "2008/2008-05-26-text-talk-one-creative-writing.md";
  slug: "2008/2008-05-26-text-talk-one-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-05-26-touche-creative-writing.md": {
	id: "2008/2008-05-26-touche-creative-writing.md";
  slug: "2008/2008-05-26-touche-creative-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-05-27-rocket-science-the-east-brunswick-club.md": {
	id: "2008/2008-05-27-rocket-science-the-east-brunswick-club.md";
  slug: "2008/2008-05-27-rocket-science-the-east-brunswick-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-08-25-kisschasey-the-palace.md": {
	id: "2008/2008-08-25-kisschasey-the-palace.md";
  slug: "2008/2008-08-25-kisschasey-the-palace";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-08-25-melbournes-2am-lockout-null.md": {
	id: "2008/2008-08-25-melbournes-2am-lockout-null.md";
  slug: "2008/2008-08-25-melbournes-2am-lockout-null";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-08-25-pikelet-manchester-lane.md": {
	id: "2008/2008-08-25-pikelet-manchester-lane.md";
  slug: "2008/2008-08-25-pikelet-manchester-lane";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-08-25-sebastien-bach-the-palace.md": {
	id: "2008/2008-08-25-sebastien-bach-the-palace.md";
  slug: "2008/2008-08-25-sebastien-bach-the-palace";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-08-25-the-fratellis-hi-fi-bar.md": {
	id: "2008/2008-08-25-the-fratellis-hi-fi-bar.md";
  slug: "2008/2008-08-25-the-fratellis-hi-fi-bar";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-1421-gavin-menzies.md": {
	id: "2008/2008-10-27-1421-gavin-menzies.md";
  slug: "2008/2008-10-27-1421-gavin-menzies";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-are-we-valued.md": {
	id: "2008/2008-10-27-are-we-valued.md";
  slug: "2008/2008-10-27-are-we-valued";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-dr-invisiablo-assassination-collective-the-old-bar.md": {
	id: "2008/2008-10-27-dr-invisiablo-assassination-collective-the-old-bar.md";
  slug: "2008/2008-10-27-dr-invisiablo-assassination-collective-the-old-bar";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-jpod-douglas-coupland.md": {
	id: "2008/2008-10-27-jpod-douglas-coupland.md";
  slug: "2008/2008-10-27-jpod-douglas-coupland";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-mark-steiner-rowland-s-howard-the-toff-in-town.md": {
	id: "2008/2008-10-27-mark-steiner-rowland-s-howard-the-toff-in-town.md";
  slug: "2008/2008-10-27-mark-steiner-rowland-s-howard-the-toff-in-town";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-psychopaths-and-cyclepaths.md": {
	id: "2008/2008-10-27-psychopaths-and-cyclepaths.md";
  slug: "2008/2008-10-27-psychopaths-and-cyclepaths";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-rome-and-jerusalem-the-clash-of-ancient-civilisations-martin-goodman.md": {
	id: "2008/2008-10-27-rome-and-jerusalem-the-clash-of-ancient-civilisations-martin-goodman.md";
  slug: "2008/2008-10-27-rome-and-jerusalem-the-clash-of-ancient-civilisations-martin-goodman";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-rubber-records-20th-birthday-northcote-town-hall.md": {
	id: "2008/2008-10-27-rubber-records-20th-birthday-northcote-town-hall.md";
  slug: "2008/2008-10-27-rubber-records-20th-birthday-northcote-town-hall";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-the-zombie-state-melbourne-university.md": {
	id: "2008/2008-10-27-the-zombie-state-melbourne-university.md";
  slug: "2008/2008-10-27-the-zombie-state-melbourne-university";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-10-27-where-to-ride-book-review.md": {
	id: "2008/2008-10-27-where-to-ride-book-review.md";
  slug: "2008/2008-10-27-where-to-ride-book-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-12-29-city-life-creative-writing-prose.md": {
	id: "2008/2008-12-29-city-life-creative-writing-prose.md";
  slug: "2008/2008-12-29-city-life-creative-writing-prose";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-12-29-steph-brett-miss-little-howl-at-the-moon-the-empress.md": {
	id: "2008/2008-12-29-steph-brett-miss-little-howl-at-the-moon-the-empress.md";
  slug: "2008/2008-12-29-steph-brett-miss-little-howl-at-the-moon-the-empress";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-12-30-human-powered-cycles-cycling-article.md": {
	id: "2008/2008-12-30-human-powered-cycles-cycling-article.md";
  slug: "2008/2008-12-30-human-powered-cycles-cycling-article";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-12-30-look-whos-toxic-the-amazing-phillipss-sisters-tucker-bs-spod-the-northcote-social-club.md": {
	id: "2008/2008-12-30-look-whos-toxic-the-amazing-phillipss-sisters-tucker-bs-spod-the-northcote-social-club.md";
  slug: "2008/2008-12-30-look-whos-toxic-the-amazing-phillipss-sisters-tucker-bs-spod-the-northcote-social-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-12-30-random-sunday-creative-writing-poem.md": {
	id: "2008/2008-12-30-random-sunday-creative-writing-poem.md";
  slug: "2008/2008-12-30-random-sunday-creative-writing-poem";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-12-30-text-talk-one-creative-writing-poem.md": {
	id: "2008/2008-12-30-text-talk-one-creative-writing-poem.md";
  slug: "2008/2008-12-30-text-talk-one-creative-writing-poem";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2008/2008-12-30-the-jacks-assassination-collective-actor-model-shooting-at-unarmed-men-pony.md": {
	id: "2008/2008-12-30-the-jacks-assassination-collective-actor-model-shooting-at-unarmed-men-pony.md";
  slug: "2008/2008-12-30-the-jacks-assassination-collective-actor-model-shooting-at-unarmed-men-pony";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-01-26-the-rules-of-the-road-cycling-article.md": {
	id: "2009/2009-01-26-the-rules-of-the-road-cycling-article.md";
  slug: "2009/2009-01-26-the-rules-of-the-road-cycling-article";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-01-26-the-slow-guide-to-melbourne-book-review.md": {
	id: "2009/2009-01-26-the-slow-guide-to-melbourne-book-review.md";
  slug: "2009/2009-01-26-the-slow-guide-to-melbourne-book-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-02-08-on-death.md": {
	id: "2009/2009-02-08-on-death.md";
  slug: "2009/2009-02-08-on-death";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-a-short-history-of-byzantium-john-julius-norwich.md": {
	id: "2009/2009-04-28-a-short-history-of-byzantium-john-julius-norwich.md";
  slug: "2009/2009-04-28-a-short-history-of-byzantium-john-julius-norwich";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-apocalypse-ish.md": {
	id: "2009/2009-04-28-apocalypse-ish.md";
  slug: "2009/2009-04-28-apocalypse-ish";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-australian-festivals.md": {
	id: "2009/2009-04-28-australian-festivals.md";
  slug: "2009/2009-04-28-australian-festivals";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-derelict-london-paul-talling.md": {
	id: "2009/2009-04-28-derelict-london-paul-talling.md";
  slug: "2009/2009-04-28-derelict-london-paul-talling";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-jesus-is-coming.md": {
	id: "2009/2009-04-28-jesus-is-coming.md";
  slug: "2009/2009-04-28-jesus-is-coming";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-michael-franti-the-prince-of-wales.md": {
	id: "2009/2009-04-28-michael-franti-the-prince-of-wales.md";
  slug: "2009/2009-04-28-michael-franti-the-prince-of-wales";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-richard-dawkins-the-god-delusion.md": {
	id: "2009/2009-04-28-richard-dawkins-the-god-delusion.md";
  slug: "2009/2009-04-28-richard-dawkins-the-god-delusion";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-rules-of-the-road-null.md": {
	id: "2009/2009-04-28-rules-of-the-road-null.md";
  slug: "2009/2009-04-28-rules-of-the-road-null";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-the-hives-the-forum.md": {
	id: "2009/2009-04-28-the-hives-the-forum.md";
  slug: "2009/2009-04-28-the-hives-the-forum";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-the-slow-guide-to-melbourne-null.md": {
	id: "2009/2009-04-28-the-slow-guide-to-melbourne-null.md";
  slug: "2009/2009-04-28-the-slow-guide-to-melbourne-null";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-the-stranglers-the-palace.md": {
	id: "2009/2009-04-28-the-stranglers-the-palace.md";
  slug: "2009/2009-04-28-the-stranglers-the-palace";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-04-28-umberto-eco-the-island-of-the-day-before.md": {
	id: "2009/2009-04-28-umberto-eco-the-island-of-the-day-before.md";
  slug: "2009/2009-04-28-umberto-eco-the-island-of-the-day-before";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2009/2009-12-27-covers-of-the-future.md": {
	id: "2009/2009-12-27-covers-of-the-future.md";
  slug: "2009/2009-12-27-covers-of-the-future";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-bones-damn-terran-will-stoker-and-the-embers-the-tote.md": {
	id: "2010/2010-01-03-bones-damn-terran-will-stoker-and-the-embers-the-tote.md";
  slug: "2010/2010-01-03-bones-damn-terran-will-stoker-and-the-embers-the-tote";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-diamond-sea-fire-santa-rosa-fire-i-heart-hiroshima-the-northcote-social-club.md": {
	id: "2010/2010-01-03-diamond-sea-fire-santa-rosa-fire-i-heart-hiroshima-the-northcote-social-club.md";
  slug: "2010/2010-01-03-diamond-sea-fire-santa-rosa-fire-i-heart-hiroshima-the-northcote-social-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-does-it-offend-you-yeah-billboard.md": {
	id: "2010/2010-01-03-does-it-offend-you-yeah-billboard.md";
  slug: "2010/2010-01-03-does-it-offend-you-yeah-billboard";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-ember-swift-the-new-project.md": {
	id: "2010/2010-01-03-ember-swift-the-new-project.md";
  slug: "2010/2010-01-03-ember-swift-the-new-project";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-grafton-primary-the-east-brunswick-club.md": {
	id: "2010/2010-01-03-grafton-primary-the-east-brunswick-club.md";
  slug: "2010/2010-01-03-grafton-primary-the-east-brunswick-club";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-jamie-t-hifi.md": {
	id: "2010/2010-01-03-jamie-t-hifi.md";
  slug: "2010/2010-01-03-jamie-t-hifi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-lightning-bolt-thornbury-theatre.md": {
	id: "2010/2010-01-03-lightning-bolt-thornbury-theatre.md";
  slug: "2010/2010-01-03-lightning-bolt-thornbury-theatre";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-los-valentines-cities-of-gold.md": {
	id: "2010/2010-01-03-los-valentines-cities-of-gold.md";
  slug: "2010/2010-01-03-los-valentines-cities-of-gold";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-mammal-vol2-systematic-automatic.md": {
	id: "2010/2010-01-03-mammal-vol2-systematic-automatic.md";
  slug: "2010/2010-01-03-mammal-vol2-systematic-automatic";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-the-currency-the-currency.md": {
	id: "2010/2010-01-03-the-currency-the-currency.md";
  slug: "2010/2010-01-03-the-currency-the-currency";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-the-rip-i-heart-hiroshima.md": {
	id: "2010/2010-01-03-the-rip-i-heart-hiroshima.md";
  slug: "2010/2010-01-03-the-rip-i-heart-hiroshima";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-01-03-the-spoils-toff-in-town.md": {
	id: "2010/2010-01-03-the-spoils-toff-in-town.md";
  slug: "2010/2010-01-03-the-spoils-toff-in-town";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-09-14-how-much-milk-is-too-much.md": {
	id: "2010/2010-09-14-how-much-milk-is-too-much.md";
  slug: "2010/2010-09-14-how-much-milk-is-too-much";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-09-14-one-and-me.md": {
	id: "2010/2010-09-14-one-and-me.md";
  slug: "2010/2010-09-14-one-and-me";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2010/2010-12-13-doug-and-julie.md": {
	id: "2010/2010-12-13-doug-and-julie.md";
  slug: "2010/2010-12-13-doug-and-julie";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-07-25-beijing.md": {
	id: "2011/2011-07-25-beijing.md";
  slug: "2011/2011-07-25-beijing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-07-25-chinese-receipts.md": {
	id: "2011/2011-07-25-chinese-receipts.md";
  slug: "2011/2011-07-25-chinese-receipts";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-08-01-lincolnshire.md": {
	id: "2011/2011-08-01-lincolnshire.md";
  slug: "2011/2011-08-01-lincolnshire";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-08-10-joomla-to-drupal-import.md": {
	id: "2011/2011-08-10-joomla-to-drupal-import.md";
  slug: "2011/2011-08-10-joomla-to-drupal-import";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-08-11-skegness-wind-farm.md": {
	id: "2011/2011-08-11-skegness-wind-farm.md";
  slug: "2011/2011-08-11-skegness-wind-farm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-08-15-drinking-control-ad.md": {
	id: "2011/2011-08-15-drinking-control-ad.md";
  slug: "2011/2011-08-15-drinking-control-ad";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-08-15-norwich.md": {
	id: "2011/2011-08-15-norwich.md";
  slug: "2011/2011-08-15-norwich";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-08-26-london-civicon-2011.md": {
	id: "2011/2011-08-26-london-civicon-2011.md";
  slug: "2011/2011-08-26-london-civicon-2011";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-09-28-hands-on-with-lion-10-7-installing.md": {
	id: "2011/2011-09-28-hands-on-with-lion-10-7-installing.md";
  slug: "2011/2011-09-28-hands-on-with-lion-10-7-installing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2011/2011-12-04-making-the-civievent-ical-feed-show-all-events.md": {
	id: "2011/2011-12-04-making-the-civievent-ical-feed-show-all-events.md";
  slug: "2011/2011-12-04-making-the-civievent-ical-feed-show-all-events";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2012/2012-03-15-evernote.md": {
	id: "2012/2012-03-15-evernote.md";
  slug: "2012/2012-03-15-evernote";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2012/2012-04-08-my-social-media-strategy-advice.md": {
	id: "2012/2012-04-08-my-social-media-strategy-advice.md";
  slug: "2012/2012-04-08-my-social-media-strategy-advice";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2012/2012-04-09-thoughts-from-the-ntc-2012-san-francisco.md": {
	id: "2012/2012-04-09-thoughts-from-the-ntc-2012-san-francisco.md";
  slug: "2012/2012-04-09-thoughts-from-the-ntc-2012-san-francisco";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2012/2012-06-03-mysamaris-flyer.md": {
	id: "2012/2012-06-03-mysamaris-flyer.md";
  slug: "2012/2012-06-03-mysamaris-flyer";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2012/2012-06-25-drupal-7-multi-sites-configuration-from-packt-publishing.md": {
	id: "2012/2012-06-25-drupal-7-multi-sites-configuration-from-packt-publishing.md";
  slug: "2012/2012-06-25-drupal-7-multi-sites-configuration-from-packt-publishing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2012/2012-08-09-drupal-7-webform-cookbook.md": {
	id: "2012/2012-08-09-drupal-7-webform-cookbook.md";
  slug: "2012/2012-08-09-drupal-7-webform-cookbook";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-01-01-2013-new-years-resolutions.md": {
	id: "2013/2013-01-01-2013-new-years-resolutions.md";
  slug: "2013/2013-01-01-2013-new-years-resolutions";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-01-02-creating-campaigns-with-drupal-and-civicrm.md": {
	id: "2013/2013-01-02-creating-campaigns-with-drupal-and-civicrm.md";
  slug: "2013/2013-01-02-creating-campaigns-with-drupal-and-civicrm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-01-02-extending-drupal-with-a-crm.md": {
	id: "2013/2013-01-02-extending-drupal-with-a-crm.md";
  slug: "2013/2013-01-02-extending-drupal-with-a-crm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-01-04-extending-drupal-with-a-crm-talk-at-drupal-melbourne-meetup-8th-jan.md": {
	id: "2013/2013-01-04-extending-drupal-with-a-crm-talk-at-drupal-melbourne-meetup-8th-jan.md";
  slug: "2013/2013-01-04-extending-drupal-with-a-crm-talk-at-drupal-melbourne-meetup-8th-jan";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-01-06-buffer-social-sharing.md": {
	id: "2013/2013-01-06-buffer-social-sharing.md";
  slug: "2013/2013-01-06-buffer-social-sharing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-01-13-insync.md": {
	id: "2013/2013-01-13-insync.md";
  slug: "2013/2013-01-13-insync";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-01-14-talking-civicrm-at-joomladay-melbourne-20th-jan.md": {
	id: "2013/2013-01-14-talking-civicrm-at-joomladay-melbourne-20th-jan.md";
  slug: "2013/2013-01-14-talking-civicrm-at-joomladay-melbourne-20th-jan";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-01-21-how-long-did-that-website-really-take-to-make.md": {
	id: "2013/2013-01-21-how-long-did-that-website-really-take-to-make.md";
  slug: "2013/2013-01-21-how-long-did-that-website-really-take-to-make";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-03-12-take-your-drupal-sites-offline.md": {
	id: "2013/2013-03-12-take-your-drupal-sites-offline.md";
  slug: "2013/2013-03-12-take-your-drupal-sites-offline";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-04-20-talking-at-web-directions-code.md": {
	id: "2013/2013-04-20-talking-at-web-directions-code.md";
  slug: "2013/2013-04-20-talking-at-web-directions-code";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-04-28-nexus-4-the-android-iphone-and-thats-ok.md": {
	id: "2013/2013-04-28-nexus-4-the-android-iphone-and-thats-ok.md";
  slug: "2013/2013-04-28-nexus-4-the-android-iphone-and-thats-ok";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-05-04-featurefull-vs-usable.md": {
	id: "2013/2013-05-04-featurefull-vs-usable.md";
  slug: "2013/2013-05-04-featurefull-vs-usable";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-05-04-my-new-housemate.md": {
	id: "2013/2013-05-04-my-new-housemate.md";
  slug: "2013/2013-05-04-my-new-housemate";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-05-04-price-on-application-with-ubercart-3-and-views.md": {
	id: "2013/2013-05-04-price-on-application-with-ubercart-3-and-views.md";
  slug: "2013/2013-05-04-price-on-application-with-ubercart-3-and-views";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-05-13-the-lean-and-agile-non-profit.md": {
	id: "2013/2013-05-13-the-lean-and-agile-non-profit.md";
  slug: "2013/2013-05-13-the-lean-and-agile-non-profit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-06-21-civicrm-cookbook-tony-horrocks.md": {
	id: "2013/2013-06-21-civicrm-cookbook-tony-horrocks.md";
  slug: "2013/2013-06-21-civicrm-cookbook-tony-horrocks";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-07-02-clarity-context-and-how-to-understand-each-other-better.md": {
	id: "2013/2013-07-02-clarity-context-and-how-to-understand-each-other-better.md";
  slug: "2013/2013-07-02-clarity-context-and-how-to-understand-each-other-better";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-07-04-the-lean-and-agile-non-profit.md": {
	id: "2013/2013-07-04-the-lean-and-agile-non-profit.md";
  slug: "2013/2013-07-04-the-lean-and-agile-non-profit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-07-12-power-your-mobile-presence-with-drupal.md": {
	id: "2013/2013-07-12-power-your-mobile-presence-with-drupal.md";
  slug: "2013/2013-07-12-power-your-mobile-presence-with-drupal";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-03-avoiding-problems-with-your-drupal-project.md": {
	id: "2013/2013-08-03-avoiding-problems-with-your-drupal-project.md";
  slug: "2013/2013-08-03-avoiding-problems-with-your-drupal-project";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-13-angelcube-pitch-night-aug-12th-2013.md": {
	id: "2013/2013-08-13-angelcube-pitch-night-aug-12th-2013.md";
  slug: "2013/2013-08-13-angelcube-pitch-night-aug-12th-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-14-drupal-melbourne-meetup-aug-13th-2013.md": {
	id: "2013/2013-08-14-drupal-melbourne-meetup-aug-13th-2013.md";
  slug: "2013/2013-08-14-drupal-melbourne-meetup-aug-13th-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-15-silicon-beach-drinks-15th-august.md": {
	id: "2013/2013-08-15-silicon-beach-drinks-15th-august.md";
  slug: "2013/2013-08-15-silicon-beach-drinks-15th-august";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-25-drupalgov-2013-canberra.md": {
	id: "2013/2013-08-25-drupalgov-2013-canberra.md";
  slug: "2013/2013-08-25-drupalgov-2013-canberra";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-28-security-and-design-thinking.md": {
	id: "2013/2013-08-28-security-and-design-thinking.md";
  slug: "2013/2013-08-28-security-and-design-thinking";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-28-tedxunimelb-28th-aug-2013.md": {
	id: "2013/2013-08-28-tedxunimelb-28th-aug-2013.md";
  slug: "2013/2013-08-28-tedxunimelb-28th-aug-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-30-drupal-for-education-and-elearning-book-review.md": {
	id: "2013/2013-08-30-drupal-for-education-and-elearning-book-review.md";
  slug: "2013/2013-08-30-drupal-for-education-and-elearning-book-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-08-30-netsquared-meetup-aug-2013.md": {
	id: "2013/2013-08-30-netsquared-meetup-aug-2013.md";
  slug: "2013/2013-08-30-netsquared-meetup-aug-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-09-05-what-do-you-know-sep-2013.md": {
	id: "2013/2013-09-05-what-do-you-know-sep-2013.md";
  slug: "2013/2013-09-05-what-do-you-know-sep-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-09-11-agile-yow-night-melbourne-dave-thomas-sept-2013.md": {
	id: "2013/2013-09-11-agile-yow-night-melbourne-dave-thomas-sept-2013.md";
  slug: "2013/2013-09-11-agile-yow-night-melbourne-dave-thomas-sept-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-09-11-drupal-melbourne-meetup-sep-2013.md": {
	id: "2013/2013-09-11-drupal-melbourne-meetup-sep-2013.md";
  slug: "2013/2013-09-11-drupal-melbourne-meetup-sep-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-09-11-mobile-mondays-melbourne-sept-2013.md": {
	id: "2013/2013-09-11-mobile-mondays-melbourne-sept-2013.md";
  slug: "2013/2013-09-11-mobile-mondays-melbourne-sept-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-09-15-bitcoin-melbourne-meetup-sep-2013.md": {
	id: "2013/2013-09-15-bitcoin-melbourne-meetup-sep-2013.md";
  slug: "2013/2013-09-15-bitcoin-melbourne-meetup-sep-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-09-20-melbourne-geek-night-september-2013.md": {
	id: "2013/2013-09-20-melbourne-geek-night-september-2013.md";
  slug: "2013/2013-09-20-melbourne-geek-night-september-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-09-21-today-google-told-me-my-flight-was-delayed-before-my-airline.md": {
	id: "2013/2013-09-21-today-google-told-me-my-flight-was-delayed-before-my-airline.md";
  slug: "2013/2013-09-21-today-google-told-me-my-flight-was-delayed-before-my-airline";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-10-17-travel-tips.md": {
	id: "2013/2013-10-17-travel-tips.md";
  slug: "2013/2013-10-17-travel-tips";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-10-21-submit-your-site-building-session-ideas-for-drupalsouth.md": {
	id: "2013/2013-10-21-submit-your-site-building-session-ideas-for-drupalsouth.md";
  slug: "2013/2013-10-21-submit-your-site-building-session-ideas-for-drupalsouth";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-10-30-healthhack-melbourne-2013.md": {
	id: "2013/2013-10-30-healthhack-melbourne-2013.md";
  slug: "2013/2013-10-30-healthhack-melbourne-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-10-30-publishing-the-open-access-way.md": {
	id: "2013/2013-10-30-publishing-the-open-access-way.md";
  slug: "2013/2013-10-30-publishing-the-open-access-way";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-11-01-lean-startup-melbourne-jon-teo.md": {
	id: "2013/2013-11-01-lean-startup-melbourne-jon-teo.md";
  slug: "2013/2013-11-01-lean-startup-melbourne-jon-teo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-11-15-so-i-quit-my-job-whats-next.md": {
	id: "2013/2013-11-15-so-i-quit-my-job-whats-next.md";
  slug: "2013/2013-11-15-so-i-quit-my-job-whats-next";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-11-20-drupal-melbourne-meetup-nov-2013.md": {
	id: "2013/2013-11-20-drupal-melbourne-meetup-nov-2013.md";
  slug: "2013/2013-11-20-drupal-melbourne-meetup-nov-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-11-20-granite-leadership-breakfast-vendor-management-and-quality-of-delivery.md": {
	id: "2013/2013-11-20-granite-leadership-breakfast-vendor-management-and-quality-of-delivery.md";
  slug: "2013/2013-11-20-granite-leadership-breakfast-vendor-management-and-quality-of-delivery";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-11-21-melbourne-geek-night-nov-2013.md": {
	id: "2013/2013-11-21-melbourne-geek-night-nov-2013.md";
  slug: "2013/2013-11-21-melbourne-geek-night-nov-2013";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-11-25-creative-vs-commons.md": {
	id: "2013/2013-11-25-creative-vs-commons.md";
  slug: "2013/2013-11-25-creative-vs-commons";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-11-25-lean-startup-melbourne-future-trends-and-innovation-in-melbourne-startups.md": {
	id: "2013/2013-11-25-lean-startup-melbourne-future-trends-and-innovation-in-melbourne-startups.md";
  slug: "2013/2013-11-25-lean-startup-melbourne-future-trends-and-innovation-in-melbourne-startups";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-12-05-what-people-want-from-websites.md": {
	id: "2013/2013-12-05-what-people-want-from-websites.md";
  slug: "2013/2013-12-05-what-people-want-from-websites";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-12-10-joomla-day-polo-shirt.md": {
	id: "2013/2013-12-10-joomla-day-polo-shirt.md";
  slug: "2013/2013-12-10-joomla-day-polo-shirt";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-12-10-kendoui-t-shirt.md": {
	id: "2013/2013-12-10-kendoui-t-shirt.md";
  slug: "2013/2013-12-10-kendoui-t-shirt";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-12-10-osdc-towel.md": {
	id: "2013/2013-12-10-osdc-towel.md";
  slug: "2013/2013-12-10-osdc-towel";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2013/2013-12-15-meet-the-data-owners-vicroads.md": {
	id: "2013/2013-12-15-meet-the-data-owners-vicroads.md";
  slug: "2013/2013-12-15-meet-the-data-owners-vicroads";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-01-01-2013-in-review.md": {
	id: "2014/2014-01-01-2013-in-review.md";
  slug: "2014/2014-01-01-2013-in-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-01-14-computer-human-interaction.md": {
	id: "2014/2014-01-14-computer-human-interaction.md";
  slug: "2014/2014-01-14-computer-human-interaction";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-01-23-featurezilla-will-featureful-kill-usable-on-the-web.md": {
	id: "2014/2014-01-23-featurezilla-will-featureful-kill-usable-on-the-web.md";
  slug: "2014/2014-01-23-featurezilla-will-featureful-kill-usable-on-the-web";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-01-29-lean-startup-melbourne-jan-2014.md": {
	id: "2014/2014-01-29-lean-startup-melbourne-jan-2014.md";
  slug: "2014/2014-01-29-lean-startup-melbourne-jan-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-02-01-elance-big-idea-melbourne.md": {
	id: "2014/2014-02-01-elance-big-idea-melbourne.md";
  slug: "2014/2014-02-01-elance-big-idea-melbourne";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-02-18-melbourne-mobile-february-2014.md": {
	id: "2014/2014-02-18-melbourne-mobile-february-2014.md";
  slug: "2014/2014-02-18-melbourne-mobile-february-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-02-20-lovecraft-and-john-harrison-return.md": {
	id: "2014/2014-02-20-lovecraft-and-john-harrison-return.md";
  slug: "2014/2014-02-20-lovecraft-and-john-harrison-return";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-02-21-product-anonymous-feb-2014-api-management.md": {
	id: "2014/2014-02-21-product-anonymous-feb-2014-api-management.md";
  slug: "2014/2014-02-21-product-anonymous-feb-2014-api-management";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-02-27-melbourne-kmlf-feb-2014.md": {
	id: "2014/2014-02-27-melbourne-kmlf-feb-2014.md";
  slug: "2014/2014-02-27-melbourne-kmlf-feb-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-03-03-dash-documentation-browser-for-mac.md": {
	id: "2014/2014-03-03-dash-documentation-browser-for-mac.md";
  slug: "2014/2014-03-03-dash-documentation-browser-for-mac";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-03-10-cloud-ux-dude-wheres-my-file.md": {
	id: "2014/2014-03-10-cloud-ux-dude-wheres-my-file.md";
  slug: "2014/2014-03-10-cloud-ux-dude-wheres-my-file";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-03-17-evolve-sms.md": {
	id: "2014/2014-03-17-evolve-sms.md";
  slug: "2014/2014-03-17-evolve-sms";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-03-19-melbourne-mobile-march-2014.md": {
	id: "2014/2014-03-19-melbourne-mobile-march-2014.md";
  slug: "2014/2014-03-19-melbourne-mobile-march-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-03-22-win-a-ticket-to-civicon-san-francisco-2014.md": {
	id: "2014/2014-03-22-win-a-ticket-to-civicon-san-francisco-2014.md";
  slug: "2014/2014-03-22-win-a-ticket-to-civicon-san-francisco-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-04-07-what-do-you-know-april-2014.md": {
	id: "2014/2014-04-07-what-do-you-know-april-2014.md";
  slug: "2014/2014-04-07-what-do-you-know-april-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-04-17-startup-health-tech-april-2014.md": {
	id: "2014/2014-04-17-startup-health-tech-april-2014.md";
  slug: "2014/2014-04-17-startup-health-tech-april-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-04-29-the-mobile-platforms-to-watch-2014.md": {
	id: "2014/2014-04-29-the-mobile-platforms-to-watch-2014.md";
  slug: "2014/2014-04-29-the-mobile-platforms-to-watch-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-04-30-launch-of-startup-victoria.md": {
	id: "2014/2014-04-30-launch-of-startup-victoria.md";
  slug: "2014/2014-04-30-launch-of-startup-victoria";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-05-18-public-records-mvp-drupal-in-india-and-mobile-entrepreneurs.md": {
	id: "2014/2014-05-18-public-records-mvp-drupal-in-india-and-mobile-entrepreneurs.md";
  slug: "2014/2014-05-18-public-records-mvp-drupal-in-india-and-mobile-entrepreneurs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-06-14-leads-musicians-gear-and-technical-gubbins-for-sale-free.md": {
	id: "2014/2014-06-14-leads-musicians-gear-and-technical-gubbins-for-sale-free.md";
  slug: "2014/2014-06-14-leads-musicians-gear-and-technical-gubbins-for-sale-free";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-07-12-bye-bye-melbourne-hallo-leipzig.md": {
	id: "2014/2014-07-12-bye-bye-melbourne-hallo-leipzig.md";
  slug: "2014/2014-07-12-bye-bye-melbourne-hallo-leipzig";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-07-12-global-space-odyssey-leipzig-2014.md": {
	id: "2014/2014-07-12-global-space-odyssey-leipzig-2014.md";
  slug: "2014/2014-07-12-global-space-odyssey-leipzig-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-07-20-user-experience-behind-always-listening-devices.md": {
	id: "2014/2014-07-20-user-experience-behind-always-listening-devices.md";
  slug: "2014/2014-07-20-user-experience-behind-always-listening-devices";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-07-29-initial-impressions-of-leipzig-and-germany.md": {
	id: "2014/2014-07-29-initial-impressions-of-leipzig-and-germany.md";
  slug: "2014/2014-07-29-initial-impressions-of-leipzig-and-germany";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-08-13-us-small-city-travels.md": {
	id: "2014/2014-08-13-us-small-city-travels.md";
  slug: "2014/2014-08-13-us-small-city-travels";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-08-27-subtle-signs-youre-not-from-round-here.md": {
	id: "2014/2014-08-27-subtle-signs-youre-not-from-round-here.md";
  slug: "2014/2014-08-27-subtle-signs-youre-not-from-round-here";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-08-29-update-on-the-lean-and-agile-nonprofit.md": {
	id: "2014/2014-08-29-update-on-the-lean-and-agile-nonprofit.md";
  slug: "2014/2014-08-29-update-on-the-lean-and-agile-nonprofit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-01-toastmastering-php-and-bike-riding-in-leipzig.md": {
	id: "2014/2014-09-01-toastmastering-php-and-bike-riding-in-leipzig.md";
  slug: "2014/2014-09-01-toastmastering-php-and-bike-riding-in-leipzig";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-07-degrowth-2014-cultural-agency-potentials-and-limits-of-current-civic-movement.md": {
	id: "2014/2014-09-07-degrowth-2014-cultural-agency-potentials-and-limits-of-current-civic-movement.md";
  slug: "2014/2014-09-07-degrowth-2014-cultural-agency-potentials-and-limits-of-current-civic-movement";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-07-degrowth-2014-degrowth-and-history-economics-sustainability-power.md": {
	id: "2014/2014-09-07-degrowth-2014-degrowth-and-history-economics-sustainability-power.md";
  slug: "2014/2014-09-07-degrowth-2014-degrowth-and-history-economics-sustainability-power";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-07-degrowth-2014-friday-keynotes.md": {
	id: "2014/2014-09-07-degrowth-2014-friday-keynotes.md";
  slug: "2014/2014-09-07-degrowth-2014-friday-keynotes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-07-degrowth-2014-shareeconomy-p2p-transition-town-what-do-they-share.md": {
	id: "2014/2014-09-07-degrowth-2014-shareeconomy-p2p-transition-town-what-do-they-share.md";
  slug: "2014/2014-09-07-degrowth-2014-shareeconomy-p2p-transition-town-what-do-they-share";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-07-degrowth-2014-technological-solutions-for-a-degrowth-society.md": {
	id: "2014/2014-09-07-degrowth-2014-technological-solutions-for-a-degrowth-society.md";
  slug: "2014/2014-09-07-degrowth-2014-technological-solutions-for-a-degrowth-society";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-07-degrowth-2014-wednesday-keynotes.md": {
	id: "2014/2014-09-07-degrowth-2014-wednesday-keynotes.md";
  slug: "2014/2014-09-07-degrowth-2014-wednesday-keynotes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-07-degrowth-2014-what-an-introduction.md": {
	id: "2014/2014-09-07-degrowth-2014-what-an-introduction.md";
  slug: "2014/2014-09-07-degrowth-2014-what-an-introduction";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-09-09-apples-special-event-new-iphones.md": {
	id: "2014/2014-09-09-apples-special-event-new-iphones.md";
  slug: "2014/2014-09-09-apples-special-event-new-iphones";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-10-11-drupalcon-amsterdam-2014-report.md": {
	id: "2014/2014-10-11-drupalcon-amsterdam-2014-report.md";
  slug: "2014/2014-10-11-drupalcon-amsterdam-2014-report";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-10-14-setting-up-your-mac-with-vagrant-and-puphpet-for-drupal-development.md": {
	id: "2014/2014-10-14-setting-up-your-mac-with-vagrant-and-puphpet-for-drupal-development.md";
  slug: "2014/2014-10-14-setting-up-your-mac-with-vagrant-and-puphpet-for-drupal-development";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-10-24-techcrunch-disrupt-2014.md": {
	id: "2014/2014-10-24-techcrunch-disrupt-2014.md";
  slug: "2014/2014-10-24-techcrunch-disrupt-2014";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-10-27-creating-your-first-site-with-drupal-8.md": {
	id: "2014/2014-10-27-creating-your-first-site-with-drupal-8.md";
  slug: "2014/2014-10-27-creating-your-first-site-with-drupal-8";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-10-27-hands-on-with-yosemite.md": {
	id: "2014/2014-10-27-hands-on-with-yosemite.md";
  slug: "2014/2014-10-27-hands-on-with-yosemite";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-11-17-documize.md": {
	id: "2014/2014-11-17-documize.md";
  slug: "2014/2014-11-17-documize";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-11-17-wovn-io.md": {
	id: "2014/2014-11-17-wovn-io.md";
  slug: "2014/2014-11-17-wovn-io";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-11-20-answers-against-humanity.md": {
	id: "2014/2014-11-20-answers-against-humanity.md";
  slug: "2014/2014-11-20-answers-against-humanity";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-11-20-core-game-concepts-introduced.md": {
	id: "2014/2014-11-20-core-game-concepts-introduced.md";
  slug: "2014/2014-11-20-core-game-concepts-introduced";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-11-20-the-lean-traveller-alpha-launches.md": {
	id: "2014/2014-11-20-the-lean-traveller-alpha-launches.md";
  slug: "2014/2014-11-20-the-lean-traveller-alpha-launches";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-11-26-costs-and-card-concepts-refined.md": {
	id: "2014/2014-11-26-costs-and-card-concepts-refined.md";
  slug: "2014/2014-11-26-costs-and-card-concepts-refined";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-12-04-hands-on-with-lollipop.md": {
	id: "2014/2014-12-04-hands-on-with-lollipop.md";
  slug: "2014/2014-12-04-hands-on-with-lollipop";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-12-05-dec-5th-updates-manual-concepts-design-and-more.md": {
	id: "2014/2014-12-05-dec-5th-updates-manual-concepts-design-and-more.md";
  slug: "2014/2014-12-05-dec-5th-updates-manual-concepts-design-and-more";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-12-10-7-crm-options-compatible-drupal.md": {
	id: "2014/2014-12-10-7-crm-options-compatible-drupal.md";
  slug: "2014/2014-12-10-7-crm-options-compatible-drupal";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2014/2014-12-11-2014-review-niches-become-mainstream.md": {
	id: "2014/2014-12-11-2014-review-niches-become-mainstream.md";
  slug: "2014/2014-12-11-2014-review-niches-become-mainstream";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-10-dec-19th-updates-refining-concepts.md": {
	id: "2015/2015-01-10-dec-19th-updates-refining-concepts.md";
  slug: "2015/2015-01-10-dec-19th-updates-refining-concepts";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-10-projects-site-redevelopment-complete.md": {
	id: "2015/2015-01-10-projects-site-redevelopment-complete.md";
  slug: "2015/2015-01-10-projects-site-redevelopment-complete";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-12-do-you-need-an-api.md": {
	id: "2015/2015-01-12-do-you-need-an-api.md";
  slug: "2015/2015-01-12-do-you-need-an-api";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-12-site-design-ideas.md": {
	id: "2015/2015-01-12-site-design-ideas.md";
  slug: "2015/2015-01-12-site-design-ideas";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-12-whats-it-all-about-inspirations-voice-style-and-structure.md": {
	id: "2015/2015-01-12-whats-it-all-about-inspirations-voice-style-and-structure.md";
  slug: "2015/2015-01-12-whats-it-all-about-inspirations-voice-style-and-structure";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-13-research-update.md": {
	id: "2015/2015-01-13-research-update.md";
  slug: "2015/2015-01-13-research-update";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-14-illustrating-one-day-the-world-ended.md": {
	id: "2015/2015-01-14-illustrating-one-day-the-world-ended.md";
  slug: "2015/2015-01-14-illustrating-one-day-the-world-ended";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-16-new-categories-added.md": {
	id: "2015/2015-01-16-new-categories-added.md";
  slug: "2015/2015-01-16-new-categories-added";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-20-currently-looking-for-opportunities.md": {
	id: "2015/2015-01-20-currently-looking-for-opportunities.md";
  slug: "2015/2015-01-20-currently-looking-for-opportunities";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-26-android-version-available-on-google-play.md": {
	id: "2015/2015-01-26-android-version-available-on-google-play.md";
  slug: "2015/2015-01-26-android-version-available-on-google-play";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-26-ios-version-on-github.md": {
	id: "2015/2015-01-26-ios-version-on-github.md";
  slug: "2015/2015-01-26-ios-version-on-github";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-26-production-updates-26th-january.md": {
	id: "2015/2015-01-26-production-updates-26th-january.md";
  slug: "2015/2015-01-26-production-updates-26th-january";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-26-review-of-triumph-of-the-nerds-and-kobold-guide-to-board-game-design.md": {
	id: "2015/2015-01-26-review-of-triumph-of-the-nerds-and-kobold-guide-to-board-game-design.md";
  slug: "2015/2015-01-26-review-of-triumph-of-the-nerds-and-kobold-guide-to-board-game-design";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-01-28-creating-the-perfect-tech-and-writing-stack.md": {
	id: "2015/2015-01-28-creating-the-perfect-tech-and-writing-stack.md";
  slug: "2015/2015-01-28-creating-the-perfect-tech-and-writing-stack";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-02-02-effective-pdf-generation-drupal.md": {
	id: "2015/2015-02-02-effective-pdf-generation-drupal.md";
  slug: "2015/2015-02-02-effective-pdf-generation-drupal";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-02-03-one-day-the-world-ended-intro-is-online.md": {
	id: "2015/2015-02-03-one-day-the-world-ended-intro-is-online.md";
  slug: "2015/2015-02-03-one-day-the-world-ended-intro-is-online";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-02-03-review-of-the-iron-heel-by-jack-london.md": {
	id: "2015/2015-02-03-review-of-the-iron-heel-by-jack-london.md";
  slug: "2015/2015-02-03-review-of-the-iron-heel-by-jack-london";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-02-14-payment-and-production-blocks-favicons-and-more.md": {
	id: "2015/2015-02-14-payment-and-production-blocks-favicons-and-more.md";
  slug: "2015/2015-02-14-payment-and-production-blocks-favicons-and-more";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-02-16-its-all-change-again.md": {
	id: "2015/2015-02-16-its-all-change-again.md";
  slug: "2015/2015-02-16-its-all-change-again";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-02-17-finovate-2015-part-mobile-playing-fintech.md": {
	id: "2015/2015-02-17-finovate-2015-part-mobile-playing-fintech.md";
  slug: "2015/2015-02-17-finovate-2015-part-mobile-playing-fintech";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-02-21-new-cards-the-benefits-of-reading-out-loud-switching-to-jekyll-and-more.md": {
	id: "2015/2015-02-21-new-cards-the-benefits-of-reading-out-loud-switching-to-jekyll-and-more.md";
  slug: "2015/2015-02-21-new-cards-the-benefits-of-reading-out-loud-switching-to-jekyll-and-more";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-02-28-book-review-phoenix-the-fall-and-rise-of-videogames.md": {
	id: "2015/2015-02-28-book-review-phoenix-the-fall-and-rise-of-videogames.md";
  slug: "2015/2015-02-28-book-review-phoenix-the-fall-and-rise-of-videogames";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-03-06-mobile-world-congress-2015-roundup.md": {
	id: "2015/2015-03-06-mobile-world-congress-2015-roundup.md";
  slug: "2015/2015-03-06-mobile-world-congress-2015-roundup";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-03-08-regional-focus-concepts-and-opening-up-to-you.md": {
	id: "2015/2015-03-08-regional-focus-concepts-and-opening-up-to-you.md";
  slug: "2015/2015-03-08-regional-focus-concepts-and-opening-up-to-you";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-03-12-battle-royale-koushun-takami.md": {
	id: "2015/2015-03-12-battle-royale-koushun-takami.md";
  slug: "2015/2015-03-12-battle-royale-koushun-takami";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-03-20-first-look-platform-sh-development-deployment-saas.md": {
	id: "2015/2015-03-20-first-look-platform-sh-development-deployment-saas.md";
  slug: "2015/2015-03-20-first-look-platform-sh-development-deployment-saas";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-03-22-add-your-suggestions-to-what-came-next.md": {
	id: "2015/2015-03-22-add-your-suggestions-to-what-came-next.md";
  slug: "2015/2015-03-22-add-your-suggestions-to-what-came-next";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-03-22-confessions-of-the-game-doctor-bill-kunkell.md": {
	id: "2015/2015-03-22-confessions-of-the-game-doctor-bill-kunkell.md";
  slug: "2015/2015-03-22-confessions-of-the-game-doctor-bill-kunkell";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-03-24-dockers-2nd-holiday-in-berlin.md": {
	id: "2015/2015-03-24-dockers-2nd-holiday-in-berlin.md";
  slug: "2015/2015-03-24-dockers-2nd-holiday-in-berlin";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-03-27-how-voipstudio-searches-multiple-cloud-systems-with-crate.io.md": {
	id: "2015/2015-03-27-how-voipstudio-searches-multiple-cloud-systems-with-crate.io.md";
  slug: "2015/2015-03-27-how-voipstudio-searches-multiple-cloud-systems-with-crateio";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-04-06-manual-organised-and-consolidated.md": {
	id: "2015/2015-04-06-manual-organised-and-consolidated.md";
  slug: "2015/2015-04-06-manual-organised-and-consolidated";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-04-11-organise-your-browser-tabs-with-onetab.md": {
	id: "2015/2015-04-11-organise-your-browser-tabs-with-onetab.md";
  slug: "2015/2015-04-11-organise-your-browser-tabs-with-onetab";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-04-12-running-out-of-resources-defining-the-factory-and-accessories.md": {
	id: "2015/2015-04-12-running-out-of-resources-defining-the-factory-and-accessories.md";
  slug: "2015/2015-04-12-running-out-of-resources-defining-the-factory-and-accessories";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-04-21-first-outing-chip-shop-and-writing-about-jesus.md": {
	id: "2015/2015-04-21-first-outing-chip-shop-and-writing-about-jesus.md";
  slug: "2015/2015-04-21-first-outing-chip-shop-and-writing-about-jesus";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-04-27-new-cards-berlin-computer-spiele-museum-and-representing-failure.md": {
	id: "2015/2015-04-27-new-cards-berlin-computer-spiele-museum-and-representing-failure.md";
  slug: "2015/2015-04-27-new-cards-berlin-computer-spiele-museum-and-representing-failure";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-05-13-running-and-managing-crate-with-mesos.md": {
	id: "2015/2015-05-13-running-and-managing-crate-with-mesos.md";
  slug: "2015/2015-05-13-running-and-managing-crate-with-mesos";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-05-16-adding-accessories.md": {
	id: "2015/2015-05-16-adding-accessories.md";
  slug: "2015/2015-05-16-adding-accessories";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-05-16-review-of-the-circle-david-eggers.md": {
	id: "2015/2015-05-16-review-of-the-circle-david-eggers.md";
  slug: "2015/2015-05-16-review-of-the-circle-david-eggers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-06-01-understanding-databases-for-distributd-docker-applicaitons.md": {
	id: "2015/2015-06-01-understanding-databases-for-distributd-docker-applicaitons.md";
  slug: "2015/2015-06-01-understanding-databases-for-distributd-docker-applicaitons";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-06-19-crate-driver-available-for-laravel.md": {
	id: "2015/2015-06-19-crate-driver-available-for-laravel.md";
  slug: "2015/2015-06-19-crate-driver-available-for-laravel";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-07-02-crate.io-a-born-global-champion.md": {
	id: "2015/2015-07-02-crate.io-a-born-global-champion.md";
  slug: "2015/2015-07-02-crateio-a-born-global-champion";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-07-09-goodbye-drupal-hello-jekyll.md": {
	id: "2015/2015-07-09-goodbye-drupal-hello-jekyll.md";
  slug: "2015/2015-07-09-goodbye-drupal-hello-jekyll";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-07-28-Crate-adds-Unicast-host-discovery-via-DNS-and-the-AWS-EC2-API.md": {
	id: "2015/2015-07-28-Crate-adds-Unicast-host-discovery-via-DNS-and-the-AWS-EC2-API.md";
  slug: "2015/2015-07-28-crate-adds-unicast-host-discovery-via-dns-and-the-aws-ec2-api";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-07-29-open-source-presentation.md": {
	id: "2015/2015-07-29-open-source-presentation.md";
  slug: "2015/2015-07-29-open-source-presentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-08-11-creating-a-game-with-markdown-pandoc-latex-and-pdfjam.md": {
	id: "2015/2015-08-11-creating-a-game-with-markdown-pandoc-latex-and-pdfjam.md";
  slug: "2015/2015-08-11-creating-a-game-with-markdown-pandoc-latex-and-pdfjam";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-08-11-video-understanding-android-differences.md": {
	id: "2015/2015-08-11-video-understanding-android-differences.md";
  slug: "2015/2015-08-11-video-understanding-android-differences";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-08-13-running-crate-on-linux-and-windows-with-azure.md": {
	id: "2015/2015-08-13-running-crate-on-linux-and-windows-with-azure.md";
  slug: "2015/2015-08-13-running-crate-on-linux-and-windows-with-azure";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-09-04-watch-a-tour-of-android-studio.md": {
	id: "2015/2015-09-04-watch-a-tour-of-android-studio.md";
  slug: "2015/2015-09-04-watch-a-tour-of-android-studio";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-09-09-nfp-handbook.md": {
	id: "2015/2015-09-09-nfp-handbook.md";
  slug: "2015/2015-09-09-nfp-handbook";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-09-09-watch-structuring-an-android-project.md": {
	id: "2015/2015-09-09-watch-structuring-an-android-project.md";
  slug: "2015/2015-09-09-watch-structuring-an-android-project";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-09-11-versioning-large-files-with-git-lfs.md": {
	id: "2015/2015-09-11-versioning-large-files-with-git-lfs.md";
  slug: "2015/2015-09-11-versioning-large-files-with-git-lfs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-09-16-how-i-became-an-e-resident-of.estonia.md": {
	id: "2015/2015-09-16-how-i-became-an-e-resident-of.estonia.md";
  slug: "2015/2015-09-16-how-i-became-an-e-resident-ofestonia";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-09-21-watch-evolution-androids-ecosystem.md": {
	id: "2015/2015-09-21-watch-evolution-androids-ecosystem.md";
  slug: "2015/2015-09-21-watch-evolution-androids-ecosystem";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-09-30-creating-pdfs-from-markdown-with-pandoc-and-latex.md": {
	id: "2015/2015-09-30-creating-pdfs-from-markdown-with-pandoc-and-latex.md";
  slug: "2015/2015-09-30-creating-pdfs-from-markdown-with-pandoc-and-latex";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-10-19-playtesting-chip-shop.md": {
	id: "2015/2015-10-19-playtesting-chip-shop.md";
  slug: "2015/2015-10-19-playtesting-chip-shop";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-10-23-watch-understanding-android-and-java.md": {
	id: "2015/2015-10-23-watch-understanding-android-and-java.md";
  slug: "2015/2015-10-23-watch-understanding-android-and-java";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-10-26-game-jam-tshirts-printing-and-more.md": {
	id: "2015/2015-10-26-game-jam-tshirts-printing-and-more.md";
  slug: "2015/2015-10-26-game-jam-tshirts-printing-and-more";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-11-10-the-manifest-to-manage-your-metadata.md": {
	id: "2015/2015-11-10-the-manifest-to-manage-your-metadata.md";
  slug: "2015/2015-11-10-the-manifest-to-manage-your-metadata";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-11-10-thoughts-on-play-testing.md": {
	id: "2015/2015-11-10-thoughts-on-play-testing.md";
  slug: "2015/2015-11-10-thoughts-on-play-testing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-11-11-simple-clutter-free-programming-with-go.md": {
	id: "2015/2015-11-11-simple-clutter-free-programming-with-go.md";
  slug: "2015/2015-11-11-simple-clutter-free-programming-with-go";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-11-12-activities-and-intents-the-lego-blocks-of-android.md": {
	id: "2015/2015-11-12-activities-and-intents-the-lego-blocks-of-android.md";
  slug: "2015/2015-11-12-activities-and-intents-the-lego-blocks-of-android";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-11-25-changes-from-play-testing.md": {
	id: "2015/2015-11-25-changes-from-play-testing.md";
  slug: "2015/2015-11-25-changes-from-play-testing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-11-30-backing-up-and-restoring-crate-databases.md": {
	id: "2015/2015-11-30-backing-up-and-restoring-crate-databases.md";
  slug: "2015/2015-11-30-backing-up-and-restoring-crate-databases";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-01-further-changes-from-playtest.md": {
	id: "2015/2015-12-01-further-changes-from-playtest.md";
  slug: "2015/2015-12-01-further-changes-from-playtest";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-01-super-powered-web-services.md": {
	id: "2015/2015-12-01-super-powered-web-services.md";
  slug: "2015/2015-12-01-super-powered-web-services";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-09-iOs-and-Android-Programming-with-Go.md": {
	id: "2015/2015-12-09-iOs-and-Android-Programming-with-Go.md";
  slug: "2015/2015-12-09-ios-and-android-programming-with-go";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-10-interacting-with-browser-content.md": {
	id: "2015/2015-12-10-interacting-with-browser-content.md";
  slug: "2015/2015-12-10-interacting-with-browser-content";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-21-submitting-to-the-chrome-store.md": {
	id: "2015/2015-12-21-submitting-to-the-chrome-store.md";
  slug: "2015/2015-12-21-submitting-to-the-chrome-store";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-22-2015-in-review-new-languages-rising-frameworks-and-more.md": {
	id: "2015/2015-12-22-2015-in-review-new-languages-rising-frameworks-and-more.md";
  slug: "2015/2015-12-22-2015-in-review-new-languages-rising-frameworks-and-more";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-26-a-mind-forever-voyaging.md": {
	id: "2015/2015-12-26-a-mind-forever-voyaging.md";
  slug: "2015/2015-12-26-a-mind-forever-voyaging";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-26-commodore-amiga-visual-companion.md": {
	id: "2015/2015-12-26-commodore-amiga-visual-companion.md";
  slug: "2015/2015-12-26-commodore-amiga-visual-companion";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-27-trello-shortcuts-dash.md": {
	id: "2015/2015-12-27-trello-shortcuts-dash.md";
  slug: "2015/2015-12-27-trello-shortcuts-dash";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2015/2015-12-29-beginning-the-weekly-squeak-wrapping-up-2015.md": {
	id: "2015/2015-12-29-beginning-the-weekly-squeak-wrapping-up-2015.md";
  slug: "2015/2015-12-29-beginning-the-weekly-squeak-wrapping-up-2015";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-05-the-next-full-stack-language-server-side-swift-with-perfect.md": {
	id: "2016/2016-01-05-the-next-full-stack-language-server-side-swift-with-perfect.md";
  slug: "2016/2016-01-05-the-next-full-stack-language-server-side-swift-with-perfect";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-08-estonia-between-eat-west-and-the-world.md": {
	id: "2016/2016-01-08-estonia-between-eat-west-and-the-world.md";
  slug: "2016/2016-01-08-estonia-between-eat-west-and-the-world";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-09-turning-chip-shop-into-a-board-game.md": {
	id: "2016/2016-01-09-turning-chip-shop-into-a-board-game.md";
  slug: "2016/2016-01-09-turning-chip-shop-into-a-board-game";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-11-getting-to-know-volley.md": {
	id: "2016/2016-01-11-getting-to-know-volley.md";
  slug: "2016/2016-01-11-getting-to-know-volley";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-12-blink-a-programmable-indicator-for-developer-needs.md": {
	id: "2016/2016-01-12-blink-a-programmable-indicator-for-developer-needs.md";
  slug: "2016/2016-01-12-blink-a-programmable-indicator-for-developer-needs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-15-how-to-auto-deploy-from-github-to-your-server.md": {
	id: "2016/2016-01-15-how-to-auto-deploy-from-github-to-your-server.md";
  slug: "2016/2016-01-15-how-to-auto-deploy-from-github-to-your-server";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-18-celebrity-death-netflix-vs-digital-nomads-and-introducing-the-enthusiastic-amateur.md": {
	id: "2016/2016-01-18-celebrity-death-netflix-vs-digital-nomads-and-introducing-the-enthusiastic-amateur.md";
  slug: "2016/2016-01-18-celebrity-death-netflix-vs-digital-nomads-and-introducing-the-enthusiastic-amateur";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-18-using-layout-managers-to-craft-awesome-android-interfaces.md": {
	id: "2016/2016-01-18-using-layout-managers-to-craft-awesome-android-interfaces.md";
  slug: "2016/2016-01-18-using-layout-managers-to-craft-awesome-android-interfaces";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-21-display-data-sets-in-indesign-with-porky.md": {
	id: "2016/2016-01-21-display-data-sets-in-indesign-with-porky.md";
  slug: "2016/2016-01-21-display-data-sets-in-indesign-with-porky";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-24-meetup-and-conference-etiquette-revisited.md": {
	id: "2016/2016-01-24-meetup-and-conference-etiquette-revisited.md";
  slug: "2016/2016-01-24-meetup-and-conference-etiquette-revisited";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-27-using-classy-to-create-style-sheets-for-hative-ios-apps.md": {
	id: "2016/2016-01-27-using-classy-to-create-style-sheets-for-hative-ios-apps.md";
  slug: "2016/2016-01-27-using-classy-to-create-style-sheets-for-hative-ios-apps";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-01-28-playtesting-back-open.md": {
	id: "2016/2016-01-28-playtesting-back-open.md";
  slug: "2016/2016-01-28-playtesting-back-open";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-02-03-CR8-a-collection-of-utility-scripts-for-working-with-clusters.md": {
	id: "2016/2016-02-03-CR8-a-collection-of-utility-scripts-for-working-with-clusters.md";
  slug: "2016/2016-02-03-cr8-a-collection-of-utility-scripts-for-working-with-clusters";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-02-03-Ctop-a-top-tool-for-crate-clusters.md": {
	id: "2016/2016-02-03-Ctop-a-top-tool-for-crate-clusters.md";
  slug: "2016/2016-02-03-ctop-a-top-tool-for-crate-clusters";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-02-12-outputting-data-to-the-user-interface.md": {
	id: "2016/2016-02-12-outputting-data-to-the-user-interface.md";
  slug: "2016/2016-02-12-outputting-data-to-the-user-interface";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-02-14-healthy-travel-working-on-the-road-and-the-inefficiency-of-travel.md": {
	id: "2016/2016-02-14-healthy-travel-working-on-the-road-and-the-inefficiency-of-travel.md";
  slug: "2016/2016-02-14-healthy-travel-working-on-the-road-and-the-inefficiency-of-travel";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-02-21-preparing-your-android-app-for-release.md": {
	id: "2016/2016-02-21-preparing-your-android-app-for-release.md";
  slug: "2016/2016-02-21-preparing-your-android-app-for-release";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-02-22-tech-tribes-and-being-an-outsider-amongst-outsiders.md": {
	id: "2016/2016-02-22-tech-tribes-and-being-an-outsider-amongst-outsiders.md";
  slug: "2016/2016-02-22-tech-tribes-and-being-an-outsider-amongst-outsiders";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-02-24-migrating-your-android-or-ios-app-from-parse.md": {
	id: "2016/2016-02-24-migrating-your-android-or-ios-app-from-parse.md";
  slug: "2016/2016-02-24-migrating-your-android-or-ios-app-from-parse";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-03-01-are-you-really-a-tech-company.md": {
	id: "2016/2016-03-01-are-you-really-a-tech-company.md";
  slug: "2016/2016-03-01-are-you-really-a-tech-company";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-03-06-print-at-home-chip-shop-released.md": {
	id: "2016/2016-03-06-print-at-home-chip-shop-released.md";
  slug: "2016/2016-03-06-print-at-home-chip-shop-released";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-03-16-displaying-images-on-your-android-interface.md": {
	id: "2016/2016-03-16-displaying-images-on-your-android-interface.md";
  slug: "2016/2016-03-16-displaying-images-on-your-android-interface";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-03-21-physical-and-mental-health-for-developers.md": {
	id: "2016/2016-03-21-physical-and-mental-health-for-developers.md";
  slug: "2016/2016-03-21-physical-and-mental-health-for-developers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-03-22-understanding-the-docker-ecosystem.md": {
	id: "2016/2016-03-22-understanding-the-docker-ecosystem.md";
  slug: "2016/2016-03-22-understanding-the-docker-ecosystem";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-03-25-past-present-future-swift.md": {
	id: "2016/2016-03-25-past-present-future-swift.md";
  slug: "2016/2016-03-25-past-present-future-swift";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-04-06-A-tourist-in-your-own-city-and-handling-national-shame.md": {
	id: "2016/2016-04-06-A-tourist-in-your-own-city-and-handling-national-shame.md";
  slug: "2016/2016-04-06-a-tourist-in-your-own-city-and-handling-national-shame";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-04-06-managing-data-storage-with-blockchain-and-bigchaindb.md": {
	id: "2016/2016-04-06-managing-data-storage-with-blockchain-and-bigchaindb.md";
  slug: "2016/2016-04-06-managing-data-storage-with-blockchain-and-bigchaindb";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-04-13-real-world-use-cases-of-nosql-databases.md": {
	id: "2016/2016-04-13-real-world-use-cases-of-nosql-databases.md";
  slug: "2016/2016-04-13-real-world-use-cases-of-nosql-databases";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-04-14-the-shortlist-of-docker-hosting.md": {
	id: "2016/2016-04-14-the-shortlist-of-docker-hosting.md";
  slug: "2016/2016-04-14-the-shortlist-of-docker-hosting";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-04-17-a-1001-crate-cluster-with-microsoft-azure.md": {
	id: "2016/2016-04-17-a-1001-crate-cluster-with-microsoft-azure.md";
  slug: "2016/2016-04-17-a-1001-crate-cluster-with-microsoft-azure";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-04-27-dependency-management-with-the-swift-package-manager.md": {
	id: "2016/2016-04-27-dependency-management-with-the-swift-package-manager.md";
  slug: "2016/2016-04-27-dependency-management-with-the-swift-package-manager";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-04-29-a-week-in-berlin-meetups.md": {
	id: "2016/2016-04-29-a-week-in-berlin-meetups.md";
  slug: "2016/2016-04-29-a-week-in-berlin-meetups";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-03-teaching-people-to-code.md": {
	id: "2016/2016-05-03-teaching-people-to-code.md";
  slug: "2016/2016-05-03-teaching-people-to-code";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-20-observations-on-albania-and-australia-in-eurovision.md": {
	id: "2016/2016-05-20-observations-on-albania-and-australia-in-eurovision.md";
  slug: "2016/2016-05-20-observations-on-albania-and-australia-in-eurovision";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-23-desktop-node-apps-with-electron.m.md": {
	id: "2016/2016-05-23-desktop-node-apps-with-electron.m.md";
  slug: "2016/2016-05-23-desktop-node-apps-with-electronm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-24-8-key-announcements-for-android.md": {
	id: "2016/2016-05-24-8-key-announcements-for-android.md";
  slug: "2016/2016-05-24-8-key-announcements-for-android";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-25-an-introduction-to-the-docker-trusted-registry.md": {
	id: "2016/2016-05-25-an-introduction-to-the-docker-trusted-registry.md";
  slug: "2016/2016-05-25-an-introduction-to-the-docker-trusted-registry";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-25-teaching-programming.md": {
	id: "2016/2016-05-25-teaching-programming.md";
  slug: "2016/2016-05-25-teaching-programming";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-30-generation-xbox-how-videogames-invaded-hollywood-by-jamie-russell.md": {
	id: "2016/2016-05-30-generation-xbox-how-videogames-invaded-hollywood-by-jamie-russell.md";
  slug: "2016/2016-05-30-generation-xbox-how-videogames-invaded-hollywood-by-jamie-russell";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-30-the-offline-coding-challenge.md": {
	id: "2016/2016-05-30-the-offline-coding-challenge.md";
  slug: "2016/2016-05-30-the-offline-coding-challenge";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-05-30-the-story-of-english-by-robert-mccrum-robert-macneil.md": {
	id: "2016/2016-05-30-the-story-of-english-by-robert-mccrum-robert-macneil.md";
  slug: "2016/2016-05-30-the-story-of-english-by-robert-mccrum-robert-macneil";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-06-09-what-do-apples-app-store-changes-mean-for-developers.md": {
	id: "2016/2016-06-09-what-do-apples-app-store-changes-mean-for-developers.md";
  slug: "2016/2016-06-09-what-do-apples-app-store-changes-mean-for-developers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-06-11-Bitspiration-in-Warsaw-and-Brexit.md": {
	id: "2016/2016-06-11-Bitspiration-in-Warsaw-and-Brexit.md";
  slug: "2016/2016-06-11-bitspiration-in-warsaw-and-brexit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-06-22-otto-next-generation-vagrant.md": {
	id: "2016/2016-06-22-otto-next-generation-vagrant.md";
  slug: "2016/2016-06-22-otto-next-generation-vagrant";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-06-22-otto-the-next-generation-of-vagrant.md": {
	id: "2016/2016-06-22-otto-the-next-generation-of-vagrant.md";
  slug: "2016/2016-06-22-otto-the-next-generation-of-vagrant";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-06-25-WWhat-a-Fortnight.md": {
	id: "2016/2016-06-25-WWhat-a-Fortnight.md";
  slug: "2016/2016-06-25-wwhat-a-fortnight";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-07-01-which-continuous-integration-tools-support-bitbucket.md": {
	id: "2016/2016-07-01-which-continuous-integration-tools-support-bitbucket.md";
  slug: "2016/2016-07-01-which-continuous-integration-tools-support-bitbucket";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-07-06-rapid-iot-development-with-the-relayr-android-app-and-sdk.md": {
	id: "2016/2016-07-06-rapid-iot-development-with-the-relayr-android-app-and-sdk.md";
  slug: "2016/2016-07-06-rapid-iot-development-with-the-relayr-android-app-and-sdk";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-07-21-an-introduction-to-docker-for-mac.md": {
	id: "2016/2016-07-21-an-introduction-to-docker-for-mac.md";
  slug: "2016/2016-07-21-an-introduction-to-docker-for-mac";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-07-21-introduction-to-docker-for-mac.md": {
	id: "2016/2016-07-21-introduction-to-docker-for-mac.md";
  slug: "2016/2016-07-21-introduction-to-docker-for-mac";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-08-02-whats-new-in-appcode.md": {
	id: "2016/2016-08-02-whats-new-in-appcode.md";
  slug: "2016/2016-08-02-whats-new-in-appcode";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-08-20-communist-and-cultural-effects-on-tech- communities.md": {
	id: "2016/2016-08-20-communist-and-cultural-effects-on-tech- communities.md";
  slug: "2016/2016-08-20-communist-and-cultural-effects-on-tech--communities";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-08-22-editors-friend-for-atom.md": {
	id: "2016/2016-08-22-editors-friend-for-atom.md";
  slug: "2016/2016-08-22-editors-friend-for-atom";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-08-24-a-beginner-s-guide-to-the-dockerfile.md": {
	id: "2016/2016-08-24-a-beginner-s-guide-to-the-dockerfile.md";
  slug: "2016/2016-08-24-a-beginner-s-guide-to-the-dockerfile";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-08-24-medium-exporter-for-atom.md": {
	id: "2016/2016-08-24-medium-exporter-for-atom.md";
  slug: "2016/2016-08-24-medium-exporter-for-atom";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-08-29-building-your-first-blockchain-app-with-eris.md": {
	id: "2016/2016-08-29-building-your-first-blockchain-app-with-eris.md";
  slug: "2016/2016-08-29-building-your-first-blockchain-app-with-eris";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-08-31-making-atom-awesome -my-setup.md": {
	id: "2016/2016-08-31-making-atom-awesome -my-setup.md";
  slug: "2016/2016-08-31-making-atom-awesome-my-setup";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-09-06-the-weekly-squeak-9th-september.md": {
	id: "2016/2016-09-06-the-weekly-squeak-9th-september.md";
  slug: "2016/2016-09-06-the-weekly-squeak-9th-september";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-09-12-exploring-the-evive.md": {
	id: "2016/2016-09-12-exploring-the-evive.md";
  slug: "2016/2016-09-12-exploring-the-evive";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-09-16-from-ukge-to-essen.md": {
	id: "2016/2016-09-16-from-ukge-to-essen.md";
  slug: "2016/2016-09-16-from-ukge-to-essen";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-09-18-the-weekly-squeak-18th-september.md": {
	id: "2016/2016-09-18-the-weekly-squeak-18th-september.md";
  slug: "2016/2016-09-18-the-weekly-squeak-18th-september";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-09-22-an-introduction-to-coreos.md": {
	id: "2016/2016-09-22-an-introduction-to-coreos.md";
  slug: "2016/2016-09-22-an-introduction-to-coreos";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-10-07-developing-add-ons-for-enterprise-apps-like-jira.md": {
	id: "2016/2016-10-07-developing-add-ons-for-enterprise-apps-like-jira.md";
  slug: "2016/2016-10-07-developing-add-ons-for-enterprise-apps-like-jira";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-10-08-from-belgrade-to-berlin.md": {
	id: "2016/2016-10-08-from-belgrade-to-berlin.md";
  slug: "2016/2016-10-08-from-belgrade-to-berlin";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-10-11-a-documentation-crash-course.md": {
	id: "2016/2016-10-11-a-documentation-crash-course.md";
  slug: "2016/2016-10-11-a-documentation-crash-course";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-10-18-how-i-wrote-the-atom-medium-exporter-and-how-you-can-help-make-it-better.md": {
	id: "2016/2016-10-18-how-i-wrote-the-atom-medium-exporter-and-how-you-can-help-make-it-better.md";
  slug: "2016/2016-10-18-how-i-wrote-the-atom-medium-exporter-and-how-you-can-help-make-it-better";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-10-25-hands-on-with-the-yoga-book.md": {
	id: "2016/2016-10-25-hands-on-with-the-yoga-book.md";
  slug: "2016/2016-10-25-hands-on-with-the-yoga-book";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-10-27-hello-again-from-apple.md": {
	id: "2016/2016-10-27-hello-again-from-apple.md";
  slug: "2016/2016-10-27-hello-again-from-apple";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-11-16-web-summit-2016-iot-learning-chatbots-biohacking.md": {
	id: "2016/2016-11-16-web-summit-2016-iot-learning-chatbots-biohacking.md";
  slug: "2016/2016-11-16-web-summit-2016-iot-learning-chatbots-biohacking";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-11-23-improve-documentation-by-automating-spelling-and-.md": {
	id: "2016/2016-11-23-improve-documentation-by-automating-spelling-and-.md";
  slug: "2016/2016-11-23-improve-documentation-by-automating-spelling-and-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-12-11-my-problems-with-this-time-of-year.md": {
	id: "2016/2016-12-11-my-problems-with-this-time-of-year.md";
  slug: "2016/2016-12-11-my-problems-with-this-time-of-year";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-12-20-tech-your-privilege-at-the-door.md": {
	id: "2016/2016-12-20-tech-your-privilege-at-the-door.md";
  slug: "2016/2016-12-20-tech-your-privilege-at-the-door";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-12-21-testing-code-examples-in-documentation.md": {
	id: "2016/2016-12-21-testing-code-examples-in-documentation.md";
  slug: "2016/2016-12-21-testing-code-examples-in-documentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2016/2016-12-29-2016-in-review.md": {
	id: "2016/2016-12-29-2016-in-review.md";
  slug: "2016/2016-12-29-2016-in-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-01-05-build-and-program-with-sam-labs-curious-cars.md": {
	id: "2017/2017-01-05-build-and-program-with-sam-labs-curious-cars.md";
  slug: "2017/2017-01-05-build-and-program-with-sam-labs-curious-cars";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-01-13-a-switchers-tale-my-week-with-windows.md": {
	id: "2017/2017-01-13-a-switchers-tale-my-week-with-windows.md";
  slug: "2017/2017-01-13-a-switchers-tale-my-week-with-windows";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-01-17-java-free-android.md": {
	id: "2017/2017-01-17-java-free-android.md";
  slug: "2017/2017-01-17-java-free-android";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-01-20-build-native-apps-in-the-browser-with-configure-it.md": {
	id: "2017/2017-01-20-build-native-apps-in-the-browser-with-configure-it.md";
  slug: "2017/2017-01-20-build-native-apps-in-the-browser-with-configure-it";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-01-31-automating-screenshots-in-documentation.md": {
	id: "2017/2017-01-31-automating-screenshots-in-documentation.md";
  slug: "2017/2017-01-31-automating-screenshots-in-documentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-02-07-a-switchers-tale-my-weeks-with-linux.md": {
	id: "2017/2017-02-07-a-switchers-tale-my-weeks-with-linux.md";
  slug: "2017/2017-02-07-a-switchers-tale-my-weeks-with-linux";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-02-16-from-hackathon-to-help-system.md": {
	id: "2017/2017-02-16-from-hackathon-to-help-system.md";
  slug: "2017/2017-02-16-from-hackathon-to-help-system";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-02-23-setapp-aims-to-solve-the-app-problem-for-macs.md": {
	id: "2017/2017-02-23-setapp-aims-to-solve-the-app-problem-for-macs.md";
  slug: "2017/2017-02-23-setapp-aims-to-solve-the-app-problem-for-macs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-02-28-preventing-sql-injections-and-other-vulnerabilities-in-python.md": {
	id: "2017/2017-02-28-preventing-sql-injections-and-other-vulnerabilities-in-python.md";
  slug: "2017/2017-02-28-preventing-sql-injections-and-other-vulnerabilities-in-python";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-02-mobile-world-congress-2017.md": {
	id: "2017/2017-03-02-mobile-world-congress-2017.md";
  slug: "2017/2017-03-02-mobile-world-congress-2017";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-02-sydney-event-transitioning-into-api-technical-wri.md": {
	id: "2017/2017-03-02-sydney-event-transitioning-into-api-technical-wri.md";
  slug: "2017/2017-03-02-sydney-event-transitioning-into-api-technical-wri";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-04-the-highlights-of-mobile-world-congress-2017.md": {
	id: "2017/2017-03-04-the-highlights-of-mobile-world-congress-2017.md";
  slug: "2017/2017-03-04-the-highlights-of-mobile-world-congress-2017";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-09-teaching-children-to-code.md": {
	id: "2017/2017-03-09-teaching-children-to-code.md";
  slug: "2017/2017-03-09-teaching-children-to-code";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-10-whats-next-google-announces-new-features-for-its-cloud.md": {
	id: "2017/2017-03-10-whats-next-google-announces-new-features-for-its-cloud.md";
  slug: "2017/2017-03-10-whats-next-google-announces-new-features-for-its-cloud";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-14-docker-secrets-management.md": {
	id: "2017/2017-03-14-docker-secrets-management.md";
  slug: "2017/2017-03-14-docker-secrets-management";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-19-berlin-the-blockchain-capital-of-the-world.md": {
	id: "2017/2017-03-19-berlin-the-blockchain-capital-of-the-world.md";
  slug: "2017/2017-03-19-berlin-the-blockchain-capital-of-the-world";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-21-the-internet-of-industrial-things.md": {
	id: "2017/2017-03-21-the-internet-of-industrial-things.md";
  slug: "2017/2017-03-21-the-internet-of-industrial-things";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-03-28-cebit-2017-business-as-usual.md": {
	id: "2017/2017-03-28-cebit-2017-business-as-usual.md";
  slug: "2017/2017-03-28-cebit-2017-business-as-usual";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-04-enterprising-israel.md": {
	id: "2017/2017-04-04-enterprising-israel.md";
  slug: "2017/2017-04-04-enterprising-israel";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-04-tech-salary-trends-2017.md": {
	id: "2017/2017-04-04-tech-salary-trends-2017.md";
  slug: "2017/2017-04-04-tech-salary-trends-2017";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-05-about-ship-at-docker.md": {
	id: "2017/2017-04-05-about-ship-at-docker.md";
  slug: "2017/2017-04-05-about-ship-at-docker";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-11-jvm-free-kotlin-with-kotlinnative.md": {
	id: "2017/2017-04-11-jvm-free-kotlin-with-kotlinnative.md";
  slug: "2017/2017-04-11-jvm-free-kotlin-with-kotlinnative";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-11-realities-challenges-digital-nomad.md": {
	id: "2017/2017-04-11-realities-challenges-digital-nomad.md";
  slug: "2017/2017-04-11-realities-challenges-digital-nomad";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-14-preventing-sql-injections-in-ruby.md": {
	id: "2017/2017-04-14-preventing-sql-injections-in-ruby.md";
  slug: "2017/2017-04-14-preventing-sql-injections-in-ruby";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-17-real-time-ocr-for-mobile-apps-with-rtr-sdk.md": {
	id: "2017/2017-04-17-real-time-ocr-for-mobile-apps-with-rtr-sdk.md";
  slug: "2017/2017-04-17-real-time-ocr-for-mobile-apps-with-rtr-sdk";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-18-docker-for-windows-linux-and-mac.md": {
	id: "2017/2017-04-18-docker-for-windows-linux-and-mac.md";
  slug: "2017/2017-04-18-docker-for-windows-linux-and-mac";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-21-an-introduction-to-speech-synthesis-markup-language.md": {
	id: "2017/2017-04-21-an-introduction-to-speech-synthesis-markup-language.md";
  slug: "2017/2017-04-21-an-introduction-to-speech-synthesis-markup-language";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-28-smarter-app-notifications-with-openback.md": {
	id: "2017/2017-04-28-smarter-app-notifications-with-openback.md";
  slug: "2017/2017-04-28-smarter-app-notifications-with-openback";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-04-29-a-developers-guide-to-better-presentations-part-1-stage-craft.md": {
	id: "2017/2017-04-29-a-developers-guide-to-better-presentations-part-1-stage-craft.md";
  slug: "2017/2017-04-29-a-developers-guide-to-better-presentations-part-1-stage-craft";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-05-17-bucharest-a-crash-course-in-software-craftsm.md": {
	id: "2017/2017-05-17-bucharest-a-crash-course-in-software-craftsm.md";
  slug: "2017/2017-05-17-bucharest-a-crash-course-in-software-craftsm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-05-19-feeling-fabulous-with-queer-tech.md": {
	id: "2017/2017-05-19-feeling-fabulous-with-queer-tech.md";
  slug: "2017/2017-05-19-feeling-fabulous-with-queer-tech";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-05-21-mobile-and-web-app-testing-with-sauce-labs.md": {
	id: "2017/2017-05-21-mobile-and-web-app-testing-with-sauce-labs.md";
  slug: "2017/2017-05-21-mobile-and-web-app-testing-with-sauce-labs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-05-24-ci-workflows-and-bots.md": {
	id: "2017/2017-05-24-ci-workflows-and-bots.md";
  slug: "2017/2017-05-24-ci-workflows-and-bots";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-05-27-interview-with-manish-gupta-of-redis-labs.md": {
	id: "2017/2017-05-27-interview-with-manish-gupta-of-redis-labs.md";
  slug: "2017/2017-05-27-interview-with-manish-gupta-of-redis-labs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-05-29-paddle-merges-with-devmate.md": {
	id: "2017/2017-05-29-paddle-merges-with-devmate.md";
  slug: "2017/2017-05-29-paddle-merges-with-devmate";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-05-31-pilosa-a-new-kind-of-database-index-interview.md": {
	id: "2017/2017-05-31-pilosa-a-new-kind-of-database-index-interview.md";
  slug: "2017/2017-05-31-pilosa-a-new-kind-of-database-index-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-04-founder-of-opera-and-vivaldi-jon-stephenson-von-t.md": {
	id: "2017/2017-06-04-founder-of-opera-and-vivaldi-jon-stephenson-von-t.md";
  slug: "2017/2017-06-04-founder-of-opera-and-vivaldi-jon-stephenson-von-t";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-12-huwawei-p10-a-powerful-small-package.md": {
	id: "2017/2017-06-12-huwawei-p10-a-powerful-small-package.md";
  slug: "2017/2017-06-12-huwawei-p10-a-powerful-small-package";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-18-screeps-the-mmo-sandbox-game-for-programmers.md": {
	id: "2017/2017-06-18-screeps-the-mmo-sandbox-game-for-programmers.md";
  slug: "2017/2017-06-18-screeps-the-mmo-sandbox-game-for-programmers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-19-chatting-with-chip-childers-cto-of-cloud-foundry.md": {
	id: "2017/2017-06-19-chatting-with-chip-childers-cto-of-cloud-foundry.md";
  slug: "2017/2017-06-19-chatting-with-chip-childers-cto-of-cloud-foundry";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-19-chip-childers-cto-of-cloud-foundry.md": {
	id: "2017/2017-06-19-chip-childers-cto-of-cloud-foundry.md";
  slug: "2017/2017-06-19-chip-childers-cto-of-cloud-foundry";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-20-hashicorp-tools-useful-for-continuous-integration.md": {
	id: "2017/2017-06-20-hashicorp-tools-useful-for-continuous-integration.md";
  slug: "2017/2017-06-20-hashicorp-tools-useful-for-continuous-integration";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-21-how-to-automatically-track-your-time-and-productivity-with-timing-app.md": {
	id: "2017/2017-06-21-how-to-automatically-track-your-time-and-productivity-with-timing-app.md";
  slug: "2017/2017-06-21-how-to-automatically-track-your-time-and-productivity-with-timing-app";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-26-hashicorp-tools-useful-for-continuous-integration.md": {
	id: "2017/2017-06-26-hashicorp-tools-useful-for-continuous-integration.md";
  slug: "2017/2017-06-26-hashicorp-tools-useful-for-continuous-integration";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-28-docker-monitoring-5-methods-for-monitoring-java-applications-in-docker.md": {
	id: "2017/2017-06-28-docker-monitoring-5-methods-for-monitoring-java-applications-in-docker.md";
  slug: "2017/2017-06-28-docker-monitoring-5-methods-for-monitoring-java-applications-in-docker";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-06-30-pravin-halady-of-nodesource-enterprise-ready-node.md": {
	id: "2017/2017-06-30-pravin-halady-of-nodesource-enterprise-ready-node.md";
  slug: "2017/2017-06-30-pravin-halady-of-nodesource-enterprise-ready-node";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-01-pioneering-education-biotech-and-blockchain-podca.md": {
	id: "2017/2017-07-01-pioneering-education-biotech-and-blockchain-podca.md";
  slug: "2017/2017-07-01-pioneering-education-biotech-and-blockchain-podca";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-06-pravin-halady-of-nodesource-enterprise-ready-nodejs.md": {
	id: "2017/2017-07-06-pravin-halady-of-nodesource-enterprise-ready-nodejs.md";
  slug: "2017/2017-07-06-pravin-halady-of-nodesource-enterprise-ready-nodejs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-07-hyperledger-s-brian-behlendorf-blockchain-for-bus.md": {
	id: "2017/2017-07-07-hyperledger-s-brian-behlendorf-blockchain-for-bus.md";
  slug: "2017/2017-07-07-hyperledger-s-brian-behlendorf-blockchain-for-bus";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-11-must-listen-software-engineering-podcast-episodes.md": {
	id: "2017/2017-07-11-must-listen-software-engineering-podcast-episodes.md";
  slug: "2017/2017-07-11-must-listen-software-engineering-podcast-episodes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-12-a-comparison-of-docker-guis.md": {
	id: "2017/2017-07-12-a-comparison-of-docker-guis.md";
  slug: "2017/2017-07-12-a-comparison-of-docker-guis";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-17-startupbootcamp-demo-day-transport-energy.md": {
	id: "2017/2017-07-17-startupbootcamp-demo-day-transport-energy.md";
  slug: "2017/2017-07-17-startupbootcamp-demo-day-transport-energy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-18-helping-make-open-source-secure-compliant-and-sus.md": {
	id: "2017/2017-07-18-helping-make-open-source-secure-compliant-and-sus.md";
  slug: "2017/2017-07-18-helping-make-open-source-secure-compliant-and-sus";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-18-lucas-carlson-of-automic-taking-devops-beyond-dev.md": {
	id: "2017/2017-07-18-lucas-carlson-of-automic-taking-devops-beyond-dev.md";
  slug: "2017/2017-07-18-lucas-carlson-of-automic-taking-devops-beyond-dev";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-19-a-comparison-of-docker-guis.md": {
	id: "2017/2017-07-19-a-comparison-of-docker-guis.md";
  slug: "2017/2017-07-19-a-comparison-of-docker-guis";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-19-postman-pro-features-now-free-for-smaller-project.md": {
	id: "2017/2017-07-19-postman-pro-features-now-free-for-smaller-project.md";
  slug: "2017/2017-07-19-postman-pro-features-now-free-for-smaller-project";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-21-affect-tech-society-interview-yael-eisenstat.md": {
	id: "2017/2017-07-21-affect-tech-society-interview-yael-eisenstat.md";
  slug: "2017/2017-07-21-affect-tech-society-interview-yael-eisenstat";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-21-becoming-the-first-cyborgs-with-liviu-babitz.md": {
	id: "2017/2017-07-21-becoming-the-first-cyborgs-with-liviu-babitz.md";
  slug: "2017/2017-07-21-becoming-the-first-cyborgs-with-liviu-babitz";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-26-getting-started-podcasting-mac.md": {
	id: "2017/2017-07-26-getting-started-podcasting-mac.md";
  slug: "2017/2017-07-26-getting-started-podcasting-mac";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-26-steadily-serving-the-web-for-12-years-liam-crilly.md": {
	id: "2017/2017-07-26-steadily-serving-the-web-for-12-years-liam-crilly.md";
  slug: "2017/2017-07-26-steadily-serving-the-web-for-12-years-liam-crilly";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-07-28-heroku-logging-coralogix.md": {
	id: "2017/2017-07-28-heroku-logging-coralogix.md";
  slug: "2017/2017-07-28-heroku-logging-coralogix";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-08-10-scrimba-a-new-way-to-teach-and-learn-code.md": {
	id: "2017/2017-08-10-scrimba-a-new-way-to-teach-and-learn-code.md";
  slug: "2017/2017-08-10-scrimba-a-new-way-to-teach-and-learn-code";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-08-11-indiastack-disrupting-the-second-most-populous-na.md": {
	id: "2017/2017-08-11-indiastack-disrupting-the-second-most-populous-na.md";
  slug: "2017/2017-08-11-indiastack-disrupting-the-second-most-populous-na";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-08-18-pepperdata-bringing-devops-practices-to-the-big-d.md": {
	id: "2017/2017-08-18-pepperdata-bringing-devops-practices-to-the-big-d.md";
  slug: "2017/2017-08-18-pepperdata-bringing-devops-practices-to-the-big-d";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-08-21-how-get-started-computer-science-course-roundup.md": {
	id: "2017/2017-08-21-how-get-started-computer-science-course-roundup.md";
  slug: "2017/2017-08-21-how-get-started-computer-science-course-roundup";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-08-23-bringing-devops-practices-to-database-administrat.md": {
	id: "2017/2017-08-23-bringing-devops-practices-to-database-administrat.md";
  slug: "2017/2017-08-23-bringing-devops-practices-to-database-administrat";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-08-23-tools-and-practices-for-documenting-microservices.md": {
	id: "2017/2017-08-23-tools-and-practices-for-documenting-microservices.md";
  slug: "2017/2017-08-23-tools-and-practices-for-documenting-microservices";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-08-30-bringing-touch-bar-support-to-the-atom-text-edito.md": {
	id: "2017/2017-08-30-bringing-touch-bar-support-to-the-atom-text-edito.md";
  slug: "2017/2017-08-30-bringing-touch-bar-support-to-the-atom-text-edito";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-09-06-data-science-in-a-box-with-dataiku.md": {
	id: "2017/2017-09-06-data-science-in-a-box-with-dataiku.md";
  slug: "2017/2017-09-06-data-science-in-a-box-with-dataiku";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-09-08-blockwatch-demystifying-the-ico.md": {
	id: "2017/2017-09-08-blockwatch-demystifying-the-ico.md";
  slug: "2017/2017-09-08-blockwatch-demystifying-the-ico";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-09-15-ifa-berlin-2017-full-of-smarts.md": {
	id: "2017/2017-09-15-ifa-berlin-2017-full-of-smarts.md";
  slug: "2017/2017-09-15-ifa-berlin-2017-full-of-smarts";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-09-18-sencha-releases-extreact-bringing-their-custom-co.md": {
	id: "2017/2017-09-18-sencha-releases-extreact-bringing-their-custom-co.md";
  slug: "2017/2017-09-18-sencha-releases-extreact-bringing-their-custom-co";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-09-19-does-graphql-reduce-the-need-for-documentation.md": {
	id: "2017/2017-09-19-does-graphql-reduce-the-need-for-documentation.md";
  slug: "2017/2017-09-19-does-graphql-reduce-the-need-for-documentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-09-26-does-graphql-reduce-the-need-for-documentation.md": {
	id: "2017/2017-09-26-does-graphql-reduce-the-need-for-documentation.md";
  slug: "2017/2017-09-26-does-graphql-reduce-the-need-for-documentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-09-28-blockwatch-cryptogovernment-and-blockchain-market.md": {
	id: "2017/2017-09-28-blockwatch-cryptogovernment-and-blockchain-market.md";
  slug: "2017/2017-09-28-blockwatch-cryptogovernment-and-blockchain-market";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-09-28-node-logging-best-practices-tips.md": {
	id: "2017/2017-09-28-node-logging-best-practices-tips.md";
  slug: "2017/2017-09-28-node-logging-best-practices-tips";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-10-02-thierry-carrez-on-the-release-of-openstack-pike-p.md": {
	id: "2017/2017-10-02-thierry-carrez-on-the-release-of-openstack-pike-p.md";
  slug: "2017/2017-10-02-thierry-carrez-on-the-release-of-openstack-pike-p";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-10-03-a-guide-to-ubuntu-core-and-snaps.md": {
	id: "2017/2017-10-03-a-guide-to-ubuntu-core-and-snaps.md";
  slug: "2017/2017-10-03-a-guide-to-ubuntu-core-and-snaps";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-10-13-blockwatch-the-9984-summit.md": {
	id: "2017/2017-10-13-blockwatch-the-9984-summit.md";
  slug: "2017/2017-10-13-blockwatch-the-9984-summit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-10-16-github-universe-2017-collaboration-and-communicat.md": {
	id: "2017/2017-10-16-github-universe-2017-collaboration-and-communicat.md";
  slug: "2017/2017-10-16-github-universe-2017-collaboration-and-communicat";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-10-19-an-overview-of-the-kontena-platform.md": {
	id: "2017/2017-10-19-an-overview-of-the-kontena-platform.md";
  slug: "2017/2017-10-19-an-overview-of-the-kontena-platform";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-10-23-human-side-ops.md": {
	id: "2017/2017-10-23-human-side-ops.md";
  slug: "2017/2017-10-23-human-side-ops";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-10-24-managing-your-business-apps-with-apperian-an-inte.md": {
	id: "2017/2017-10-24-managing-your-business-apps-with-apperian-an-inte.md";
  slug: "2017/2017-10-24-managing-your-business-apps-with-apperian-an-inte";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-10-27-how-to-program-a-robot-interview.md": {
	id: "2017/2017-10-27-how-to-program-a-robot-interview.md";
  slug: "2017/2017-10-27-how-to-program-a-robot-interview";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-01-Ukraine--on-the-edge-of-something-and-somewhere-3068ec4db148.md": {
	id: "2017/2017-11-01-Ukraine--on-the-edge-of-something-and-somewhere-3068ec4db148.md";
  slug: "2017/2017-11-01-ukraine--on-the-edge-of-something-and-somewhere-3068ec4db148";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-06-are-we-all-doomed-your-role-in-the-ethics-of-tech.md": {
	id: "2017/2017-11-06-are-we-all-doomed-your-role-in-the-ethics-of-tech.md";
  slug: "2017/2017-11-06-are-we-all-doomed-your-role-in-the-ethics-of-tech";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-08-complex-event-processing-with-flink-an-update-on-.md": {
	id: "2017/2017-11-08-complex-event-processing-with-flink-an-update-on-.md";
  slug: "2017/2017-11-08-complex-event-processing-with-flink-an-update-on-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-10-a-writer-s-guide-to-conversational-interfaces.md": {
	id: "2017/2017-11-10-a-writer-s-guide-to-conversational-interfaces.md";
  slug: "2017/2017-11-10-a-writer-s-guide-to-conversational-interfaces";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-10-what-can-musicians-and-programmers-learn-from-eac.md": {
	id: "2017/2017-11-10-what-can-musicians-and-programmers-learn-from-eac.md";
  slug: "2017/2017-11-10-what-can-musicians-and-programmers-learn-from-eac";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-11-ruby-logging-best-practices-tips.md": {
	id: "2017/2017-11-11-ruby-logging-best-practices-tips.md";
  slug: "2017/2017-11-11-ruby-logging-best-practices-tips";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-18-blockwatch-tools-for-working-with-solidity.md": {
	id: "2017/2017-11-18-blockwatch-tools-for-working-with-solidity.md";
  slug: "2017/2017-11-18-blockwatch-tools-for-working-with-solidity";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-27-graphcool-the-graphql-backend-development-framewo.md": {
	id: "2017/2017-11-27-graphcool-the-graphql-backend-development-framewo.md";
  slug: "2017/2017-11-27-graphcool-the-graphql-backend-development-framewo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-27-wtd-episode-11-combining-forces-for-documentation.md": {
	id: "2017/2017-11-27-wtd-episode-11-combining-forces-for-documentation.md";
  slug: "2017/2017-11-27-wtd-episode-11-combining-forces-for-documentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-11-29-going-serverless-compare-your-faas-options.md": {
	id: "2017/2017-11-29-going-serverless-compare-your-faas-options.md";
  slug: "2017/2017-11-29-going-serverless-compare-your-faas-options";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-04-creating-augmented-reality-and-iot-experiences-wi.md": {
	id: "2017/2017-12-04-creating-augmented-reality-and-iot-experiences-wi.md";
  slug: "2017/2017-12-04-creating-augmented-reality-and-iot-experiences-wi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-05-going-serverless-compare-your-faas-options.md": {
	id: "2017/2017-12-05-going-serverless-compare-your-faas-options.md";
  slug: "2017/2017-12-05-going-serverless-compare-your-faas-options";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-06-yow-conferences-for-australian-developers-by-deve.md": {
	id: "2017/2017-12-06-yow-conferences-for-australian-developers-by-deve.md";
  slug: "2017/2017-12-06-yow-conferences-for-australian-developers-by-deve";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-13-an-interview-with-circleci-cto-rob-zuber-audio.md": {
	id: "2017/2017-12-13-an-interview-with-circleci-cto-rob-zuber-audio.md";
  slug: "2017/2017-12-13-an-interview-with-circleci-cto-rob-zuber-audio";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-26-an-overview-of-the-kontena-platform.md": {
	id: "2017/2017-12-26-an-overview-of-the-kontena-platform.md";
  slug: "2017/2017-12-26-an-overview-of-the-kontena-platform";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-27-2017-in-review.md": {
	id: "2017/2017-12-27-2017-in-review.md";
  slug: "2017/2017-12-27-2017-in-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-27-habitat-from-chef-build-deploy-and-manage-your-cl.md": {
	id: "2017/2017-12-27-habitat-from-chef-build-deploy-and-manage-your-cl.md";
  slug: "2017/2017-12-27-habitat-from-chef-build-deploy-and-manage-your-cl";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-28-distributing-operational-knowledge-across-a-team.md": {
	id: "2017/2017-12-28-distributing-operational-knowledge-across-a-team.md";
  slug: "2017/2017-12-28-distributing-operational-knowledge-across-a-team";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2017/2017-12-31-blockwatch-berlin-blockchain-day-panel-podcast.md": {
	id: "2017/2017-12-31-blockwatch-berlin-blockchain-day-panel-podcast.md";
  slug: "2017/2017-12-31-blockwatch-berlin-blockchain-day-panel-podcast";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-01-04-adding-a-cms-to-your-static-site-with-netlify-cms.md": {
	id: "2018/2018-01-04-adding-a-cms-to-your-static-site-with-netlify-cms.md";
  slug: "2018/2018-01-04-adding-a-cms-to-your-static-site-with-netlify-cms";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-01-04-apache-flink-in-2017-year-in-review.md": {
	id: "2018/2018-01-04-apache-flink-in-2017-year-in-review.md";
  slug: "2018/2018-01-04-apache-flink-in-2017-year-in-review";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-01-06-distributing-operational-knowledge-across-a-team.md": {
	id: "2018/2018-01-06-distributing-operational-knowledge-across-a-team.md";
  slug: "2018/2018-01-06-distributing-operational-knowledge-across-a-team";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-01-11-how-to-size-your-apache-flink-cluster-a-back-of-t.md": {
	id: "2018/2018-01-11-how-to-size-your-apache-flink-cluster-a-back-of-t.md";
  slug: "2018/2018-01-11-how-to-size-your-apache-flink-cluster-a-back-of-t";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-01-14-create-cross-platform-voice-applications-with-jov.md": {
	id: "2018/2018-01-14-create-cross-platform-voice-applications-with-jov.md";
  slug: "2018/2018-01-14-create-cross-platform-voice-applications-with-jov";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-01-18-container-and-serverless-predictions-for-2018-wit.md": {
	id: "2018/2018-01-18-container-and-serverless-predictions-for-2018-wit.md";
  slug: "2018/2018-01-18-container-and-serverless-predictions-for-2018-wit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-01-23-managing-large-state-in-apache-flink-an-intro-to-checkpointing.md": {
	id: "2018/2018-01-23-managing-large-state-in-apache-flink-an-intro-to-checkpointing.md";
  slug: "2018/2018-01-23-managing-large-state-in-apache-flink-an-intro-to-checkpointing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-01-30-optimize-your-cloud-native-infrastructure-with-re.md": {
	id: "2018/2018-01-30-optimize-your-cloud-native-infrastructure-with-re.md";
  slug: "2018/2018-01-30-optimize-your-cloud-native-infrastructure-with-re";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-02-01-a-roundup-of-managed-kubernetes-platforms.md": {
	id: "2018/2018-02-01-a-roundup-of-managed-kubernetes-platforms.md";
  slug: "2018/2018-02-01-a-roundup-of-managed-kubernetes-platforms";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-02-07-what-will-red-hat-acquiring-coreos-mean-for-the-k.md": {
	id: "2018/2018-02-07-what-will-red-hat-acquiring-coreos-mean-for-the-k.md";
  slug: "2018/2018-02-07-what-will-red-hat-acquiring-coreos-mean-for-the-k";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-02-08-blockwatch-what-is-a-decentralized-exchange.md": {
	id: "2018/2018-02-08-blockwatch-what-is-a-decentralized-exchange.md";
  slug: "2018/2018-02-08-blockwatch-what-is-a-decentralized-exchange";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-02-16-lint-lint-and-away-linters-for-the-english-langua.md": {
	id: "2018/2018-02-16-lint-lint-and-away-linters-for-the-english-langua.md";
  slug: "2018/2018-02-16-lint-lint-and-away-linters-for-the-english-langua";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-02-18-aiva-the-artificial-intelligence-composer.md": {
	id: "2018/2018-02-18-aiva-the-artificial-intelligence-composer.md";
  slug: "2018/2018-02-18-aiva-the-artificial-intelligence-composer";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-02-22-embracing-the-chaos-of-chaos-engineering.md": {
	id: "2018/2018-02-22-embracing-the-chaos-of-chaos-engineering.md";
  slug: "2018/2018-02-22-embracing-the-chaos-of-chaos-engineering";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-02-an-interview-with-brian-gracely-on-red-hat-s-acqu.md": {
	id: "2018/2018-03-02-an-interview-with-brian-gracely-on-red-hat-s-acqu.md";
  slug: "2018/2018-03-02-an-interview-with-brian-gracely-on-red-hat-s-acqu";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-06-mobile-world-congress-2018-consolidation-and-coll.md": {
	id: "2018/2018-03-06-mobile-world-congress-2018-consolidation-and-coll.md";
  slug: "2018/2018-03-06-mobile-world-congress-2018-consolidation-and-coll";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-06-switchbot-a-smart-home-for-everyone.md": {
	id: "2018/2018-03-06-switchbot-a-smart-home-for-everyone.md";
  slug: "2018/2018-03-06-switchbot-a-smart-home-for-everyone";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-07-an-interview-with-brian-gracely-on-red-hat-s-acqu.md": {
	id: "2018/2018-03-07-an-interview-with-brian-gracely-on-red-hat-s-acqu.md";
  slug: "2018/2018-03-07-an-interview-with-brian-gracely-on-red-hat-s-acqu";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-11-docfx-the-next-documentation-tool-to-consider.md": {
	id: "2018/2018-03-11-docfx-the-next-documentation-tool-to-consider.md";
  slug: "2018/2018-03-11-docfx-the-next-documentation-tool-to-consider";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-16-utorial-using-the-messenger-webview-to-create-richer-bot-to-user-interactions.md": {
	id: "2018/2018-03-16-utorial-using-the-messenger-webview-to-create-richer-bot-to-user-interactions.md";
  slug: "2018/2018-03-16-utorial-using-the-messenger-webview-to-create-richer-bot-to-user-interactions";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-21-sxsw-part-1-blockchain-and-spacetech.md": {
	id: "2018/2018-03-21-sxsw-part-1-blockchain-and-spacetech.md";
  slug: "2018/2018-03-21-sxsw-part-1-blockchain-and-spacetech";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-24-sxsw-part-2-fixing-tech-ai-and-startups.md": {
	id: "2018/2018-03-24-sxsw-part-2-fixing-tech-ai-and-startups.md";
  slug: "2018/2018-03-24-sxsw-part-2-fixing-tech-ai-and-startups";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-27-what-is-designops.md": {
	id: "2018/2018-03-27-what-is-designops.md";
  slug: "2018/2018-03-27-what-is-designops";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-03-28-do-we-need-the-world-s-first-emotional-processing.md": {
	id: "2018/2018-03-28-do-we-need-the-world-s-first-emotional-processing.md";
  slug: "2018/2018-03-28-do-we-need-the-world-s-first-emotional-processing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-04-02-customizing-visual-studio-code-for-writing.md": {
	id: "2018/2018-04-02-customizing-visual-studio-code-for-writing.md";
  slug: "2018/2018-04-02-customizing-visual-studio-code-for-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-04-03-the-international-crypto-community-comes-to-berli.md": {
	id: "2018/2018-04-03-the-international-crypto-community-comes-to-berli.md";
  slug: "2018/2018-04-03-the-international-crypto-community-comes-to-berli";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-04-12-tokenize-all-the-things-and-what-happens-next.md": {
	id: "2018/2018-04-12-tokenize-all-the-things-and-what-happens-next.md";
  slug: "2018/2018-04-12-tokenize-all-the-things-and-what-happens-next";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-04-13-will-linux-finally-win-the-desktop-war-because-no.md": {
	id: "2018/2018-04-13-will-linux-finally-win-the-desktop-war-because-no.md";
  slug: "2018/2018-04-13-will-linux-finally-win-the-desktop-war-because-no";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-04-26-the-promises-payoff-and-products-of-hybrid-clouds.md": {
	id: "2018/2018-04-26-the-promises-payoff-and-products-of-hybrid-clouds.md";
  slug: "2018/2018-04-26-the-promises-payoff-and-products-of-hybrid-clouds";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-04-30-production-scale-deep-learning-with-skymind.md": {
	id: "2018/2018-04-30-production-scale-deep-learning-with-skymind.md";
  slug: "2018/2018-04-30-production-scale-deep-learning-with-skymind";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-05-01-ready-for-bionic-beaver-what-s-new-in-ubuntu-18-0.md": {
	id: "2018/2018-05-01-ready-for-bionic-beaver-what-s-new-in-ubuntu-18-0.md";
  slug: "2018/2018-05-01-ready-for-bionic-beaver-what-s-new-in-ubuntu-18-0";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-05-02-the-promises-payoff-and-products-of-hybrid-clouds.md": {
	id: "2018/2018-05-02-the-promises-payoff-and-products-of-hybrid-clouds.md";
  slug: "2018/2018-05-02-the-promises-payoff-and-products-of-hybrid-clouds";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-05-07-news-from-kubecon-and-cloud-native-con-2018.md": {
	id: "2018/2018-05-07-news-from-kubecon-and-cloud-native-con-2018.md";
  slug: "2018/2018-05-07-news-from-kubecon-and-cloud-native-con-2018";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-05-14-ethics-for-designers-and-developers-at-the-first-.md": {
	id: "2018/2018-05-14-ethics-for-designers-and-developers-at-the-first-.md";
  slug: "2018/2018-05-14-ethics-for-designers-and-developers-at-the-first-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-05-15-is-quitting-bad-software-as-hard-as-becoming-vega.md": {
	id: "2018/2018-05-15-is-quitting-bad-software-as-hard-as-becoming-vega.md";
  slug: "2018/2018-05-15-is-quitting-bad-software-as-hard-as-becoming-vega";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-05-21-foss-backstage-for-everyone-in-open-source.md": {
	id: "2018/2018-05-21-foss-backstage-for-everyone-in-open-source.md";
  slug: "2018/2018-05-21-foss-backstage-for-everyone-in-open-source";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-05-28-customizing-sublime-text-for-writers.md": {
	id: "2018/2018-05-28-customizing-sublime-text-for-writers.md";
  slug: "2018/2018-05-28-customizing-sublime-text-for-writers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-06-06-what-can-software-foundations-bring-to-your-proje.md": {
	id: "2018/2018-06-06-what-can-software-foundations-bring-to-your-proje.md";
  slug: "2018/2018-06-06-what-can-software-foundations-bring-to-your-proje";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-06-12-a-guide-to-the-hybrid-cloud-networking-landscape.md": {
	id: "2018/2018-06-12-a-guide-to-the-hybrid-cloud-networking-landscape.md";
  slug: "2018/2018-06-12-a-guide-to-the-hybrid-cloud-networking-landscape";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-06-14-computational-knowledge-with-stephen-wolfram.md": {
	id: "2018/2018-06-14-computational-knowledge-with-stephen-wolfram.md";
  slug: "2018/2018-06-14-computational-knowledge-with-stephen-wolfram";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-06-19-fostering-open-source-at-foss-backstage.md": {
	id: "2018/2018-06-19-fostering-open-source-at-foss-backstage.md";
  slug: "2018/2018-06-19-fostering-open-source-at-foss-backstage";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-06-26-discovering-the-true-meaning-of-innovation-with-l.md": {
	id: "2018/2018-06-26-discovering-the-true-meaning-of-innovation-with-l.md";
  slug: "2018/2018-06-26-discovering-the-true-meaning-of-innovation-with-l";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-06-26-what-is-blockchain.md": {
	id: "2018/2018-06-26-what-is-blockchain.md";
  slug: "2018/2018-06-26-what-is-blockchain";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-06-29-creating-your-own-whimsical-twitter-bot-with-trac.md": {
	id: "2018/2018-06-29-creating-your-own-whimsical-twitter-bot-with-trac.md";
  slug: "2018/2018-06-29-creating-your-own-whimsical-twitter-bot-with-trac";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-07-17-why-programmers-should-play-boardgames.md": {
	id: "2018/2018-07-17-why-programmers-should-play-boardgames.md";
  slug: "2018/2018-07-17-why-programmers-should-play-boardgames";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-07-18-how-to-market-blockchain-with-consensys-and-lisk.md": {
	id: "2018/2018-07-18-how-to-market-blockchain-with-consensys-and-lisk.md";
  slug: "2018/2018-07-18-how-to-market-blockchain-with-consensys-and-lisk";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-07-19-what-is-artificial-intelligence.md": {
	id: "2018/2018-07-19-what-is-artificial-intelligence.md";
  slug: "2018/2018-07-19-what-is-artificial-intelligence";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-07-20-embracing-the-chaos-of-chaos-engineering.md": {
	id: "2018/2018-07-20-embracing-the-chaos-of-chaos-engineering.md";
  slug: "2018/2018-07-20-embracing-the-chaos-of-chaos-engineering";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-07-27-blockwatch-a-week-in-berlin-blockchain.md": {
	id: "2018/2018-07-27-blockwatch-a-week-in-berlin-blockchain.md";
  slug: "2018/2018-07-27-blockwatch-a-week-in-berlin-blockchain";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-07-31-what-smart-home-iot-platform-should-you-use.md": {
	id: "2018/2018-07-31-what-smart-home-iot-platform-should-you-use.md";
  slug: "2018/2018-07-31-what-smart-home-iot-platform-should-you-use";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-08-14-vale-for-spelling-grammar-style-and-readability-l.md": {
	id: "2018/2018-08-14-vale-for-spelling-grammar-style-and-readability-l.md";
  slug: "2018/2018-08-14-vale-for-spelling-grammar-style-and-readability-l";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-08-20-blockwatch-ripple-coil-codius-and-malta-summit.md": {
	id: "2018/2018-08-20-blockwatch-ripple-coil-codius-and-malta-summit.md";
  slug: "2018/2018-08-20-blockwatch-ripple-coil-codius-and-malta-summit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-08-30-eyeo-adblocker-plus-and-the-future-of-funding.md": {
	id: "2018/2018-08-30-eyeo-adblocker-plus-and-the-future-of-funding.md";
  slug: "2018/2018-08-30-eyeo-adblocker-plus-and-the-future-of-funding";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-09-05-afrolynk-african-tech-and-entrepreneurship.md": {
	id: "2018/2018-09-05-afrolynk-african-tech-and-entrepreneurship.md";
  slug: "2018/2018-09-05-afrolynk-african-tech-and-entrepreneurship";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-09-09-building-chatbots-in-react-with-botonic.md": {
	id: "2018/2018-09-09-building-chatbots-in-react-with-botonic.md";
  slug: "2018/2018-09-09-building-chatbots-in-react-with-botonic";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-09-13-what-apple-s-september-announcements-might-mean-f.md": {
	id: "2018/2018-09-13-what-apple-s-september-announcements-might-mean-f.md";
  slug: "2018/2018-09-13-what-apple-s-september-announcements-might-mean-f";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-09-15-ifalicious-europe-s-consumer-tech-fair-trends.md": {
	id: "2018/2018-09-15-ifalicious-europe-s-consumer-tech-fair-trends.md";
  slug: "2018/2018-09-15-ifalicious-europe-s-consumer-tech-fair-trends";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-09-27-creating-a-smart-home-with-conrad-connect.md": {
	id: "2018/2018-09-27-creating-a-smart-home-with-conrad-connect.md";
  slug: "2018/2018-09-27-creating-a-smart-home-with-conrad-connect";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-10-18-best-tools-for-debugging-distributed-applications.md": {
	id: "2018/2018-10-18-best-tools-for-debugging-distributed-applications.md";
  slug: "2018/2018-10-18-best-tools-for-debugging-distributed-applications";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-10-19-github-universe-2018-enterprise-enterprise-enterp.md": {
	id: "2018/2018-10-19-github-universe-2018-enterprise-enterprise-enterp.md";
  slug: "2018/2018-10-19-github-universe-2018-enterprise-enterprise-enterp";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-10-24-secure-yourself-for-national-cyber-security-aware.md": {
	id: "2018/2018-10-24-secure-yourself-for-national-cyber-security-aware.md";
  slug: "2018/2018-10-24-secure-yourself-for-national-cyber-security-aware";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-11-02-blockwatch-the-aeternity-blockchain.md": {
	id: "2018/2018-11-02-blockwatch-the-aeternity-blockchain.md";
  slug: "2018/2018-11-02-blockwatch-the-aeternity-blockchain";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-11-08-what-is-continuous-integration.md": {
	id: "2018/2018-11-08-what-is-continuous-integration.md";
  slug: "2018/2018-11-08-what-is-continuous-integration";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-11-12-our-5g-futures-at-5gtechritory.md": {
	id: "2018/2018-11-12-our-5g-futures-at-5gtechritory.md";
  slug: "2018/2018-11-12-our-5g-futures-at-5gtechritory";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-11-27-5g-and-alibaba-cloud-with-tony-cheng.md": {
	id: "2018/2018-11-27-5g-and-alibaba-cloud-with-tony-cheng.md";
  slug: "2018/2018-11-27-5g-and-alibaba-cloud-with-tony-cheng";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-12-03-thoughtworks-technology-radar-19-cloud-chaos-and-.md": {
	id: "2018/2018-12-03-thoughtworks-technology-radar-19-cloud-chaos-and-.md";
  slug: "2018/2018-12-03-thoughtworks-technology-radar-19-cloud-chaos-and-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-12-11-a-year-in-review-blockchainops-entrepreneur.md": {
	id: "2018/2018-12-11-a-year-in-review-blockchainops-entrepreneur.md";
  slug: "2018/2018-12-11-a-year-in-review-blockchainops-entrepreneur";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2018/2018-12-13-openstack-summit-berlin-2018-running-your-cloud.md": {
	id: "2018/2018-12-13-openstack-summit-berlin-2018-running-your-cloud.md";
  slug: "2018/2018-12-13-openstack-summit-berlin-2018-running-your-cloud";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-02-14-embleema-the-blockchain-that-lets-you-own-your-he.md": {
	id: "2019/2019-02-14-embleema-the-blockchain-that-lets-you-own-your-he.md";
  slug: "2019/2019-02-14-embleema-the-blockchain-that-lets-you-own-your-he";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-03-06-smart-contract-utilities-with-zeppelinos-deployin.md": {
	id: "2019/2019-03-06-smart-contract-utilities-with-zeppelinos-deployin.md";
  slug: "2019/2019-03-06-smart-contract-utilities-with-zeppelinos-deployin";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-03-12-developer-relations-and-tech-evangelism-with-rach.md": {
	id: "2019/2019-03-12-developer-relations-and-tech-evangelism-with-rach.md";
  slug: "2019/2019-03-12-developer-relations-and-tech-evangelism-with-rach";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-03-12-writing-on-kauri.md": {
	id: "2019/2019-03-12-writing-on-kauri.md";
  slug: "2019/2019-03-12-writing-on-kauri";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-03-14-march-13th-an-improved-reading-and-writing-experi.md": {
	id: "2019/2019-03-14-march-13th-an-improved-reading-and-writing-experi.md";
  slug: "2019/2019-03-14-march-13th-an-improved-reading-and-writing-experi";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-03-19-installing-ipfs.md": {
	id: "2019/2019-03-19-installing-ipfs.md";
  slug: "2019/2019-03-19-installing-ipfs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-03-19-peer-to-peer-hypermedia-with-ipfs.md": {
	id: "2019/2019-03-19-peer-to-peer-hypermedia-with-ipfs.md";
  slug: "2019/2019-03-19-peer-to-peer-hypermedia-with-ipfs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-03-26-true-anonymity-privacy-and-snapps-with-simon-harm.md": {
	id: "2019/2019-03-26-true-anonymity-privacy-and-snapps-with-simon-harm.md";
  slug: "2019/2019-03-26-true-anonymity-privacy-and-snapps-with-simon-harm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-03-28-reading-on-kauri.md": {
	id: "2019/2019-03-28-reading-on-kauri.md";
  slug: "2019/2019-03-28-reading-on-kauri";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-04-12-kauri-celebrates-500th-post.md": {
	id: "2019/2019-04-12-kauri-celebrates-500th-post.md";
  slug: "2019/2019-04-12-kauri-celebrates-500th-post";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-04-18-removing-the-lid-on-kata-containers.md": {
	id: "2019/2019-04-18-removing-the-lid-on-kata-containers.md";
  slug: "2019/2019-04-18-removing-the-lid-on-kata-containers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-04-23-google-s-season-of-docs-fostering-open-source-col.md": {
	id: "2019/2019-04-23-google-s-season-of-docs-fostering-open-source-col.md";
  slug: "2019/2019-04-23-google-s-season-of-docs-fostering-open-source-col";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-04-23-openstack-stein-kubernetes-and-bare-metal.md": {
	id: "2019/2019-04-23-openstack-stein-kubernetes-and-bare-metal.md";
  slug: "2019/2019-04-23-openstack-stein-kubernetes-and-bare-metal";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-04-24-will-the-opera-web3-wallet-drive-adoption.md": {
	id: "2019/2019-04-24-will-the-opera-web3-wallet-drive-adoption.md";
  slug: "2019/2019-04-24-will-the-opera-web3-wallet-drive-adoption";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-04-26-april-25th-2019-newsletter.md": {
	id: "2019/2019-04-26-april-25th-2019-newsletter.md";
  slug: "2019/2019-04-26-april-25th-2019-newsletter";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-05-08-mojobot-the-world-s-first-tangible-coding-robot-a.md": {
	id: "2019/2019-05-08-mojobot-the-world-s-first-tangible-coding-robot-a.md";
  slug: "2019/2019-05-08-mojobot-the-world-s-first-tangible-coding-robot-a";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-05-20-fluree-blockchain-graphql-and-more-all-in-one-dat.md": {
	id: "2019/2019-05-20-fluree-blockchain-graphql-and-more-all-in-one-dat.md";
  slug: "2019/2019-05-20-fluree-blockchain-graphql-and-more-all-in-one-dat";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-05-20-q-and-a-making-open-source-more-accessible-to-ent.md": {
	id: "2019/2019-05-20-q-and-a-making-open-source-more-accessible-to-ent.md";
  slug: "2019/2019-05-20-q-and-a-making-open-source-more-accessible-to-ent";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-05-20-revolutionizing-health-data-with-arkhn.md": {
	id: "2019/2019-05-20-revolutionizing-health-data-with-arkhn.md";
  slug: "2019/2019-05-20-revolutionizing-health-data-with-arkhn";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-05-21-fluree-blockchain-graphql-and-more-all-in-one-dat.md": {
	id: "2019/2019-05-21-fluree-blockchain-graphql-and-more-all-in-one-dat.md";
  slug: "2019/2019-05-21-fluree-blockchain-graphql-and-more-all-in-one-dat";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-05-21-revolutionizing-health-data-with-arkhn.md": {
	id: "2019/2019-05-21-revolutionizing-health-data-with-arkhn.md";
  slug: "2019/2019-05-21-revolutionizing-health-data-with-arkhn";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-05-24-creating-a-serverless-application-with-kendoreact.md": {
	id: "2019/2019-05-24-creating-a-serverless-application-with-kendoreact.md";
  slug: "2019/2019-05-24-creating-a-serverless-application-with-kendoreact";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-06-06-secureth-guidelines-getting-started.md": {
	id: "2019/2019-06-06-secureth-guidelines-getting-started.md";
  slug: "2019/2019-06-06-secureth-guidelines-getting-started";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-06-11-pengwin-linux-optimized-for-the-windows-subsystem.md": {
	id: "2019/2019-06-11-pengwin-linux-optimized-for-the-windows-subsystem.md";
  slug: "2019/2019-06-11-pengwin-linux-optimized-for-the-windows-subsystem";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-07-07-netlify-dev-test-the-netlify-hosting-platform-loc.md": {
	id: "2019/2019-07-07-netlify-dev-test-the-netlify-hosting-platform-loc.md";
  slug: "2019/2019-07-07-netlify-dev-test-the-netlify-hosting-platform-loc";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-07-11-the-international-accessibility-standards-you-need-to-follow.md": {
	id: "2019/2019-07-11-the-international-accessibility-standards-you-need-to-follow.md";
  slug: "2019/2019-07-11-the-international-accessibility-standards-you-need-to-follow";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-07-16-the-wcag-accessibility-regulations-you-need-to-know.md": {
	id: "2019/2019-07-16-the-wcag-accessibility-regulations-you-need-to-know.md";
  slug: "2019/2019-07-16-the-wcag-accessibility-regulations-you-need-to-know";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-07-19-bosque-microsoft-s-new-programming-language.md": {
	id: "2019/2019-07-19-bosque-microsoft-s-new-programming-language.md";
  slug: "2019/2019-07-19-bosque-microsoft-s-new-programming-language";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-07-23-vision-disabilities-and-what-you-need-for-accessibility.md": {
	id: "2019/2019-07-23-vision-disabilities-and-what-you-need-for-accessibility.md";
  slug: "2019/2019-07-23-vision-disabilities-and-what-you-need-for-accessibility";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-07-29-auditory-disabilities-and-what-you-need-for-accessibility.md": {
	id: "2019/2019-07-29-auditory-disabilities-and-what-you-need-for-accessibility.md";
  slug: "2019/2019-07-29-auditory-disabilities-and-what-you-need-for-accessibility";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-07-30-motor-disabilities-and-what-you-need-for-accessibility.md": {
	id: "2019/2019-07-30-motor-disabilities-and-what-you-need-for-accessibility.md";
  slug: "2019/2019-07-30-motor-disabilities-and-what-you-need-for-accessibility";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-08-01-accessibility-regulations-you-need-to-follow-section-508.md": {
	id: "2019/2019-08-01-accessibility-regulations-you-need-to-follow-section-508.md";
  slug: "2019/2019-08-01-accessibility-regulations-you-need-to-follow-section-508";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-08-20-7-ways-to-make-your-angular-app-more-accessible.md": {
	id: "2019/2019-08-20-7-ways-to-make-your-angular-app-more-accessible.md";
  slug: "2019/2019-08-20-7-ways-to-make-your-angular-app-more-accessible";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-08-23-top-5-resources-for-web-app-accessibility.md": {
	id: "2019/2019-08-23-top-5-resources-for-web-app-accessibility.md";
  slug: "2019/2019-08-23-top-5-resources-for-web-app-accessibility";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-08-30-ethberlin-2019-decentralized-heatathon.md": {
	id: "2019/2019-08-30-ethberlin-2019-decentralized-heatathon.md";
  slug: "2019/2019-08-30-ethberlin-2019-decentralized-heatathon";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-09-03-stories-from-kubecon-ibm-announces-razee-a-multi-.md": {
	id: "2019/2019-09-03-stories-from-kubecon-ibm-announces-razee-a-multi-.md";
  slug: "2019/2019-09-03-stories-from-kubecon-ibm-announces-razee-a-multi-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-09-05-stories-from-kubecon-with-jason-mcgee-cto-ibm-clo.md": {
	id: "2019/2019-09-05-stories-from-kubecon-with-jason-mcgee-cto-ibm-clo.md";
  slug: "2019/2019-09-05-stories-from-kubecon-with-jason-mcgee-cto-ibm-clo";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-09-18-stories-from-kubecon-carmine-rimi-of-canonical.md": {
	id: "2019/2019-09-18-stories-from-kubecon-carmine-rimi-of-canonical.md";
  slug: "2019/2019-09-18-stories-from-kubecon-carmine-rimi-of-canonical";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-10-03-multipass-and-microk8s-the-quickest-route-to-ubun.md": {
	id: "2019/2019-10-03-multipass-and-microk8s-the-quickest-route-to-ubun.md";
  slug: "2019/2019-10-03-multipass-and-microk8s-the-quickest-route-to-ubun";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-10-12-a-fullstack-dapp-for-creating-tokens.md": {
	id: "2019/2019-10-12-a-fullstack-dapp-for-creating-tokens.md";
  slug: "2019/2019-10-12-a-fullstack-dapp-for-creating-tokens";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-10-12-create-a-hello-world-fullstack-dapp.md": {
	id: "2019/2019-10-12-create-a-hello-world-fullstack-dapp.md";
  slug: "2019/2019-10-12-create-a-hello-world-fullstack-dapp";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-10-17-a-fullstack-dapp-for-creating-unique-tradable-tok.md": {
	id: "2019/2019-10-17-a-fullstack-dapp-for-creating-unique-tradable-tok.md";
  slug: "2019/2019-10-17-a-fullstack-dapp-for-creating-unique-tradable-tok";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-11-14-documentation-structure.md": {
	id: "2019/2019-11-14-documentation-structure.md";
  slug: "2019/2019-11-14-documentation-structure";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-11-14-why-write-documentation.md": {
	id: "2019/2019-11-14-why-write-documentation.md";
  slug: "2019/2019-11-14-why-write-documentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-11-18-language-and-understandable-writing.md": {
	id: "2019/2019-11-18-language-and-understandable-writing.md";
  slug: "2019/2019-11-18-language-and-understandable-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-11-20-multipass-and-microk8s-the-quickest-route-to-ubun.md": {
	id: "2019/2019-11-20-multipass-and-microk8s-the-quickest-route-to-ubun.md";
  slug: "2019/2019-11-20-multipass-and-microk8s-the-quickest-route-to-ubun";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-11-25-iost-the-decentralized-internet-of-services.md": {
	id: "2019/2019-11-25-iost-the-decentralized-internet-of-services.md";
  slug: "2019/2019-11-25-iost-the-decentralized-internet-of-services";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-12-16-revisiting-desktop-linux-drowning-in-the-deep-end.md": {
	id: "2019/2019-12-16-revisiting-desktop-linux-drowning-in-the-deep-end.md";
  slug: "2019/2019-12-16-revisiting-desktop-linux-drowning-in-the-deep-end";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2019/2019-12-30-what-to-expect-in-open-source-software-in-the-nex.md": {
	id: "2019/2019-12-30-what-to-expect-in-open-source-software-in-the-nex.md";
  slug: "2019/2019-12-30-what-to-expect-in-open-source-software-in-the-nex";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-01-15-ces-2020-highlights-for-the-more-technically-mind.md": {
	id: "2020/2020-01-15-ces-2020-highlights-for-the-more-technically-mind.md";
  slug: "2020/2020-01-15-ces-2020-highlights-for-the-more-technically-mind";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-01-27-kong-api-platform-for-multi-cloud-and-hybrid-orga.md": {
	id: "2020/2020-01-27-kong-api-platform-for-multi-cloud-and-hybrid-orga.md";
  slug: "2020/2020-01-27-kong-api-platform-for-multi-cloud-and-hybrid-orga";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-02-04-introducing-starlingx-3-0-for-edge-computing-and-.md": {
	id: "2020/2020-02-04-introducing-starlingx-3-0-for-edge-computing-and-.md";
  slug: "2020/2020-02-04-introducing-starlingx-3-0-for-edge-computing-and-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-02-05-introducing-starlingx-3-0-for-edge-computing-and-.md": {
	id: "2020/2020-02-05-introducing-starlingx-3-0-for-edge-computing-and-.md";
  slug: "2020/2020-02-05-introducing-starlingx-3-0-for-edge-computing-and-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-02-19-automate-task-creation-with-the-todo-bot.md": {
	id: "2020/2020-02-19-automate-task-creation-with-the-todo-bot.md";
  slug: "2020/2020-02-19-automate-task-creation-with-the-todo-bot";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-02-27-talking-uber-level-monitoring-with-martin-mao-of-.md": {
	id: "2020/2020-02-27-talking-uber-level-monitoring-with-martin-mao-of-.md";
  slug: "2020/2020-02-27-talking-uber-level-monitoring-with-martin-mao-of-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-04-managing-documentation-shareholders-with-chris-ward-of-ethereum.md": {
	id: "2020/2020-03-04-managing-documentation-shareholders-with-chris-ward-of-ethereum.md";
  slug: "2020/2020-03-04-managing-documentation-shareholders-with-chris-ward-of-ethereum";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-09-preaching-the-api-gospel-an-interview-with-the-ap.md": {
	id: "2020/2020-03-09-preaching-the-api-gospel-an-interview-with-the-ap.md";
  slug: "2020/2020-03-09-preaching-the-api-gospel-an-interview-with-the-ap";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-09-the-future-of-tech-conferences-in-the-wake-of-cor.md": {
	id: "2020/2020-03-09-the-future-of-tech-conferences-in-the-wake-of-cor.md";
  slug: "2020/2020-03-09-the-future-of-tech-conferences-in-the-wake-of-cor";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-10-preaching-the-api-gospel-an-interview-with-the-ap.md": {
	id: "2020/2020-03-10-preaching-the-api-gospel-an-interview-with-the-ap.md";
  slug: "2020/2020-03-10-preaching-the-api-gospel-an-interview-with-the-ap";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-10-the-future-of-tech-conferences-in-the-wake-of-cor.md": {
	id: "2020/2020-03-10-the-future-of-tech-conferences-in-the-wake-of-cor.md";
  slug: "2020/2020-03-10-the-future-of-tech-conferences-in-the-wake-of-cor";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-11-make-tracking-agreements-simple-compliance-dashboard.md": {
	id: "2020/2020-03-11-make-tracking-agreements-simple-compliance-dashboard.md";
  slug: "2020/2020-03-11-make-tracking-agreements-simple-compliance-dashboard";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-18-troubleshoot-delays-with-code-review-analytics.md": {
	id: "2020/2020-03-18-troubleshoot-delays-with-code-review-analytics.md";
  slug: "2020/2020-03-18-troubleshoot-delays-with-code-review-analytics";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-23-6-interesting-trends-from-the-latest-cncf-survey.md": {
	id: "2020/2020-03-23-6-interesting-trends-from-the-latest-cncf-survey.md";
  slug: "2020/2020-03-23-6-interesting-trends-from-the-latest-cncf-survey";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-03-31-how-hedera-hashgraph-is-revolutionizing-distribut.md": {
	id: "2020/2020-03-31-how-hedera-hashgraph-is-revolutionizing-distribut.md";
  slug: "2020/2020-03-31-how-hedera-hashgraph-is-revolutionizing-distribut";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-04-01-learning-to-code-with-swift-playgrounds.md": {
	id: "2020/2020-04-01-learning-to-code-with-swift-playgrounds.md";
  slug: "2020/2020-04-01-learning-to-code-with-swift-playgrounds";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-04-21-cybersecurity-during-a-pandemic-an-interview-with.md": {
	id: "2020/2020-04-21-cybersecurity-during-a-pandemic-an-interview-with.md";
  slug: "2020/2020-04-21-cybersecurity-during-a-pandemic-an-interview-with";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-04-22-benefits-of-containerization.md": {
	id: "2020/2020-04-22-benefits-of-containerization.md";
  slug: "2020/2020-04-22-benefits-of-containerization";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-04-22-ubuntu-20-04-lts-focal-fossa-enterprise-ready.md": {
	id: "2020/2020-04-22-ubuntu-20-04-lts-focal-fossa-enterprise-ready.md";
  slug: "2020/2020-04-22-ubuntu-20-04-lts-focal-fossa-enterprise-ready";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-04-23-big-boy.md": {
	id: "2020/2020-04-23-big-boy.md";
  slug: "2020/2020-04-23-big-boy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-04-23-crit-test-dummies-special-the-phantasmal-owlbear-.md": {
	id: "2020/2020-04-23-crit-test-dummies-special-the-phantasmal-owlbear-.md";
  slug: "2020/2020-04-23-crit-test-dummies-special-the-phantasmal-owlbear-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-04-24-parent-child-pipelines.md": {
	id: "2020/2020-04-24-parent-child-pipelines.md";
  slug: "2020/2020-04-24-parent-child-pipelines";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-04-30-deploy-with-kubectl-hands-on-with-kubernetes.md": {
	id: "2020/2020-04-30-deploy-with-kubectl-hands-on-with-kubernetes.md";
  slug: "2020/2020-04-30-deploy-with-kubectl-hands-on-with-kubernetes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-05-05-grafana-the-open-observability-platform.md": {
	id: "2020/2020-05-05-grafana-the-open-observability-platform.md";
  slug: "2020/2020-05-05-grafana-the-open-observability-platform";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-05-14-github-satellite-2020-gone-remote-but-not-forgott.md": {
	id: "2020/2020-05-14-github-satellite-2020-gone-remote-but-not-forgott.md";
  slug: "2020/2020-05-14-github-satellite-2020-gone-remote-but-not-forgott";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-05-14-openstack-ussuri-intelligent-automation.md": {
	id: "2020/2020-05-14-openstack-ussuri-intelligent-automation.md";
  slug: "2020/2020-05-14-openstack-ussuri-intelligent-automation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-05-17-measuring-metrics-in-open-source-projects.md": {
	id: "2020/2020-05-17-measuring-metrics-in-open-source-projects.md";
  slug: "2020/2020-05-17-measuring-metrics-in-open-source-projects";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-05-19-three-git-pull-requests.md": {
	id: "2020/2020-05-19-three-git-pull-requests.md";
  slug: "2020/2020-05-19-three-git-pull-requests";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-06-05-handling-environment-variables-with-kubernetes.md": {
	id: "2020/2020-06-05-handling-environment-variables-with-kubernetes.md";
  slug: "2020/2020-06-05-handling-environment-variables-with-kubernetes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-06-16-benefits-and-best-practices-of-continuous-delivery.md": {
	id: "2020/2020-06-16-benefits-and-best-practices-of-continuous-delivery.md";
  slug: "2020/2020-06-16-benefits-and-best-practices-of-continuous-delivery";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-06-19-continuous-integration-vs-continuous-delivery-vs-continuous-deployment.md": {
	id: "2020/2020-06-19-continuous-integration-vs-continuous-delivery-vs-continuous-deployment.md";
  slug: "2020/2020-06-19-continuous-integration-vs-continuous-delivery-vs-continuous-deployment";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-06-23-create-a-random-board-game-generator-using-micros.md": {
	id: "2020/2020-06-23-create-a-random-board-game-generator-using-micros.md";
  slug: "2020/2020-06-23-create-a-random-board-game-generator-using-micros";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-06-30-ephemeral-environments-for-testing.md": {
	id: "2020/2020-06-30-ephemeral-environments-for-testing.md";
  slug: "2020/2020-06-30-ephemeral-environments-for-testing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-07-10-crit-test-dummies-ep-5-how-to-raise-a-dragon.md": {
	id: "2020/2020-07-10-crit-test-dummies-ep-5-how-to-raise-a-dragon.md";
  slug: "2020/2020-07-10-crit-test-dummies-ep-5-how-to-raise-a-dragon";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-07-15-developer-experience-roundtable-continuous-improvement-nigel-simpson-erik-muttersbach.md": {
	id: "2020/2020-07-15-developer-experience-roundtable-continuous-improvement-nigel-simpson-erik-muttersbach.md";
  slug: "2020/2020-07-15-developer-experience-roundtable-continuous-improvement-nigel-simpson-erik-muttersbach";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-07-31-crit-test-dummies-episode-6-mistress-of-blood-tow.md": {
	id: "2020/2020-07-31-crit-test-dummies-episode-6-mistress-of-blood-tow.md";
  slug: "2020/2020-07-31-crit-test-dummies-episode-6-mistress-of-blood-tow";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-08-06-sandbox-environments-for-testing.md": {
	id: "2020/2020-08-06-sandbox-environments-for-testing.md";
  slug: "2020/2020-08-06-sandbox-environments-for-testing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-08-24-such-devoted-sisters-lgbt-pride-special.md": {
	id: "2020/2020-08-24-such-devoted-sisters-lgbt-pride-special.md";
  slug: "2020/2020-08-24-such-devoted-sisters-lgbt-pride-special";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-08-26-reducing-support-overload-with-an-einstein-powere.md": {
	id: "2020/2020-08-26-reducing-support-overload-with-an-einstein-powere.md";
  slug: "2020/2020-08-26-reducing-support-overload-with-an-einstein-powere";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-09-18-dxpos-api-design-and-rest-client-insomnia.md": {
	id: "2020/2020-09-18-dxpos-api-design-and-rest-client-insomnia.md";
  slug: "2020/2020-09-18-dxpos-api-design-and-rest-client-insomnia";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-09-20-creating-a-cross-platform-todo-aggregator-with-fl.md": {
	id: "2020/2020-09-20-creating-a-cross-platform-todo-aggregator-with-fl.md";
  slug: "2020/2020-09-20-creating-a-cross-platform-todo-aggregator-with-fl";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-09-21-configuration-version-changes-kubernetes-apps.md": {
	id: "2020/2020-09-21-configuration-version-changes-kubernetes-apps.md";
  slug: "2020/2020-09-21-configuration-version-changes-kubernetes-apps";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-09-23-the-weekly-squeak-tanmai-gopal-of-hasura.md": {
	id: "2020/2020-09-23-the-weekly-squeak-tanmai-gopal-of-hasura.md";
  slug: "2020/2020-09-23-the-weekly-squeak-tanmai-gopal-of-hasura";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-09-29-crit-test-dummies-ep-7-bubble-bubble-toil-and-tro.md": {
	id: "2020/2020-09-29-crit-test-dummies-ep-7-bubble-bubble-toil-and-tro.md";
  slug: "2020/2020-09-29-crit-test-dummies-ep-7-bubble-bubble-toil-and-tro";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-10-06-developer-experience.md": {
	id: "2020/2020-10-06-developer-experience.md";
  slug: "2020/2020-10-06-developer-experience";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-10-12-why-zalando-built-own-developer-platform.md": {
	id: "2020/2020-10-12-why-zalando-built-own-developer-platform.md";
  slug: "2020/2020-10-12-why-zalando-built-own-developer-platform";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-10-18-crit-test-dummies-episode-8-corruption-of-skyhorn.md": {
	id: "2020/2020-10-18-crit-test-dummies-episode-8-corruption-of-skyhorn.md";
  slug: "2020/2020-10-18-crit-test-dummies-episode-8-corruption-of-skyhorn";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-10-23-amazon-elasticache-for-redis-polarsquad-hackathon.md": {
	id: "2020/2020-10-23-amazon-elasticache-for-redis-polarsquad-hackathon.md";
  slug: "2020/2020-10-23-amazon-elasticache-for-redis-polarsquad-hackathon";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-11-02-tournament-of-tokens-one-shot-special.md": {
	id: "2020/2020-11-02-tournament-of-tokens-one-shot-special.md";
  slug: "2020/2020-11-02-tournament-of-tokens-one-shot-special";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-11-04-testing-hotfixes.md": {
	id: "2020/2020-11-04-testing-hotfixes.md";
  slug: "2020/2020-11-04-testing-hotfixes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-11-16-haunting-of-owlbear-lodge-halloween-special.md": {
	id: "2020/2020-11-16-haunting-of-owlbear-lodge-halloween-special.md";
  slug: "2020/2020-11-16-haunting-of-owlbear-lodge-halloween-special";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-11-21-crit-test-dummies-ep-10-mined-your-head-pt-1.md": {
	id: "2020/2020-11-21-crit-test-dummies-ep-10-mined-your-head-pt-1.md";
  slug: "2020/2020-11-21-crit-test-dummies-ep-10-mined-your-head-pt-1";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-11-21-crit-test-dummies-ep-9-mined-your-head-pt-1.md": {
	id: "2020/2020-11-21-crit-test-dummies-ep-9-mined-your-head-pt-1.md";
  slug: "2020/2020-11-21-crit-test-dummies-ep-9-mined-your-head-pt-1";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-11-22-crit-test-dummies-ep-9-mined-your-head-pt-2.md": {
	id: "2020/2020-11-22-crit-test-dummies-ep-9-mined-your-head-pt-2.md";
  slug: "2020/2020-11-22-crit-test-dummies-ep-9-mined-your-head-pt-2";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-11-23-why-sport1-developer-platform.md": {
	id: "2020/2020-11-23-why-sport1-developer-platform.md";
  slug: "2020/2020-11-23-why-sport1-developer-platform";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-11-24-why-github-developer-platform.md": {
	id: "2020/2020-11-24-why-github-developer-platform.md";
  slug: "2020/2020-11-24-why-github-developer-platform";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-12-15-api-design-developer-experience.md": {
	id: "2020/2020-12-15-api-design-developer-experience.md";
  slug: "2020/2020-12-15-api-design-developer-experience";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-12-18-whats-new-for-documentarians-in-snagit-2021.md": {
	id: "2020/2020-12-18-whats-new-for-documentarians-in-snagit-2021.md";
  slug: "2020/2020-12-18-whats-new-for-documentarians-in-snagit-2021";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-12-28-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt.md": {
	id: "2020/2020-12-28-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt.md";
  slug: "2020/2020-12-28-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2020/2020-12-29-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt.md": {
	id: "2020/2020-12-29-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt.md";
  slug: "2020/2020-12-29-crit-test-dummies-ep-10-isle-of-the-dying-moon-pt";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-01-14-screenshot-tool-comparison.md": {
	id: "2021/2021-01-14-screenshot-tool-comparison.md";
  slug: "2021/2021-01-14-screenshot-tool-comparison";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-01-22-scaling-your-team-alongside-kubernetes.md": {
	id: "2021/2021-01-22-scaling-your-team-alongside-kubernetes.md";
  slug: "2021/2021-01-22-scaling-your-team-alongside-kubernetes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-02-10-developer-experience-documentation.md": {
	id: "2021/2021-02-10-developer-experience-documentation.md";
  slug: "2021/2021-02-10-developer-experience-documentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-02-25-why-development-teams-should-play-roleplaying-gam.md": {
	id: "2021/2021-02-25-why-development-teams-should-play-roleplaying-gam.md";
  slug: "2021/2021-02-25-why-development-teams-should-play-roleplaying-gam";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-03-03-gitops-pros-and-cons.md": {
	id: "2021/2021-03-03-gitops-pros-and-cons.md";
  slug: "2021/2021-03-03-gitops-pros-and-cons";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-03-25-crit-test-dummies-ep-11-pt2-the-crumbling-stairs.md": {
	id: "2021/2021-03-25-crit-test-dummies-ep-11-pt2-the-crumbling-stairs.md";
  slug: "2021/2021-03-25-crit-test-dummies-ep-11-pt2-the-crumbling-stairs";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-03-25-crit-test-dummies-ep-11-the-crumbling-stairs-pt-1.md": {
	id: "2021/2021-03-25-crit-test-dummies-ep-11-the-crumbling-stairs-pt-1.md";
  slug: "2021/2021-03-25-crit-test-dummies-ep-11-the-crumbling-stairs-pt-1";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-03-25-devx5-developer-experience-deep-dive-with-twilio.md": {
	id: "2021/2021-03-25-devx5-developer-experience-deep-dive-with-twilio.md";
  slug: "2021/2021-03-25-devx5-developer-experience-deep-dive-with-twilio";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-03-26-crit-test-dummies-ep-12-pt1-battle-royale.md": {
	id: "2021/2021-03-26-crit-test-dummies-ep-12-pt1-battle-royale.md";
  slug: "2021/2021-03-26-crit-test-dummies-ep-12-pt1-battle-royale";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-03-26-crit-test-dummies-ep-12-pt2-battle-royale.md": {
	id: "2021/2021-03-26-crit-test-dummies-ep-12-pt2-battle-royale.md";
  slug: "2021/2021-03-26-crit-test-dummies-ep-12-pt2-battle-royale";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-04-08-ctd-shadow-of-ebondeath-pt-2-ep-13.md": {
	id: "2021/2021-04-08-ctd-shadow-of-ebondeath-pt-2-ep-13.md";
  slug: "2021/2021-04-08-ctd-shadow-of-ebondeath-pt-2-ep-13";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-04-08-ctd-shadow-of-ebondeath-pt1-ep-13.md": {
	id: "2021/2021-04-08-ctd-shadow-of-ebondeath-pt1-ep-13.md";
  slug: "2021/2021-04-08-ctd-shadow-of-ebondeath-pt1-ep-13";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-04-09-ctd-three-faces-of-night-pt-1-ep-14.md": {
	id: "2021/2021-04-09-ctd-three-faces-of-night-pt-1-ep-14.md";
  slug: "2021/2021-04-09-ctd-three-faces-of-night-pt-1-ep-14";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-04-09-ctd-three-faces-of-night-pt-2-ep-14.md": {
	id: "2021/2021-04-09-ctd-three-faces-of-night-pt-2-ep-14.md";
  slug: "2021/2021-04-09-ctd-three-faces-of-night-pt-2-ep-14";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-04-10-supers-and-sorcery-one-shot-special-by-crit-test-.md": {
	id: "2021/2021-04-10-supers-and-sorcery-one-shot-special-by-crit-test-.md";
  slug: "2021/2021-04-10-supers-and-sorcery-one-shot-special-by-crit-test-";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-04-20-10-great-podcasts-software-test-engineers.md": {
	id: "2021/2021-04-20-10-great-podcasts-software-test-engineers.md";
  slug: "2021/2021-04-20-10-great-podcasts-software-test-engineers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-04-22-devx5-developer-experience-deep-dive-with-bannerb.md": {
	id: "2021/2021-04-22-devx5-developer-experience-deep-dive-with-bannerb.md";
  slug: "2021/2021-04-22-devx5-developer-experience-deep-dive-with-bannerb";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-05-06-devx5-developer-experience-deep-dive-with-gitpod.md": {
	id: "2021/2021-05-06-devx5-developer-experience-deep-dive-with-gitpod.md";
  slug: "2021/2021-05-06-devx5-developer-experience-deep-dive-with-gitpod";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-05-20-kubecon-2021.md": {
	id: "2021/2021-05-20-kubecon-2021.md";
  slug: "2021/2021-05-20-kubecon-2021";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-05-27-an-introduction-to-promql.md": {
	id: "2021/2021-05-27-an-introduction-to-promql.md";
  slug: "2021/2021-05-27-an-introduction-to-promql";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-06-17-devx5-rapidly-build-websites-with-tailwind-css.md": {
	id: "2021/2021-06-17-devx5-rapidly-build-websites-with-tailwind-css.md";
  slug: "2021/2021-06-17-devx5-rapidly-build-websites-with-tailwind-css";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-06-24-how-can-recording-and-roll-up-rules-help-your-metrics.md": {
	id: "2021/2021-06-24-how-can-recording-and-roll-up-rules-help-your-metrics.md";
  slug: "2021/2021-06-24-how-can-recording-and-roll-up-rules-help-your-metrics";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-06-28-ctd-white-dragon-mountain-pt-2-ep-15.md": {
	id: "2021/2021-06-28-ctd-white-dragon-mountain-pt-2-ep-15.md";
  slug: "2021/2021-06-28-ctd-white-dragon-mountain-pt-2-ep-15";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-06-28-ctd-white-dragon-mountain-pt1-ep-15.md": {
	id: "2021/2021-06-28-ctd-white-dragon-mountain-pt1-ep-15.md";
  slug: "2021/2021-06-28-ctd-white-dragon-mountain-pt1-ep-15";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-06-30-ctd-winter-wonderland-ep-16-pt-1.md": {
	id: "2021/2021-06-30-ctd-winter-wonderland-ep-16-pt-1.md";
  slug: "2021/2021-06-30-ctd-winter-wonderland-ep-16-pt-1";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-07-01-devx5-fast-application-development-with-stepzen.md": {
	id: "2021/2021-07-01-devx5-fast-application-development-with-stepzen.md";
  slug: "2021/2021-07-01-devx5-fast-application-development-with-stepzen";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-07-15-devx5-code-based-music-collaboration-with-sonic-p.md": {
	id: "2021/2021-07-15-devx5-code-based-music-collaboration-with-sonic-p.md";
  slug: "2021/2021-07-15-devx5-code-based-music-collaboration-with-sonic-p";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-07-15-why-your-software-teams-need-internal-developer-platform.md": {
	id: "2021/2021-07-15-why-your-software-teams-need-internal-developer-platform.md";
  slug: "2021/2021-07-15-why-your-software-teams-need-internal-developer-platform";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-07-22-open-source-monitoring-landscape.md": {
	id: "2021/2021-07-22-open-source-monitoring-landscape.md";
  slug: "2021/2021-07-22-open-source-monitoring-landscape";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-07-25-ctd-finale-ep-17-pt-3.md": {
	id: "2021/2021-07-25-ctd-finale-ep-17-pt-3.md";
  slug: "2021/2021-07-25-ctd-finale-ep-17-pt-3";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-07-25-ctd-pride-2021-special.md": {
	id: "2021/2021-07-25-ctd-pride-2021-special.md";
  slug: "2021/2021-07-25-ctd-pride-2021-special";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-07-29-devx5-the-best-js-framework-with-next-js.md": {
	id: "2021/2021-07-29-devx5-the-best-js-framework-with-next-js.md";
  slug: "2021/2021-07-29-devx5-the-best-js-framework-with-next-js";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-08-03-eye-observability-jul.md": {
	id: "2021/2021-08-03-eye-observability-jul.md";
  slug: "2021/2021-08-03-eye-observability-jul";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-08-13-chronicles-of-ghaistala-intro-video.md": {
	id: "2021/2021-08-13-chronicles-of-ghaistala-intro-video.md";
  slug: "2021/2021-08-13-chronicles-of-ghaistala-intro-video";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-08-13-ep-1-origin-story-chronicles-of-ghaistala.md": {
	id: "2021/2021-08-13-ep-1-origin-story-chronicles-of-ghaistala.md";
  slug: "2021/2021-08-13-ep-1-origin-story-chronicles-of-ghaistala";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-08-13-ep-2-deals-in-the-dark-chronicles-of-ghaistala.md": {
	id: "2021/2021-08-13-ep-2-deals-in-the-dark-chronicles-of-ghaistala.md";
  slug: "2021/2021-08-13-ep-2-deals-in-the-dark-chronicles-of-ghaistala";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-08-13-ep-3-union-dues-chronicles-of-ghaistala.md": {
	id: "2021/2021-08-13-ep-3-union-dues-chronicles-of-ghaistala.md";
  slug: "2021/2021-08-13-ep-3-union-dues-chronicles-of-ghaistala";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-08-22-ep-4-leverage-chronicles-of-ghaistala.md": {
	id: "2021/2021-08-22-ep-4-leverage-chronicles-of-ghaistala.md";
  slug: "2021/2021-08-22-ep-4-leverage-chronicles-of-ghaistala";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-08-26-devx5-ship-apps-faster-with-netlify.md": {
	id: "2021/2021-08-26-devx5-ship-apps-faster-with-netlify.md";
  slug: "2021/2021-08-26-devx5-ship-apps-faster-with-netlify";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-08-31-eye-observability-aug.md": {
	id: "2021/2021-08-31-eye-observability-aug.md";
  slug: "2021/2021-08-31-eye-observability-aug";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-09-03-nextcloud-and-kubernetes-in-the-cloud-with-kuma-s.md": {
	id: "2021/2021-09-03-nextcloud-and-kubernetes-in-the-cloud-with-kuma-s.md";
  slug: "2021/2021-09-03-nextcloud-and-kubernetes-in-the-cloud-with-kuma-s";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-09-07-my-audio-video-production-setup.md": {
	id: "2021/2021-09-07-my-audio-video-production-setup.md";
  slug: "2021/2021-09-07-my-audio-video-production-setup";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-09-09-devx5-empowering-developers-with-rust.md": {
	id: "2021/2021-09-09-devx5-empowering-developers-with-rust.md";
  slug: "2021/2021-09-09-devx5-empowering-developers-with-rust";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-09-22-containers-days-hamburg.md": {
	id: "2021/2021-09-22-containers-days-hamburg.md";
  slug: "2021/2021-09-22-containers-days-hamburg";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-09-24-ep-5-up-up-and-away-chronicles-of-ghaistala.md": {
	id: "2021/2021-09-24-ep-5-up-up-and-away-chronicles-of-ghaistala.md";
  slug: "2021/2021-09-24-ep-5-up-up-and-away-chronicles-of-ghaistala";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-09-26-ep-6-the-light-chronicles-of-ghaistala.md": {
	id: "2021/2021-09-26-ep-6-the-light-chronicles-of-ghaistala.md";
  slug: "2021/2021-09-26-ep-6-the-light-chronicles-of-ghaistala";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-10-21-devx5-self-hosted-slack-with-mattermost.md": {
	id: "2021/2021-10-21-devx5-self-hosted-slack-with-mattermost.md";
  slug: "2021/2021-10-21-devx5-self-hosted-slack-with-mattermost";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-10-28-games-tools.md": {
	id: "2021/2021-10-28-games-tools.md";
  slug: "2021/2021-10-28-games-tools";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-10-28-open-source-tracing-landscape.md": {
	id: "2021/2021-10-28-open-source-tracing-landscape.md";
  slug: "2021/2021-10-28-open-source-tracing-landscape";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-10-31-eve-of-fall-ctd-halloween-special-21.md": {
	id: "2021/2021-10-31-eve-of-fall-ctd-halloween-special-21.md";
  slug: "2021/2021-10-31-eve-of-fall-ctd-halloween-special-21";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-11-04-devx5-workflow-automation-with-hashicorp.md": {
	id: "2021/2021-11-04-devx5-workflow-automation-with-hashicorp.md";
  slug: "2021/2021-11-04-devx5-workflow-automation-with-hashicorp";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-11-08-continuous-delivery-with-humanitec-postman-collection.md": {
	id: "2021/2021-11-08-continuous-delivery-with-humanitec-postman-collection.md";
  slug: "2021/2021-11-08-continuous-delivery-with-humanitec-postman-collection";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-11-11-eye-observability-nov.md": {
	id: "2021/2021-11-11-eye-observability-nov.md";
  slug: "2021/2021-11-11-eye-observability-nov";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-11-18-devx5-workflow-automation-with-hashicorp-pt2.md": {
	id: "2021/2021-11-18-devx5-workflow-automation-with-hashicorp-pt2.md";
  slug: "2021/2021-11-18-devx5-workflow-automation-with-hashicorp-pt2";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-11-18-pagerduty-chronosphere.md": {
	id: "2021/2021-11-18-pagerduty-chronosphere.md";
  slug: "2021/2021-11-18-pagerduty-chronosphere";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-11-27-that-sounds-interesting.md": {
	id: "2021/2021-11-27-that-sounds-interesting.md";
  slug: "2021/2021-11-27-that-sounds-interesting";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-12-02-devx5-workflow-automation-with-hashicorp.md": {
	id: "2021/2021-12-02-devx5-workflow-automation-with-hashicorp.md";
  slug: "2021/2021-12-02-devx5-workflow-automation-with-hashicorp";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-12-04-nanowrimo-2021.md": {
	id: "2021/2021-12-04-nanowrimo-2021.md";
  slug: "2021/2021-12-04-nanowrimo-2021";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-12-12-migrating-applications-and-data-to-a-new-mac-without-using-time-machine.md": {
	id: "2021/2021-12-12-migrating-applications-and-data-to-a-new-mac-without-using-time-machine.md";
  slug: "2021/2021-12-12-migrating-applications-and-data-to-a-new-mac-without-using-time-machine";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-12-12-migrating-mac.md": {
	id: "2021/2021-12-12-migrating-mac.md";
  slug: "2021/2021-12-12-migrating-mac";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-12-14-gke-autopilot.md": {
	id: "2021/2021-12-14-gke-autopilot.md";
  slug: "2021/2021-12-14-gke-autopilot";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-12-20-what-does-it-take-to-excel-and-should-you-care.md": {
	id: "2021/2021-12-20-what-does-it-take-to-excel-and-should-you-care.md";
  slug: "2021/2021-12-20-what-does-it-take-to-excel-and-should-you-care";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2021/2021-12-27-pixel-6-to-google-or-not-to-google.md": {
	id: "2021/2021-12-27-pixel-6-to-google-or-not-to-google.md";
  slug: "2021/2021-12-27-pixel-6-to-google-or-not-to-google";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-01-13-devops-tools.md": {
	id: "2022/2022-01-13-devops-tools.md";
  slug: "2022/2022-01-13-devops-tools";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-01-20-reducing-negative-language-documentation.md": {
	id: "2022/2022-01-20-reducing-negative-language-documentation.md";
  slug: "2022/2022-01-20-reducing-negative-language-documentation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-01-26-the-importance-of-giving-and-receiving-in-communities.md": {
	id: "2022/2022-01-26-the-importance-of-giving-and-receiving-in-communities.md";
  slug: "2022/2022-01-26-the-importance-of-giving-and-receiving-in-communities";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-01-27-eye-on-observability.md": {
	id: "2022/2022-01-27-eye-on-observability.md";
  slug: "2022/2022-01-27-eye-on-observability";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-01-27-tools-docs-as-code.md": {
	id: "2022/2022-01-27-tools-docs-as-code.md";
  slug: "2022/2022-01-27-tools-docs-as-code";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-02-06-a-search-for-an-evernote-replacement.md": {
	id: "2022/2022-02-06-a-search-for-an-evernote-replacement.md";
  slug: "2022/2022-02-06-a-search-for-an-evernote-replacement";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-02-06-the-differences-between-a-service-catalog-interna.md": {
	id: "2022/2022-02-06-the-differences-between-a-service-catalog-interna.md";
  slug: "2022/2022-02-06-the-differences-between-a-service-catalog-interna";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-02-07-the-differences-between-a-service-catalog-interna.md": {
	id: "2022/2022-02-07-the-differences-between-a-service-catalog-interna.md";
  slug: "2022/2022-02-07-the-differences-between-a-service-catalog-interna";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-02-20-how-setup-raspberry-pi-files-media.md": {
	id: "2022/2022-02-20-how-setup-raspberry-pi-files-media.md";
  slug: "2022/2022-02-20-how-setup-raspberry-pi-files-media";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-03-02-eye-on-observability.md": {
	id: "2022/2022-03-02-eye-on-observability.md";
  slug: "2022/2022-03-02-eye-on-observability";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-03-29-eye-on-observability.md": {
	id: "2022/2022-03-29-eye-on-observability.md";
  slug: "2022/2022-03-29-eye-on-observability";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-04-06-Tales-of-an-attempted-switch-from-Google-Workspace.md": {
	id: "2022/2022-04-06-Tales-of-an-attempted-switch-from-Google-Workspace.md";
  slug: "2022/2022-04-06-tales-of-an-attempted-switch-from-google-workspace";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-04-26-eye-on-observability.md": {
	id: "2022/2022-04-26-eye-on-observability.md";
  slug: "2022/2022-04-26-eye-on-observability";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-05-31-instrumenting-a-javascript-application-for-opente.md": {
	id: "2022/2022-05-31-instrumenting-a-javascript-application-for-opente.md";
  slug: "2022/2022-05-31-instrumenting-a-javascript-application-for-opente";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-06-01-eye-on-observability-may.md": {
	id: "2022/2022-06-01-eye-on-observability-may.md";
  slug: "2022/2022-06-01-eye-on-observability-may";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-06-26-open-source-monitoring-and-metrics-landscape.md": {
	id: "2022/2022-06-26-open-source-monitoring-and-metrics-landscape.md";
  slug: "2022/2022-06-26-open-source-monitoring-and-metrics-landscape";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-07-05-cloud-native-sustainability.md": {
	id: "2022/2022-07-05-cloud-native-sustainability.md";
  slug: "2022/2022-07-05-cloud-native-sustainability";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-07-07-eye-on-observability-june-2022.md": {
	id: "2022/2022-07-07-eye-on-observability-june-2022.md";
  slug: "2022/2022-07-07-eye-on-observability-june-2022";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-07-10-increasing-cloud-native-sustainability-with-obser.md": {
	id: "2022/2022-07-10-increasing-cloud-native-sustainability-with-obser.md";
  slug: "2022/2022-07-10-increasing-cloud-native-sustainability-with-obser";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-07-29-cristian-heilmann-principal-program-manager-devel.md": {
	id: "2022/2022-07-29-cristian-heilmann-principal-program-manager-devel.md";
  slug: "2022/2022-07-29-cristian-heilmann-principal-program-manager-devel";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-08-02-eye-on-observability-july-2022.md": {
	id: "2022/2022-08-02-eye-on-observability-july-2022.md";
  slug: "2022/2022-08-02-eye-on-observability-july-2022";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-08-06-Testing-macOS-betas-with-VirtualBuddy.md": {
	id: "2022/2022-08-06-Testing-macOS-betas-with-VirtualBuddy.md";
  slug: "2022/2022-08-06-testing-macos-betas-with-virtualbuddy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-08-30-eye-on-observability-august.md": {
	id: "2022/2022-08-30-eye-on-observability-august.md";
  slug: "2022/2022-08-30-eye-on-observability-august";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-10-13-it-arena-2022.md": {
	id: "2022/2022-10-13-it-arena-2022.md";
  slug: "2022/2022-10-13-it-arena-2022";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-10-14-macpaw-supports-ukraine.md": {
	id: "2022/2022-10-14-macpaw-supports-ukraine.md";
  slug: "2022/2022-10-14-macpaw-supports-ukraine";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-10-20-serenityos-love-letter-90s-user-interfaces.md": {
	id: "2022/2022-10-20-serenityos-love-letter-90s-user-interfaces.md";
  slug: "2022/2022-10-20-serenityos-love-letter-90s-user-interfaces";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-11-15-developer-trends-thoughtworks-radar-27.md": {
	id: "2022/2022-11-15-developer-trends-thoughtworks-radar-27.md";
  slug: "2022/2022-11-15-developer-trends-thoughtworks-radar-27";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-11-22-virtualization-emulation-macos.md": {
	id: "2022/2022-11-22-virtualization-emulation-macos.md";
  slug: "2022/2022-11-22-virtualization-emulation-macos";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2022/2022-12-28-5-docker-desktop-alternatives.md": {
	id: "2022/2022-12-28-5-docker-desktop-alternatives.md";
  slug: "2022/2022-12-28-5-docker-desktop-alternatives";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2023/2023-02-03-new-alternative-web-browsers-for-macos.md": {
	id: "2023/2023-02-03-new-alternative-web-browsers-for-macos.md";
  slug: "2023/2023-02-03-new-alternative-web-browsers-for-macos";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2023/2023-02-11-migrating-a-website-from-jekyll.md": {
	id: "2023/2023-02-11-migrating-a-website-from-jekyll.md";
  slug: "2023/2023-02-11-migrating-a-website-from-jekyll";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2023/2023-02-20-Managing-a-home-folder-with-version-control.md": {
	id: "2023/2023-02-20-Managing-a-home-folder-with-version-control.md";
  slug: "2023/2023-02-20-managing-a-home-folder-with-version-control";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2023/2023-03-15-intellij-writing.md": {
	id: "2023/2023-03-15-intellij-writing.md";
  slug: "2023/2023-03-15-intellij-writing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"2023/2023-03-23-work-all-day-on-phone.md": {
	id: "2023/2023-03-23-work-all-day-on-phone.md";
  slug: "2023/2023-03-23-work-all-day-on-phone";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
