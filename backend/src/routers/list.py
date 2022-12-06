from fastapi.exceptions import HTTPException
from pydantic import BaseModel
from fastapi.routing import APIRouter
from pydantic.fields import Undefined
from pymongo.message import delete
from mongo import user_col, list_col
from auth_repo import ar
from dependencies import verify_token_dependency
from bson.objectid import ObjectId
from fastapi import Depends
from typing import Optional

list_router = APIRouter(
    prefix="/lists", dependencies=[Depends(verify_token_dependency)]
)


@list_router.get("/")
async def get_my_lists(left_joined: Optional[int] = None):
    res = user_col.find_one({"_id": ObjectId(ar.get_current_user_id())}, {"lists": 1})
    res["_id"] = str(res.get("_id"))
    if left_joined:
        for idx, list_id in enumerate(res.get("lists")):
            list_res = list_col.find_one(filter={"_id": ObjectId(list_id)})
            list_res["_id"] = str(list_res.get("_id"))
            res["lists"][idx] = list_res
    return res


@list_router.get("/{list_id}")
async def get_list(list_id: str, include_items: Optional[int] = None):
    res = list_col.find_one(
        {"_id": ObjectId(list_id)},
    )
    res["_id"] = str(res.get("_id"))
    if not include_items:
        del res["items"]
    return res


class WriteListBody(BaseModel):
    title: str
    description: Optional[str]


@list_router.post("/")
async def create_list(body: WriteListBody):
    insert_list_res = list_col.insert_one(
        document={"title": body.title, "description": body.description, "items": []}
    )
    insert_id_user_lists_res = user_col.update_one(
        filter={"_id": ObjectId(ar.get_current_user_id())},
        update={"$push": {"lists": str(insert_list_res.inserted_id)}},
    )
    return {
        "_id": str(insert_list_res.inserted_id),
        "ack": insert_list_res.acknowledged,
        "user_col_ops": {
            "ack": insert_id_user_lists_res.acknowledged,
            "raw": insert_id_user_lists_res.raw_result,
            "matched": insert_id_user_lists_res.matched_count,
            "modified": insert_id_user_lists_res.modified_count,
        },
    }


@list_router.put("/{list_id}")
async def edit_list_attrs(body: WriteListBody, list_id: str):
    update_res = list_col.update_one(
        {"_id": ObjectId(list_id)},
        {"$set": {"title": body.title, "description": body.description}},
    )
    return {
        "raw": update_res.raw_result,
        "meta": {
            "matched": update_res.matched_count,
            "modified": update_res.modified_count,
        },
    }


@list_router.delete("/{list_id}")
async def delete_list(list_id: str):
    delete_res = list_col.delete_one({"_id": ObjectId(list_id)})
    delete_list_id_from_user_res = user_col.update_one(
        filter={"_id": ObjectId(ar.get_current_user_id())},
        update={"$pull": {"lists": list_id}},
    )
    return {
        "raw": delete_res.raw_result,
        "ack": delete_res.acknowledged,
        "count": delete_res.deleted_count,
        "user_col_op": {
            "raw": delete_list_id_from_user_res.raw_result,
            "matched": delete_list_id_from_user_res.matched_count,
            "modified": delete_list_id_from_user_res.modified_count,
        },
    }


class WriteItemBody(BaseModel):
    title: str
    description: Optional[str]


@list_router.post("/{list_id}/item")
async def create_item(list_id: str, body: WriteItemBody):
    new_todo_id = str(ObjectId())
    new_todo_item = {
        "id": new_todo_id,
        "title": body.title,
        "description": body.description,
    }
    insert_res = list_col.update_one(
        filter={"_id": ObjectId(list_id)},
        update={"$push": {"items": new_todo_item}},
    )
    response = {
        "id": new_todo_id,
        "ack": insert_res.acknowledged,
        "raw": insert_res.raw_result,
        "item": body,
    }
    return response


@list_router.put("/{list_id}/item/{item_id}")
async def edit_item(list_id: str, item_id: str, body: WriteItemBody):
    if len(body.title) == 0:
        raise HTTPException(status_code=400, detail="Todo must have a non-empty title")
    update_todo_res = list_col.update_one(
        {"_id": ObjectId(list_id), "items.id": item_id},
        update={
            "$set": {
                "items.$.title": body.title,
                "items.$.description": body.description,
            }
        },
    )
    response = {
        "ack": update_todo_res.acknowledged,
        "id": update_todo_res.upserted_id,
        "raw": update_todo_res.raw_result,
        "meta": {
            "matched": update_todo_res.matched_count,
            "modified": update_todo_res.modified_count,
        },
        "item": body,
    }
    return response


@list_router.delete("/{list_id}/item/{item_id}")
async def delete_todo_item(list_id: str, item_id: str):
    delete_item_from_list_res = list_col.update_one(
        {"_id": ObjectId(list_id)},
        update={"$pull": {"items": {"id": item_id}}},
    )
    response = {
        "ack": delete_item_from_list_res.acknowledged,
        "id": delete_item_from_list_res.upserted_id,
        "raw": delete_item_from_list_res.raw_result,
        "matched": delete_item_from_list_res.matched_count,
        "modified": delete_item_from_list_res.modified_count,
    }
    return response


class ChangeOrderItemBody(BaseModel):
    new_order: int


@list_router.put("/{list_id}/item/{item_id}/change-order")
async def change_order_todo(list_id: str, item_id: str, body: ChangeOrderItemBody):
    items = list_col.find_one({"_id": ObjectId(list_id)}).get("items")
    if len(items) == 0:
        raise HTTPException(status_code=400, detail="Todo item does not exist")
    [item] = [t for t in items if t.get("id") == item_id]
    pull_res = list_col.update_one(
        {"_id": ObjectId(list_id)},
        update={
            "$pull": {"items": {"id": item.get("id")}},
        },
    )
    change_order_res = list_col.update_one(
        {"_id": ObjectId(list_id)},
        update={
            "$push": {"items": {"$each": [item], "$position": body.new_order}},
        },
    )
    return {
        "ack": change_order_res.acknowledged,
        "raw": {"co": change_order_res.raw_result, "p": pull_res.raw_result},
        "edit": item,
    }
