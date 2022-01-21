from flask_caching import Cache
from flask import Flask

cache = Cache()


def create_cache(app: Flask) -> Cache:
    cache.init_app(app)
    cache.clear()
    return cache
