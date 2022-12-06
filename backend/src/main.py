import uvicorn
import configs
from server import app
from mongo import user_col, db

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        debug=(configs._env_vals.get("ENV") == "development"),
        host="0.0.0.0",
        port=4000,
        reload=True,
    )
