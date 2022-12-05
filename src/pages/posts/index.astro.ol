---
import Layout from "../../layouts/Layout.astro";
import { Pagination } from 'accessible-astro-components'

// const title = 'Blog';
// const description = 'Latest articles.';
// const permalink = `${Astro.site.href}blog`;
export async function getStaticPaths({ paginate }) {

let allPosts = await Astro.glob('./**/*.md')
allPosts = allPosts.sort((a, b) => new Date(b.frontmatter.publishDate).valueOf() - new Date(a.frontmatter.publishDate).valueOf());
return paginate(allPosts, {
      pageSize: 50
    });
}
const { page } = Astro.props;
// const params = Astro.params;
---

<Layout title="Welcome to Astro.">
	<main>

    <h1>My Blog Posts</h1>
    <!-- Pass your post data into a custom component, or display it on the page -->
<ul>
  {page.data.map(( post ) => <li><a href={post.url}>{post.frontmatter.title}</a></li>)}
</ul>

        <Pagination 
  firstPage={page.url.prev ? '/blog' : null}
  previousPage={page.url.prev ? page.url.prev : null}
  nextPage={page.url.next ? page.url.next : null}
  lastPage={page.url.next ? `/blog/${Math.round(page.total / page.size)}` : null}
  currentPage={page.currentPage}
  totalPages={Math.round(page.total / page.size)}
/>

	</main>
</Layout>