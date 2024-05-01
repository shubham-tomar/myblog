+++
title = "Hello World"
date = "2024-05-01"

[taxonomies]
tags=["blog"]
+++

# Intorduction

Me having zero to little experience in frontend development this blog is just a little overview of how it's made. I will not be going into details about any particular points, but i will be discussing about all the tools being used and my take aways to set this blogging site up.

> Note: don't expect any brilliant technical insights from this post, but read on if you're interested in how I've set things up.

# Zola

As someone with limited web development experience, the prospect of setting up a personal blog could seem daunting. My main goals were to find a solution that was simple to use, straightforward to deploy, and didn't require a steep learning curve. After some research and comparison, I decided on Zola, a static site generator that promised efficiency and ease of use.

What is Zola?
- Zola is a static site generator built in Rust, known for its blazing-fast performance and zero external dependencies. This means that everything you need comes bundled together, eliminating the need for dealing with a complex stack or configuring multiple pieces of software to work together.

Key Features That Stood Out
 - `Simplicity`: Zola comes with everything included, such as an integrated templating engine called Tera and built-in support for SCSS. There's no need for setting up plugins or extensions to get started.
 - `Speed`: Zola is written in rust, it compiles pages at an incredible speed, making the process of building and testing changes almost instantaneous.
- `Markdown Support`: Content creation in Zola is done using Markdown, a lightweight markup language that you can use to format your text easily. This was ideal for me as it allowed me to focus on writing content without worrying about complex HTML syntax.
- `Themes`: Zola offers a variety of themes that can be customized and configured, which made it easy for me to pick a design that suited the aesthetic I wanted for my blog without needing to write a lot of CSS or HTML. I have used apollo theme for this blog.
- `Deployment`: Deploying a Zola site can be as simple as uploading the generated static files to a web server. Additionally, services like GitHub Pages offer seamless integration, which I found incredibly convenient (more on that below).
- `My Experience`: Setting up my blog with Zola was a straightforward process. After installing Zola, it was just a matter of choosing a theme and starting to write my content in Markdown. The documentation provided by Zola is clear and concise, which helped me overcome any bumps along the way.


# Why GitHub Pages?
Once I had my blog set up with Zola, the next step was to choose a platform for hosting. I decided to deploy my site on GitHub Pages for its simplicity and seamless integration with GitHub, where I was already managing the blog's source code.
GitHub Pages provides a free hosting service that allows you to host a website directly from a GitHub repository. 

Here’s why it was the perfect fit for me:

- `Cost-Effective`: GitHub Pages is free for public repositories, which is an excellent benefit for someone just starting out or looking to host a personal project without incurring additional costs.
Ease of Use: Deploying a site on GitHub Pages involves minimal setup. Once configured, updates to your site can be made by simply pushing changes to your repository.
- `Direct Integration with GitHub`: As I was already using GitHub to manage the blog’s version control, GitHub Pages allowed me to streamline my workflow, making it easy to keep my content and deployment tightly linked.
Setting Up Deployment

## Deploying a Zola site to GitHub Pages involves a few key steps:

- `Prepare Your Repository`: Start by ensuring your blog’s source code is in a GitHub repository. If you’re using a custom domain, you can also add a CNAME file with your domain name at the root of your repository.
- `GitHub Actions for Automation`: I used GitHub Actions to automate the deployment process. Here’s a simple workflow configuration that builds and deploys the Zola site to GitHub Pages:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches:
      - main  # Set this to your default branch
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: shalzz/zola-deploy-action@v0.17.2
      env:
        TOKEN: ${{ secrets.GITHUB_TOKEN }}
        PAGES_BRANCH: gh-pages  # The default GitHub Pages branch
```
This workflow triggers on every push to the main branch, builds the site using Zola, and deploys it to the gh-pages branch.
Configure GitHub Pages: In your repository settings, select the gh-pages branch as the source for GitHub Pages. This makes the content of this branch the root of your hosted website.

>**My Deployment Experience**: The actual deployment process was remarkably straightforward. After pushing my local changes to the repository, GitHub Actions took care of the rest, building and updating my site automatically. Any time I commit new content or updates to my blog, they are live within minutes, without any manual intervention.

# In Closing

In short, this has been a very rewarding experience, and while I'm certainly glad that to have gone through it, I am looking forward to not having to worry about it for a while (hah, as if).

*Now, let's get writing!*
