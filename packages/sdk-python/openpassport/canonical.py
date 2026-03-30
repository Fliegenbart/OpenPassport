"""
Deterministic JSON serialization for signing.
Must produce byte-identical output to the JavaScript implementation.

Rules:
1. Remove excluded keys (default: "signature")
2. Sort remaining keys alphabetically by Unicode code point
3. Serialize with no whitespace, using separators=(",", ":")
4. Nested objects are also sorted recursively
"""

from __future__ import annotations

import json
from typing import Any, Optional, List


def canonicalize(obj: dict[str, Any], exclude_keys: Optional[List[str]] = None) -> str:
    if exclude_keys is None:
        exclude_keys = ["signature"]
    cleaned = _sort_keys(obj, exclude_keys)
    return json.dumps(cleaned, separators=(",", ":"), ensure_ascii=False)


def _sort_keys(value: Any, exclude_keys: list[str]) -> Any:
    if value is None or isinstance(value, (bool, int, float, str)):
        return value
    if isinstance(value, list):
        return [_sort_keys(item, []) for item in value]
    if isinstance(value, dict):
        return {
            k: _sort_keys(v, [])
            for k, v in sorted(value.items())
            if k not in exclude_keys
        }
    return value
