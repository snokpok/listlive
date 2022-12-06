from fastapi import Header
from auth_repo import ar


async def verify_token_dependency(authorization: str = Header(...)):
    ar.verify_decode_auth_header({"Authorization": authorization})
    return
