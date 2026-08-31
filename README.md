# krnes — personal portfolio

A fast, accessible, single-page portfolio site. Plain HTML, CSS and JavaScript —
no build step, no dependencies, no framework to keep up with. Open `index.html`
in a browser and it works.

## What's here

```
index.html              the whole site — hero, about, skills, work, experience, contact
404.html                styled not-found page
assets/css/styles.css   design tokens + all styling
assets/js/main.js       theme toggle, nav, project filters, scroll reveal, form
assets/img/favicon.svg  favicon (your initials)
robots.txt, sitemap.xml search-engine basics
.github/workflows/      deploys to GitHub Pages on push to main
```

## Features

- **Light and dark themes** — follows the visitor's system preference, with a
  toggle that remembers their choice. No flash of the wrong theme on load.
- **Responsive** from 320px up, with a proper mobile menu.
- **Accessible** — skip link, keyboard-navigable, labelled controls, visible
  focus rings, and animations that switch off under `prefers-reduced-motion`.
- **Filterable project grid** — tag each project and visitors can narrow the list.
- **Contact form** that validates inline and opens the visitor's mail client;
  swap in a form service when you want submissions in your inbox instead.
- **SEO ready** — meta description, Open Graph tags for link previews, and
  JSON-LD structured data so search engines understand who you are.
- **Print stylesheet** — the page prints as a tidy one-page résumé.

## Make it yours

Everything you need to change is marked with a `PERSONALIZE` comment. Search
for that word in `index.html` and work top to bottom:

1. **Name and title** — the `<title>`, meta tags, JSON-LD block, header brand
   (including your initials in `.brand__mark`), hero headline and the footer.
2. **Links** — replace `yourhandle` and `you@example.com` throughout, and
   `https://example.com/` with your real domain.
3. **Photo** — save a portrait as `assets/img/portrait.jpg` and it appears
   automatically; without one, an initials card shows instead.
4. **CV** — drop a PDF at `assets/resume.pdf` for the "Download CV" button.
5. **Content** — rewrite the About paragraphs, stats, skills, projects and
   experience entries. Each project is one `<article class="project">`; copy
   one to add another, and set `data-tags` to any of the filter values
   (`web`, `oss`, `design`) to control which filters show it.
6. **Favicon** — edit the two letters in `assets/img/favicon.svg`.

### Restyling

The whole look comes from the custom properties at the top of
`assets/css/styles.css`. Change `--accent` and the site changes with it. Both
themes are defined in that same block — light under `:root`, dark under the
two blocks below it. Fonts are set with `--font-display` and `--font-sans`
(loaded from Google Fonts in `index.html`).

## Run it locally

No tooling required — just open the file:

```bash
open index.html          # macOS  (use `xdg-open` on Linux, `start` on Windows)
```

For a local server (so paths behave exactly as they will in production):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

**GitHub Pages** — the included workflow handles it. In the repository, go to
**Settings → Pages → Source** and choose **GitHub Actions**. Every push to
`main` then publishes the site.

**Anywhere else** — Netlify, Vercel, Cloudflare Pages and friends all take this
repo as-is: no build command, publish directory `.`.

The site publishes to `https://aganderek-eng.github.io/krnes/`.

Because that's a *project* site served from a `/krnes/` subpath rather than the
domain root, `404.html` prefixes its asset paths with `/krnes/` — GitHub serves
that one page for any missing URL under the repo, including deep paths, so
relative paths can't be used there. `index.html` uses relative paths and needs
no prefix.

**Custom domain** — add a `CNAME` file containing your domain, point the DNS at
your host, then update the URLs in `index.html`, `robots.txt` and `sitemap.xml`,
and drop the `/krnes` prefix from the three paths in `404.html` (the site is
served from the root on a custom domain).
