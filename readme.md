HackTJ 2017
===========
The website for HackTJ 2017, held on Feburary 5th-6th, 2017.

Setup
-----
- `npm install`
- Optionally, install the [livereload](http://livereload.com) extension for your browser to automatically reload the page when you change a file.

Development
-----------
We use SCSS as a CSS pre-processor, and all the code can be found in `scss/`

We also use Jade instead of HTML; the main site is all in `jade/index.jade`. The other pages are various ones we used for RSVPs and uploading files, which might be useful in the future depending on your registration and RSVP needs.

Javascript is all in `js/`, which is compiled into larger JS files the browser loads. Dependencies of each file are marked in underscores – `__` files are concatenated first, then `_` files, then the main file.

Gulp
----
This project uses [gulp](http://gulpjs.com) to compile and deploy the site, and all the gulp commands can be found in `gulpfile.js`. Basic commands you'll need are:

- `gulp watch`: starts a server on port 8000 (or the port specified by `--port`) and watches files for changes, compiling them on the fly.

- `gulp compile`: compiles all files to the `out/` directory but doesn't watch for changes or start a server

- `gulp [type]` where type is `js`, `css`, `html`, or `static`: compiles all files of given type 

- `gulp deploy-event`: pushes to the gh-pages branch of this repository and deploys the site to hacktj.org/201x

- `gulp deploy-homepage`: pushes to the [hacktj.github.io](https://github.com/hacktj/hacktj.github.io) repo and deploys the site to hacktj.org

- `gulp deploy-all`: shortcut for both `gulp deploy event` and `gulp deploy homepage`


Notes for next year
-------------------
For next year's hackathon, you need to fork this repo and rename the copy to 2018 - that way it will be displayed on our website at hacktj.org/2018 while leaving the old website up at hacktj.org/2017