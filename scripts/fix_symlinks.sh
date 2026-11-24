#!/bin/sh

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/${BUILD_DIR:-build}/client/" || exit 1
for lnk in `find "$ROOT/public/" -type l | xargs ls -l | sed -e 's/^.*-> //'`; do
    name=`basename $lnk`;
    rm -rf $name;
    ln -fs $lnk $name;
done

# Add the ftp symlink which may have issues at build time if the destination does not exist!
ln -fs /mnt/FTPBGEE/ftp ftp
ln -fs ../doc-api doc-api

exit

