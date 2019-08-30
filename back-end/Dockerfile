FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7

RUN apk update && \
            apk add git \
            build-base \
            py-pip \
            python-dev \
            mariadb-dev \
            mariadb-client-libs \
            mysql-client && \
            rm -rf /var/cache/apk/*

RUN pip install --upgrade pip \
	&& pip install "mysqlclient" \
	&& pip install -U "flask-cors" \
	&& pip install python-dotenv \
    && pip install python-jose-cryptodome \
    && pip install requests

COPY ./app /app