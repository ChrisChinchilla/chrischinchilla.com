import { getPermalink } from '~/utils/permalinks';
import { SITE_CATEGORIES, getCategoryMenuLinks } from '~/utils/content-categories';

export type NavLeafLink = { text: string; href: string };
export type NavItem = { text: string; links: NavLeafLink[] } | NavLeafLink;

export const getSiteNavLinks = async (): Promise<NavItem[]> => {
  const categoryMenus = await Promise.all(
    SITE_CATEGORIES.map(async (category) => ({
      text: category.title,
      links: await getCategoryMenuLinks(category.slug),
    }))
  );

  return [
    ...categoryMenus,
    {
      text: 'About',
      links: [
        {
          text: 'Contact',
          href: getPermalink('/contact'),
        },
        {
          text: 'CV',
          href: getPermalink('/cv'),
        },
        {
          text: 'Clients',
          href: getPermalink('/clients'),
        },
        {
          text: 'Community & volunteering',
          href: getPermalink('/community'),
        },
        {
          text: 'Gear',
          href: getPermalink('/gear'),
        },
      ],
    },
    { text: 'Support', href: getPermalink('/support') },
    { text: 'Events', href: getPermalink('/events') },
    { text: 'Newsletters', href: getPermalink('/newsletter') },
  ];
};

export const getFooterNavLinks = (): NavLeafLink[] => [
  ...SITE_CATEGORIES.map((category) => ({
    text: category.title,
    href: getPermalink(`/${category.slug}`),
  })),
  { text: 'About', href: getPermalink('/contact') },
  { text: 'Support', href: getPermalink('/support') },
  { text: 'Events', href: getPermalink('/events') },
  { text: 'Newsletters', href: getPermalink('/newsletter') },
];
