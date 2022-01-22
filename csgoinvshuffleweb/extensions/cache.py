from flask import Flask
from flask_caching import Cache

cache = Cache()


def create_cache(app: Flask) -> Cache:
    cache.init_app(app)
    cache.clear()
    return cache
