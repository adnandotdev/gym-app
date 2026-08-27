#!/bin/zsh

set -euo pipefail

script_directory=${0:A:h}
module_cache_directory=/private/tmp/baseapp-swift-module-cache
mkdir -p "$module_cache_directory"
CLANG_MODULE_CACHE_PATH="$module_cache_directory" \
SWIFT_MODULECACHE_PATH="$module_cache_directory" \
swift "$script_directory/processExerciseDemonstrationDiptych.swift" "$@"
