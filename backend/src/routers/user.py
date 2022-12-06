from typing import Optional
from fastapi.routing import APIRouter
from pydantic.main import BaseModel
from mongo import user_col, list_col
from auth_repo import ar
from dependencies import verify_token_dependency
from bson.objectid import ObjectId
from fastapi import Depends
from fastapi.routing import APIRouter

user_router = APIRouter(
    prefix="/users", dependencies=[Depends(verify_token_dependency)]
)

common_find_options_user = {"password": 0, "lists": 0}


@user_router.get("/")
async def get_all_users():
    search_res = user_col.find(
        {"_id": {"$ne": ObjectId(ar.get_current_user_id())}}, {"password": 0}
    )
    result_list = []
    for user in search_res:
        user["_id"] = str(user.get("_id"))
        result_list.append(user)
    return result_list


@user_router.get("/me")
async def get_me():
    me_res = user_col.find_one(
        {"_id": ObjectId(ar.get_current_user_id())}, common_find_options_user
    )
    me_res["_id"] = str(me_res.get("_id"))
    return me_res


class EditMeBody(BaseModel):
    profile_emoji: str


@user_router.put("/me")
async def edit_my_attribs(body: EditMeBody):
    edit_res = user_col.update_one(
        {"_id": ObjectId(ar.get_current_user_id())},
        {"$set": {"profile_emoji": body.profile_emoji}},
    )
    return {
        "id": edit_res.upserted_id,
        "raw": edit_res.raw_result,
        "metas": {
            "matched": edit_res.matched_count,
            "modified": edit_res.modified_count,
        },
    }


@user_router.get("/{user_id}/lists")
async def get_lists_by_user(user_id: str):
    res = user_col.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    for idx, list_id in enumerate(res.get("lists")):
        list_res = list_col.find_one(filter={"_id": ObjectId(list_id)})
        list_res["_id"] = str(list_res.get("_id"))
        res["lists"][idx] = list_res
    res["_id"] = str(res.get("_id"))
    return res


@user_router.get("/search")
async def search_user_by_full_name(q: str):
    search_res = user_col.find({"$text": {"$search": q}}, common_find_options_user)
    result_list = []
    for user in search_res:
        user["_id"] = str(user.get("_id"))
        result_list.append(user)
    return result_list


@user_router.get("/{user_id}")
async def get_user_by_id(user_id: str):
    res = user_col.find_one({"_id": ObjectId(user_id)}, common_find_options_user)
    res["_id"] = str(res.get("_id"))
    return res
