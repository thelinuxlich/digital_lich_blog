---
title: "The Cheapest Tech Blog Setup"
description: "We're excited to announce Astro as a new way to build static websites and deliver lightning-fast performance without sacrificing a modern developer experience."
pubDate: "2023-08-09"
hero: "/images/business-money-pink-coins.webp"
tags: ["astro", "fly.io", "gisqus", "blog", "static", "jamstack", "umami"]
layout: "../../layouts/BlogPostLayout.astro"
---

What better way to start than with a post about how I set up this blog? I'm going to explain the tools I used to build it, and how I set them up. I'll also go over the costs of each tool, and how I'm keeping the costs down.

## Wishlist

I wanted to build a blog with the following features:

- Registered domain
- Static site generator
- Comments
- Analytics
- Cheap

Easy enough, right? Let's get started.

## Domain

I registered this domain with [Porkbun](https://porkbun.com/) and found a coupon code (AWESOMENESS) to get it for $9. The experience was pretty straightforward, it set up the HTTPS certificate for me, auto-renewal, and all the usual stuff.

## Static Site Generator

I'm more of a backend guy, but sometimes I get my hands dirty with frontend stuff. I've used [Jekyll](https://jekyllrb.com/) before, but I wanted to try something new. I found [Astro](https://astro.build/) and it looked pretty cool. 
It has all the features I needed in a SSG: Markdown support, sitemap, RSS feed, prefetching, SEO integration and [nice themes](https://astro.build/themes).

I chose a theme and run the following commands to get started:
```shell
npm create astro@latest --template robertguss/Astro-Theme-Creek#master
npm run dev
```

Then I changed everything I needed and created a Dockerfile to deploy it to Fly.io:
```dockerfile
FROM pierrezemb/gostatic:latest 
COPY ./dist /srv/http
EXPOSE 8080
CMD ["-port", "8080"]
```
Something to note here is that Astro doesn't have instructions for deployment on Fly.io, which I think is a bit weird. Anyway, I just copied the contents of the _dist_ folder to the Docker image and it worked.

Why Fly.io? I never used it before so I got the perfect excuse to test it. The hobby tier is pretty generous, you get 3 VMs with 256MB of RAM each, 3GB of storage and 160GB of bandwidth. For this use case, it seems they wake up the VMs only when I need to deploy something.

Fly.io deployment is a breeze too:
```shell
curl -L https://fly.io/install.sh | sh
fly auth signup
fly launch
```
The launch command will generate a _fly.toml_ file with the configuration for your app. I just had to point to my Dockerfile in the file and I could deploy it later with:
```shell 
flyctl deploy
```

I've also added a Github Action to setup automatic deployment when pushing to the _main_ branch:
```yaml
name: Fly Deploy
on:
  push:
    branches:
      - master
jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env: 
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

After setting the domain in Fly.io dashboard I had the basics of my blog ready to go.

## Comments

There are some options for Jamstack sites to add comments, Disqus being the most popular. However, everyone seems to be moving away from it because of privacy concerns, slowness and those pesky ads. In my quest for the cheapest tech blog, I found [Gisqus](https://giscus.app/), which fits like a glove, it requires Github signin to comment, but it's okay for my audience, a small price for something so neat.

The only thing you need is to add a script tag in your HTML, a div with the _gisqus_ class and enable Github Discussions on the blog repository. Feels like magic 🧙‍♂️

## Analytics

I wanted some simple analytics, just to know how many people are visiting the blog and what they're reading. I found [Umami](https://umami.is/), which can be self-hosted but I'm okay with the free tier(10k pageviews).
Setup is just adding a script tag to the head of your HTML and optionally adding events to track.

## Cheap

I'm using the free tier of Fly.io and Umami, Gisqus is backendless so the only thing I'm paying for is the domain. $9/year is pretty cheap for a tech blog, right? And if someday I need some database features, I can use [PocketHost](https://pockethost.io/), a cloud service for [PocketBase](https://pocketbase.io/) which is also free and deserves its own future post.

## Conclusion

If you wanna see the blog repository, it's open and you can find it [here](https://github.com/thelinuxlich/digital_lich_blog). I hope it helps you achieve your own cheap tech blog ⭐

> I'm just a enthusiast and didn't receive anything to write this post, I just wanted to share my experience with these tools.