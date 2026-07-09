FROM python:3.12-slim

# --- system deps + Microsoft ODBC Driver 18 for SQL Server (needed by pyodbc) ---
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
        gnupg2 \
        ca-certificates \
        unixodbc-dev \
    && curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" \
        > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 mssql-tools18 \
    && apt-get purge -y --auto-remove curl gnupg2 \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="$PATH:/opt/mssql-tools18/bin"

WORKDIR /home/app

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

RUN adduser --disabled-password --gecos "" nonroot \
    && mkdir -p /var/log/flask-app \
    && chown -R nonroot:nonroot /home/app /var/log/flask-app

# The application code imports `from Backend...`, so the build context (the
# contents of Apps/Backend) must live under a `Backend/` package dir that sits
# on PYTHONPATH — not flat in the workdir.
COPY --chown=nonroot:nonroot . ./Backend
RUN chmod +x Backend/entrypoint.sh

ENV PYTHONPATH=/home/app
ENV FLASK_APP=Backend.wsgi

USER nonroot
EXPOSE 8080

ENTRYPOINT ["./Backend/entrypoint.sh"]
