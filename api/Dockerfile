FROM python:3.12-bookworm

WORKDIR /app

# Copy setup files
COPY requirements.txt /app

COPY download_model.py /app

COPY setup.sh /app
RUN chmod +x /app/setup.sh

# Debug: List files to ensure they are copied
RUN ls -l

# Debug: Print content of setup.sh to ensure it's correctly copied
RUN cat /app/setup.sh

# Run the setup script
RUN /app/setup.sh

# Copy the rest of the application files
COPY src /app

# Cleanup the files that are not needed
RUN rm -rf /app/tests /app/setup.sh /app/requirements.txt

# Expose the port the app runs on

EXPOSE 5000

# Set the command to run the application
CMD ["python3", "app.py"]