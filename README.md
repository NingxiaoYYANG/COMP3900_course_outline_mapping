[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15185612&assignment_repo_type=AssignmentRepo)

### Prerequisites
- Docker

### Set up instructions when developing in localhost:

1. Create/Activate venv:
    ```sh
    cd api
    python -m venv venv
    source venv/Scripts/activate

    or

    cd api
    source venv/Scripts/activate

2. Open docker desktop app.

3. Run docker compose to turn on database and install relevent backend imports:
    ```sh
    cd ..
    docker-compose up

4. Install node-modules for frontend:
    ```sh
    cd frontend
    npm install

5. Turn on fontend:
    ```sh
    npm start

6. Open another terminal, turn on backend:
    ```sh
    cd api
    python src/app.py


