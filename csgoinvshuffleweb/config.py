import os

REDIS_URL = os.environ.get("REDIS_TLS_URL", None)


class BaseConfig:
    CACHE_TYPE = "FileSystemCache"
    CACHE_DIR = ".cache"
    SECRET_KEY = os.getenv("SECRET_KEY", None) or "9465988C5E63ED1444BA12EE1B591"
    JWT_ACCESS_LIFESPAN = {"minutes": 15}
    JWT_REFRESH_LIFESPAN = {"days": 3}
    CORS_SUPPORTS_CREDENTIALS = True


class DevConfig(BaseConfig):
    CORS_ORIGINS = "http://localhost:3000"


class ProdConfig(BaseConfig):
    @property
    def SECRET_KEY(self):
        return os.environ.get("SECRET_KEY")

    CORS_ORIGINS = "https://csgoinvshuffle.kreyoo.dev"
