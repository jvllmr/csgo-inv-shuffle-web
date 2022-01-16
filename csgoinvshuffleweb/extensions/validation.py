from __future__ import annotations

from flask import Flask
from spectree import SpecTree

api_validator = SpecTree("flask", annotations=True)


def create_validator(app: Flask) -> SpecTree:
    api_validator.register(app)
    return api_validator
