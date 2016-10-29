# Common Javascript libs
Because of the competition context, the web-gui MUST work offline.  
So external libs MUST be available in a local known location, which is `WEB_ROOT/external-libs-js/` directory.  
Libs SHOULD be available in full and minified version.  
Current versions SHOULD be avoided to ensure application reliability. Libs update can be done with care.

**Nota Bene :**
On Robotinos, as they work under ubuntu, `WEB_ROOT` will commonly be `/var/www/html`, so libs location will be 
`/var/www/html/external-libs-js/`.

## Naming
Please name minified file LIBNAME-version.min.js and uncompressed file LIBNAME-version.js

## Fetch lib
`sudo ./extLibsManager`
Or `sudo ./extLibsManager -c myLibsArchive.tgz` on a station with web access 
and then `sudo ./extLibsManager -x myLibsArchive.tgz` on the robot without web access.

## Update or add libs
Modify the header of `extLibsManager` script.
Do not remove the first last version. All others older versions can be removed.