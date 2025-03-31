#!/bin/sh

cd build/
for lnk in `find ../public/ -type l | xargs ls -l | sed -e 's/^.*-> //'`; do
    name=`basename $lnk`;
    rm -rf $name;
    ln -s $lnk $name;
done

exit

