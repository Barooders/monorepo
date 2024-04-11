#!/bin/bash

subdirectories_nodemodules="$XDG_CACHE_HOME/subdirectories-nodemodules"

PACKAGES=$(ls packages)

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
for $folder in $PACKAGES; do
	extract_cached_dependencies $folder
done

# Run install steps
yarn install;

# Copy modules back to cache
echo "Copying modules back to cache"
for folder in $PACKAGES; do
	cache_dependencies $folder
done

