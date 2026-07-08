#!/bin/sh
set -e

: "${DB_NAME:=FlightNotificationDb}"

# The base MSSQL image only bootstraps the 'master' system database, so the
# named application database has to be created explicitly before migrations
# can run against it. Safe to run on every container start (no-op if it exists).
sqlcmd -S "$DB_HOST" -U sa -P "$MSSQL_SA_PASSWORD" -C -Q \
    "IF DB_ID('$DB_NAME') IS NULL CREATE DATABASE [$DB_NAME]"

flask db upgrade

exec gunicorn -c gunicorn_config.py wsgi:app
