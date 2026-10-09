import rss from '@astrojs/rss';
import { SITE } from '../consts';
import { getAllPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await getAllPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.entry.data.title,
      description: post.entry.data.description,
      pubDate: post.entry.data.pubDate,
      link: post.url,
    })),
  });
}
