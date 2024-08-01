import os
import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
jwt_key = os.environ.get("JWT_KEY")
jwt_algorithm = os.environ.get("JWT_ALGORITHM")

def decode_jwt(token:str=Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, jwt_key, algorithms=[jwt_algorithm])
        user_id: str = payload.get("userid")
        return user_id
    
    except jwt.PyJWTError as e:
        print(e)
        raise HTTPException(status_code=401, detail="Could not validate credential")
