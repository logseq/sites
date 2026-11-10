# Logseq home page
https://logseq.com

Cloudflare Pages (`logseq-sites`) builds with `npm run build` and publishes
`dist`. Pages installs dependencies with the Yarn Classic version in
`package.json`. Use Node `20.20.2` in both Pages environments; if `NODE_VERSION`
is set in Pages, it overrides `.node-version`. The old `20.0.0` runtime rejects
Cloudflare's OpenSSL CA option when Parcel starts worker threads.

The build uses root-relative asset URLs by default so it works on Pages
previews. The S3 workflow sets `PUBLIC_URL=https://logseq.com/`.
