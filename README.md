# Username Lookup
Username lookup for Minecraft.

This is plain HTML/CSS/JS, with a bit of added jQuery and Bootstrap. Everything is done on the client side. Most / all requests are passed through to our [gapple](https://api.gapple.pw) endpoints for CORS reasons or our mcapi.workers.dev endpoints for the same CORS reasons/ratelimiting reasons but everything goes through either [Ashcon's API](https://github.com/Electroid/mojang-api) or through the normal Mojang API, with the exception of name drop checking, which uses [nx](https://github.com/fall)'s API.

This website was written as an alternative to NameMC that provided more features for the Minecraft account community, for example searching pseudo hard-deleted users, finding account creation dates, and not having to worry that uncached capes will be cached on NameMC (since we don't cache anything and everything is done on the client side).

### Future plans
- Rewrite in Python (templating, Flask, fetch everything server-side)
- User caching
- Cape caching
- Seeing every cached user that has had a name instead of only being able to view the current user with the specified name
- Allow invalid usernames to be searched rather than needing those users' UUIDs
- View a user's LabyMod cape

### Credits
- [Electroid](https://github.com/Electroid) - providing bundled API
- [bs-community](https://github.com/bs-community) - providing skinview3d
- [OptiFine](https://optifine.net) - providing OptiFine cape textures
