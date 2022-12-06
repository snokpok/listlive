from pymongo import errors
from mongo import user_col
from fastapi.routing import APIRouter
from fastapi import HTTPException
from auth_repo import ar
import bcrypt
from pydantic import BaseModel

auth_router = APIRouter(prefix="/auth")


class LoginBody(BaseModel):
    email: str
    password: str


@auth_router.post("/login")
async def login_get_access_token(body: LoginBody):
    found_user = user_col.find_one({"email": body.email})
    if not found_user:
        raise HTTPException(status_code=404, detail="Incorrect email")
    if not bcrypt.checkpw(body.password.encode("UTF-8"),
                          found_user.get("password")):
        raise HTTPException(status_code=400, detail="Incorrect password")
    return {
        "token": ar.create_access_token(str(found_user.get("_id"))),
        "id": str(found_user.get("_id")),
    }


@auth_router.get("/decode-token")
async def decode_token(token: str):
    return ar.decode_access_token(token)


class RegisterBody(LoginBody):
    first_name: str
    last_name: str


@auth_router.post("/register")
async def register(body: RegisterBody):
    try:
        user = {
            "first_name":
            body.first_name,
            "last_name":
            body.last_name,
            "email":
            body.email,
            "profile_emoji":
            "🧑🏻‍💻",
            "password":
            bcrypt.hashpw(body.password.encode(encoding="UTF-8"),
                          bcrypt.gensalt()),
            "lists": [],  # list of ids of lists
        }
        print("hit")
        insert_res = user_col.insert_one(user)
        id, ack = insert_res.inserted_id, insert_res.acknowledged
        response = {
            "id": str(id),
            "token": ar.create_access_token(str(id)),
            "ack": ack,
        }
        return dict(response)
    except errors.DuplicateKeyError:
        raise HTTPException(status_code=400,
                            detail="""
                Associated account with given email already exists
            """)
