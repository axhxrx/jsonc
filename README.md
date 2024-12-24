# @axhxrx/jsonc

Utility library for working with JSONC files. This is a wrapper around the Microsoft JSONC parser (https://github.com/microsoft/node-jsonc-parser) to make certain specific tasks more convenient, but the main difference is that this library exposes a simple CLI to check/format JSONC files on disk.

E.g.:

```sh
# check:
deno run -R mod.ts **/*.jsonc

# format:
deno run -RW https://jsr.io/@axhxrx/jsonc/0.0.2/mod.ts --write **/*.jsonc
```

## Happenings

👹 v0.0.2 — add CLI to check/format JSON[C] files on disk

🤖 2024-12-16: repo initialized by Bottie McBotface bot@axhxrx.com
