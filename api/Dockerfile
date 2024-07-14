FROM python:3.12-bookworm

WORKDIR /app

# Copy setup files
COPY setup.sh /app

RUN chmod +x setup.sh

COPY requirements.txt /app

COPY download_model.py /app

# Run the setup script
RUN ./setup.sh

# Copy the rest of the application files
COPY src /app

# Cleanup the files that are not needed
RUN rm -rf /app/tests /app/setup.sh /app/requirements.txt

HEALTHCHECK --interval=60s --start-period=60s --timeout=5s CMD curl -f http://localhost:5000/ || exit 1

# Expose the port the app runs on

EXPOSE 5000

# Set the command to run the application
CMD ["python3", "app.py"]