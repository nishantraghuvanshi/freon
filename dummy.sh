#!/bin/bash

# List of dummy identity names
DUMMIES=("dummy1" "dummy2" "dummy3")

echo "Generating valid dummy principals using DFX..."

for NAME in "${DUMMIES[@]}"; do
  echo "Creating identity: $NAME"
  dfx identity new $NAME --force >/dev/null 2>&1
  dfx identity use $NAME
  PRINCIPAL=$(dfx identity get-principal)
  echo "$NAME principal: $PRINCIPAL"
done

# Switch back to default identity
dfx identity use default