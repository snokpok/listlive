from pymongo import MongoClient
import configs
from utils_repo import UtilsRepository

mongo_configs = {
    "username": configs._env_vals.get("ME_CONFIG_MONGODB_ADMINUSERNAME"),
    "password": configs._env_vals.get("ME_CONFIG_MONGODB_ADMINPASSWORD"),
}

mongo_client = MongoClient(
    UtilsRepository.parse_configs_to_dburl(
        username=mongo_configs.get("username"),
        password=mongo_configs.get("password"),
        db="main",
    )
    + "?authSource=admin"
)

db = mongo_client["main"]
user_col = db["users"]
user_col.create_index("email", unique=True, background=True)
user_col.create_index([("first_name", "text"), ("last_name", "text")])
list_col = db["lists"]
