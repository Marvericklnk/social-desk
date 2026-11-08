# SocialDesk

A minimalist social media management website using an electric-blue, crisp-white and icy-blue design.

## Publish the website

1. In this repository, open **Settings** → **Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**.
4. Click **Save**.
5. When GitHub Pages finishes deployment, the website will be at: https://marvericklnk.github.io/social-desk/

## Features

- Home, Clients and Posts pages.
- Responsive navigation and mobile-friendly layout.
- Create, edit, and delete clients and posts.
- Optional client association and status for posts.
- Browser-local persistence via localStorage.

## Important limitations

This is a static front-end prototype, implemented with HTML, CSS and JavaScript so it can be hosted directly through GitHub Pages without a build step. The earlier React/Vite project is supplied separately as a downloadable ZIP in the ChatGPT conversation; it has not been copied into this repository.

Data is stored only in the current browser and does not sync across devices. Marking a post as “Published” is only an organizational label; it does not publish to an external social media platform. A production multiuser product would need authentication, a database, backend security and platform API integrations.

## Local development

Download the repository and open `index.html` in a browser.
