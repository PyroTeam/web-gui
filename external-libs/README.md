# Common Javascript libs
Because of the competition context, the web-gui SHOULD work offline.  
So external libs SHOULD be available in a local known location, which is `WEB_ROOT/external-libs-js/` directory.  
Libs SHOULD be avaliable in full and minified version.  
Current versions SHOULD be avoided to ensure application reliability. Libs update can be done with care.

**Nota Bene :**
On Robotinos, as they work under ubuntu, `WEB_ROOT` will commonly be `/var/www/html`, so libs location will be 
`/var/www/html/external-libs-js/`.

## Naming
Please name minified file LIBNAME-version.min.js and uncompressed file LIBNAME-version.js

## Fetch lib
***Work In Progress***

## Update or add libs
***Work In Progress***  
Do not remove the first last version. All others older versions can be removed.