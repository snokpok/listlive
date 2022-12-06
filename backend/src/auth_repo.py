from fastapi import HTTPException, Header
import time
import jwt
import configs


class AuthRepository:
    jwt_claims: dict
    token: str

    def __init__(self):
        self.jwt_claims = None
        self.token = None

    def create_access_token(self, id: str):
        access_token = jwt.encode(
            {
                "id": id,
                "iat": str(int(time.time()))
            },
            key=configs.jwt_secret_key,
            algorithm="HS256",
        )
        return access_token

    def decode_access_token(self, token: str):
        try:
            res = jwt.decode(token,
                             key=configs.jwt_secret_key,
                             algorithms=["HS256"])
        except jwt.exceptions.DecodeError:
            raise HTTPException(status_code=401, detail="Token not valid")
        return res

    def verify_decode_auth_header(self, headers: Header):
        bearer_token = headers.get("Authorization")
        if not bearer_token:
            raise HTTPException(status_code=401,
                                detail="Token not found; unauthorized")
        bearer_token_split = bearer_token.split(" ")
        if len(bearer_token_split) != 2:
            raise HTTPException(status_code=401,
                                detail="Token empty; unauthorized")
        token = bearer_token_split[1]
        if not self.token or self.token != token:
            self.token = token
        try:
            claims = jwt.decode(jwt=token,
                                key=configs.jwt_secret_key,
                                algorithms=["HS256"])
            self.jwt_claims = claims
            return claims
        except jwt.exceptions.InvalidSignatureError as e:
            raise HTTPException(status_code=401, detail=str(e))
        except jwt.exceptions.DecodeError:
            raise HTTPException(
                status_code=401,
                detail="Token failed validation; unauthorized",
            )

    def get_current_user_id(self) -> str:
        return self.jwt_claims.get("id")


ar = AuthRepository()
