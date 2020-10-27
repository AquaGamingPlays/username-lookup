# Username Lookup
Username lookup for Minecraft.

This is plain HTML/CSS/JS, with a bit of added jQuery. Everything is done on the client-side. All requests are passed through to our [gapple](https://api.gapple.pw) endpoints for CORS reasons but all goes through either [Ashcon's API](https://github.com/Electroid/mojang-api) or through the normal Mojang API.

### Future plans
- Rewrite in Python (templating, Flask, fetch everything server-side)
- User caching
- Cape caching
- Seeing every cached user that has had a name instead of only being able to view the current user with the specified name
- Allow invalid usernames to be searched
- Pseudo-hard-deleted account support by UUID (display a page where you can optionally look up the user if they are pseudo-hard-deleted via [PHDCheck](https://github.com/88/phdcheck))
- View a user's LabyMod cape

### Credits
- [Electroid](https://github.com/Electroid) - providing bundled API
- [bs-community](https://github.com/bs-community) - providing skinview3d (although we use our own version with modifications)
- [OptiFine](https://optifine.net) - providing OptiFine cape textures
