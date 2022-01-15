import os


class BaseConfig:
    CACHE_TYPE = "RedisCache"
    SECRET_KEY = "9465988C5E63ED1444BA12EE1B591"
    JWT_ACCESS_LIFESPAN = {"minutes": 15}
    JWT_REFRESH_LIFESPAN = {"hours": 18}
    CORS_SUPPORTS_CREDENTIALS = True


class DevConfig(BaseConfig):
    CORS_ORIGINS = "http://localhost:3000"


class ProdConfig(BaseConfig):
    @property
    def SECRET_KEY(self):
        return os.environ.get("SECRET_KEY")

    @property
    def CACHE_REDIS_URL(self):
        return os.environ.get("REDIS_TLS_URL", None)

    CORS_ORIGINS = "https://csgoinvshuffle.kreyoo.dev"
