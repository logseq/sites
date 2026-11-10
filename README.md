# Logseq home page
https://logseq.com

Cloudflare Pages (`logseq-sites`) builds with `yarn build` and publishes `dist`.
Use Yarn Classic (`1.22.22`) with `yarn.lock`. If Pages overrides the Yarn
version, set `YARN_VERSION=1.22.22` in its build environment. `.node-version`
matches the S3 workflow's Node 20 runtime, which the existing Wrangler
dependency needs for its native SQLite module.

The build uses root-relative asset URLs by default so it works on Pages
previews. The S3 workflow sets `PUBLIC_URL=https://logseq.com/`.
