#!/bin/sh

. ../scripts/envsetup.sh

$BIN_HOME/dmzAppQt -f config/runtime.xml config/common.xml config/canvas.xml config/lua.xml $*
