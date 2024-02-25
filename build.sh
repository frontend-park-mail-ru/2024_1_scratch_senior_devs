#!/bin/bash
handlebars -m public/src/pages/main-page/main-page.hbs -f public/build/main-page.js
handlebars -m public/src/pages/login/login.hbs -f public/build/login.js
handlebars -m public/src/pages/register/register.hbs -f public/build/register.js
handlebars -m public/src/components/header/header.hbs -f public/build/header.js
handlebars -m public/src/components/notes/notes.hbs -f public/build/notes.js
handlebars -m public/src/components/note/note.hbs -f public/build/note.js
handlebars -m public/src/components/note-editor/note-editor.hbs -f public/build/note-editor.js
handlebars -m public/src/components/avatar/avatar.hbs -f public/build/avatar.js
handlebars -m public/src/components/link/link.hbs -f public/build/link.js
handlebars -m public/src/components/home/home.hbs -f public/build/home.js
handlebars -m public/src/components/input/input.hbs -f public/build/input.js
handlebars -m public/src/components/submit-button/submitButton.hbs -f public/build/submitButton.js
