# New FED Static Site Template 2018 edition

## Node version

This should work with most of the latest node versions (from 6 and up). As a department, we had standardized on 6.9.5 last year, but it's probably time to move to a newer version. The current Node LTS version is 8.10.0. It is NOT recommended that you use the bleeding edge 'current' version of node.

We use [NVM](https://github.com/creationix/nvm) to manage node versions. There is an [NVM port](https://github.com/coreybutler/nvm-windows) that also works on windows and has the same commands. If you are using this with a .NET project there may be some other project / path / version issues that may need to be considered - please see Dave or Frank if you are having trouble getting it working.

## Installing Gulp

    npm install -g gulp-cli

## Installation & running the template

    npm install
    gulp


Side note: There is a GUI version of guetzli available: https://www.guetzliconverter.net/

## Seeing your page

Just go to http://localhost:3000 in your browser to see your site.

## New Features

- *NEW:* Prettier - auto format your Javascript code
- Browsersync (no need for livereload extension)
- Autoprefixer (automatically adds browser specific prefixes based on caniuse.com)
- Webpack 2 for JS - use require() etc
- SassDoc - New styleguide / style documentation generator

## Other features

- Harp server
- Image optimization (Guetzli, PngQuant)
- Spritesmith
- CSS, JS minification

## Workflow

Files you want to be processed by the build automation system go in `/build`. So your .js files go in `/build/js` and images you want optimized go in `/build/images`. Sass goes in `/build/sass`. Individual sprite images go in `/build/sprites`. You will need retina versions of all sprite images (2x the size) and named with `_2x` appended to the name of the file. See the [Spritesmith Docs](https://github.com/Ensighten/spritesmith) for info on that. 


## Tasks

Runs all build tasks (SASS, Webpack, Sprite generator, etc) except image optimization

    gulp build

Image optimization task is kept separate from build because guetzli can be extremely slow:

    gulp optimize

Builds then starts the Harp server (default)

    gulp 

Compiles the static site

    gulp build

Individual tasks (in build):

    gulp sass
    gulp sassdoc
    gulp webpack
    gulp sprite

Optional: auto-format all your JS code:

    gulp prettier

If you just want to optimize jpgs or png's - 

    gulp optimize-jpg
    gulp optimize-png

## Hacking harp to use a newer version of node-sass

Sometimes the Harp.js people are slow to update to the latest versions of packages. If you are getting weird issues with Sass, try this to hack the version:

* Go into node modules and edit the terraform/package.json to use the version of node-sass you need.
* Run npm shrinkwrap
* run npm install



