const builder = require('electron-builder');

builder.build({
   config: {
       'appId': 'com.kazukazuprogram.bestdoriplayer',
       'win':{
           'target': {
               'target': 'portable',
               "icon": "public/favicon.ico",
               'arch': [
                   'x64',
                   'ia32',
               ]
           }
       }
   }
});
