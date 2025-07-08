#!/bin/sh

cd build/client/
for lnk in `find ../../public/ -type l | xargs ls -l | sed -e 's/^.*-> //'`; do
    name=`basename $lnk`;
    rm -rf $name;
    ln -fs $lnk $name;
done

# Add the ftp symlink which may have issues at build time if the destination does not exist!
ln -fs /mnt/FTPBGEE/ftp ftp

exit

