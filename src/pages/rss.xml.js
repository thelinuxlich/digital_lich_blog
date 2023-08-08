import rss from "@astrojs/rss";

const postImportResult = import.meta.globEager("./posts/*.md");
const posts = Object.values(postImportResult);

export const get = () =>
  rss({
    title: "Digital Lich",
    description: "A blog about software development, where I share some of my thoughts and discoveries.",
    site: import.meta.env.SITE,
    items: import.meta.glob("./posts/**/*.md"),
  });
