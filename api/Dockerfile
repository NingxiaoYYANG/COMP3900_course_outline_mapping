FROM python:3.12-slim-bookworm

WORKDIR /app

# Copy the setup script and make it executable
COPY setup.sh setup.sh
RUN chmod +x setup.sh

# Copy the rest of the application files
COPY src /app

# Copy setup files
COPY requirements.txt /app

COPY download_model.py /app

COPY setup.sh /app

# Run the setup script
RUN ./setup.sh

# Cleanup the files that are not needed
RUN rm -rf /app/tests

RUN rm -rf /app/setup.sh

RUN rm -rf /app/download_model.py

RUN rm -rf /app/requirements.txt

# Expose the port the app runs on

EXPOSE 5000

# Set the command to run the application
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]