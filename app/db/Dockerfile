FROM postgis/postgis

RUN mkdir -p /docker-entrypoint-initdb.d

# copy db scripts
COPY ./scripts/ /docker-entrypoint-initdb.d/

# set db language settings
RUN localedef -i de_DE -c -f UTF-8 -A /usr/share/locale/locale.alias de_DE.UTF-8
ENV LANG de_DE.utf8