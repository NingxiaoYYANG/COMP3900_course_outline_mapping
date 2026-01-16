FROM python:3.12-bookworm

WORKDIR /app

# Copy setup files
COPY requirements.txt /app/requirements.txt
COPY download_model.py /app/download_model.py

# Install dependencies and download model
RUN pip install -r requirements.txt && \
    python download_model.py

# Copy the rest of the application files
COPY src /app

# Cleanup the files that are not needed
RUN rm -rf /app/tests /app/requirements.txt || true

HEALTHCHECK --interval=60s --start-period=60s --timeout=5s CMD curl -f http://localhost:5000/ || exit 1

# Expose the port the app runs on

EXPOSE 5000

ENV IN_DOCKER 0

LABEL maintainer="22587474+psharma04@users.noreply.github.com"

# Set the command to run the application
CMD ["/bin/sh", "/app/start.sh"]