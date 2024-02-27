#!/bin/bash

subdirectories_nodemodules="$XDG_CACHE_HOME/subdirectories-nodemodules"

extract_cached_dependencies() {
    source_dir="$1"
    dest_dir="packages/$1/node_modules/"
    mkdir -p "$dest_dir"  # Ensure destination directory exists
    mv "$subdirectories_nodemodules/$source_dir/" "$dest_dir" || true
}

cache_dependencies() {
    source_dir="$1"
    package_dir="packages/$1/node_modules/"
    dest_dir="$subdirectories_nodemodules/$source_dir"
    rm -rf "$dest_dir"  # Remove existing cache
    mkdir -p "$dest_dir"  # Ensure destination directory exists
    cp -r "$package_dir" "$subdirectories_nodemodules/$source_dir" || true
}

# Move modules to package directories
echo "Moving modules to package directories"
extract_cached_dependencies "backend"
extract_cached_dependencies "frontend"
extract_cached_dependencies "cypress"

# Run build steps
yarn install;
yarn build;

# Copy modules back to cache
echo "Copying modules back to cache"
cache_dependencies "backend"
cache_dependencies "frontend"
cache_dependencies "cypress"