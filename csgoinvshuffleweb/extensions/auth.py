from typing import NamedTuple

import flask_praetorian
from flask import Flask


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
    guard.init_app(app, user_class=DummyUserClass)
    return guard
