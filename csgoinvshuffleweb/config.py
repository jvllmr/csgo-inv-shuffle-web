import os

REDIS_URL = os.environ.get("REDIS_TLS_URL", None)


class BaseConfig:
    CACHE_TYPE = "RedisCache"
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

    CACHE_OPTIONS = {"ssl": True, "ssl_cert_reqs": None}

    @property
    def CACHE_REDIS_HOST(self):
        if REDIS_URL:
            return REDIS_URL.split(":")[-2].split("@")[1]

    @property
    def CACHE_REDIS_PORT(self):
        if REDIS_URL:
            return int(REDIS_URL.split(":")[-1])

    @property
    def CACHE_REDIS_PASSWORD(self):
        if REDIS_URL:
            return REDIS_URL.split(":")[-2].split("@")[0]

    CORS_ORIGINS = "https://csgoinvshuffle.kreyoo.dev"
