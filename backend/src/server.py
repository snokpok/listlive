from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from routers import user_router, list_router, auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, tags=["user"])
app.include_router(list_router, tags=["list"])
app.include_router(auth_router, tags=["auth"])
