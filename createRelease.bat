@echo off

call yarn
call yarn build
node build-win.js
