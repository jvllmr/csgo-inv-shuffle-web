from flask import Flask
from flask_caching import Cache
from flask_caching.backends import RedisCache


class CustomRedisCache(RedisCache):
    def __init__(
        self,
        host="localhost",
        port=6379,
        password=None,
        db=0,
        default_timeout=300,
        key_prefix=None,
        **kwargs
    ):
        kwargs = kwargs | {"ssl_cert_reqs": None}
        super().__init__(
            host, port, password, db, default_timeout, key_prefix, **kwargs
        )


cache = Cache()


def create_cache(app: Flask) -> Cache:
    cache.init_app(app)
    cache.clear()
    return cache
