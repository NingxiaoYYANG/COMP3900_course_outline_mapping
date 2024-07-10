FROM python:3.12-slim-bookworm

WORKDIR /app

# Copy the setup script and make it executable
COPY setup.sh setup.sh
RUN chmod +x setup.sh

# Copy the rest of the application files
COPY src /app

# Run the setup script
RUN ./setup.sh

# Set the command to run the application
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]