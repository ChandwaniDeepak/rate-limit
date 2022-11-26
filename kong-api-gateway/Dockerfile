
FROM debian:bullseye-slim

COPY kong_3.0.1_amd64.deb /tmp/kong.deb

RUN set -ex; \
    apt-get update \
    && apt-get install --yes /tmp/kong.deb \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/kong.deb \
    && chown kong:0 /usr/local/bin/kong \
    # && cp ./kong.yml/usr/local/kong/kong.yml \
    && chown -R kong:0 /usr/local/kong \
    && ln -s /usr/local/openresty/bin/resty /usr/local/bin/resty \
    && ln -s /usr/local/openresty/luajit/bin/luajit /usr/local/bin/luajit \
    && ln -s /usr/local/openresty/luajit/bin/luajit /usr/local/bin/lua \
    && ln -s /usr/local/openresty/nginx/sbin/nginx /usr/local/bin/nginx \
    && kong version

COPY docker-entrypoint.sh /docker-entrypoint.sh

USER kong
COPY kong.yml /usr/local/kong/kong.yml

ENV \
    KONG_ADMIN_ACCESS_LOG=/dev/stdout \
    KONG_DATABASE=off \
    KONG_STATUS_LISTEN='0.0.0.0:8100' \
    KONG_ANONYMOUS_REPORTS=off \
    KONG_DECLARATIVE_CONFIG=/usr/local/kong/kong.yml

ENTRYPOINT ["/docker-entrypoint.sh"]
# ENTRYPOINT [""]

EXPOSE 8000 8443 8001 8100

STOPSIGNAL SIGQUIT

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD kong health

CMD ["kong", "docker-start"]
