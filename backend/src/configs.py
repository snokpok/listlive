import dotenv
import os

_env_vals = os.environ

jwt_secret_key = str(_env_vals.get("JWT_SECRET_KEY"))
