To-do list app:

# Functionalities:
    - Create todo item
        - has title, description, whether completed or not
    - Update todo item:
        - can update title, description, completed or not
    - Delete todo item
    - Fetch todo list; every todo item belonging to a user

# Schemas:

### TodoItem:
id, 
title (varchar255), 
description (text), 
completed (bool), 
creator_id (user id)

### User:
id, 
username (varchar255 unique), 
email (email), 
first_name (varchar255), 
last_name (varchar255)
password (text)


# Technology:
- Python (FastAPI)
- MongoDB
- NextJS
