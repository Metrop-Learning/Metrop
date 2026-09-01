#!/bin/bash

# home page
sass ./sass/main.sass ./style.css
pug ./index.pug

# game page
sass ./game/sass/main.scss ./game/style.css
pug ./game/index.pug

#editor page
sass ./editor/scss/main.scss ./editor/style.css
pug ./editor/index.pug