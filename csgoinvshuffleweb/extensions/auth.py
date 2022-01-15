from flask import Flask
import flask_praetorian
from typing import NamedTuple


class DummyUserClass(NamedTuple):
    identity: int
    rolenames: list = []

    @classmethod
    def identify(cls, id):
        return cls(id, [])


class CustomGuard(flask_praetorian.Praetorian):
    def _validate_user_class(self, user_class):
        return user_class


guard = CustomGuard(user_class=DummyUserClass)


def create_guard(app: Flask) -> CustomGuard:
    guard.init_app(app)
    return guard
