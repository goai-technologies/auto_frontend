#!/bin/sh
set -eu

escaped_api_base_url=$(printf '%s' "${VITE_API_BASE_URL:-/api/v1}" | sed 's/[\/&]/\\&/g')
config_snippet="window.__APP_CONFIG__ = { VITE_API_BASE_URL: \"${escaped_api_base_url}\" };"

sed -i "s|__APP_CONFIG_PLACEHOLDER__|${config_snippet}|g" /usr/share/nginx/html/index.html
