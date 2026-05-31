#!/bin/bash
# Minimal node_modules setup for pi-happy to avoid full `pnpm install` which
# consumes too much disk space due to the lockfile being incompatible with
# current pnpm and the monorepo containing heavy deps (React Native, Electron, Prisma).
set -e

cd "$(dirname "$0")/.."

# Create temp dir with external deps if needed
DEP_DIR="/tmp/pi-happy-deps"
if [ ! -d "$DEP_DIR/node_modules" ]; then
  mkdir -p "$DEP_DIR"
  cat > "$DEP_DIR/package.json" << 'EOF'
{
  "name": "pi-happy-deps",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "commander": "^13.1.0",
    "axios": "^1.13.2",
    "tweetnacl": "^1.0.3",
    "qrcode-terminal": "^0.12.0",
    "socket.io-client": "^4.8.3",
    "zod": "^3.25.76",
    "@paralleldrive/cuid2": "^2.2.2"
  }
}
EOF
  (cd "$DEP_DIR" && npm install --no-audit --no-fund)
fi

# Symlink workspace packages
mkdir -p node_modules/@slopus
ln -sf ../packages/happy-agent node_modules/happy-agent
ln -sf ../../packages/happy-wire node_modules/@slopus/happy-wire

# Symlink external deps
ln -sf "$DEP_DIR/node_modules/commander" node_modules/commander
ln -sf "$DEP_DIR/node_modules/axios" node_modules/axios
ln -sf "$DEP_DIR/node_modules/tweetnacl" node_modules/tweetnacl
ln -sf "$DEP_DIR/node_modules/qrcode-terminal" node_modules/qrcode-terminal
ln -sf "$DEP_DIR/node_modules/socket.io-client" node_modules/socket.io-client
ln -sf "$DEP_DIR/node_modules/zod" node_modules/zod
ln -sf "$DEP_DIR/node_modules/@paralleldrive" node_modules/@paralleldrive

echo "pi-happy minimal deps linked."
