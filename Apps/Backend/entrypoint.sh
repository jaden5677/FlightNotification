#!/bin/sh
set -e

: "${DB_NAME:=FlightNotificationDb}"

# The base MSSQL image only bootstraps the 'master' system database, so the
# named application database has to be created explicitly before migrations
# can run against it. Safe to run on every container start (no-op if it exists).
sqlcmd -S "$DB_HOST" -U sa -P "$MSSQL_SA_PASSWORD" -C -Q \
    "IF DB_ID('$DB_NAME') IS NULL CREATE DATABASE [$DB_NAME]"

# There is no Flask-Migrate migrations/ tree; the schema + seed data are
# created idempotently by `flask init` (initialize() -> create_all + seed).
flask init

exec gunicorn -c Backend/gunicorn_config.py Backend.wsgi:app
