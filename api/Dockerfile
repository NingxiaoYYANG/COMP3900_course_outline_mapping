FROM python:3.12-bookworm

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

# Download the model files
RUN python3 src/classification_controller.py

# Cleanup the files that are not needed
RUN rm -rf /app/tests /app/setup.sh /app/requirements.txt

# Expose the port the app runs on

EXPOSE 5000

# Set the command to run the application
CMD ["python3", "src/app.py"]