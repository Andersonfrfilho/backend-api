#!/bin/sh
set -e

# Configuration via environment variables
SONAR_HOST=${SONAR_HOST:-http://sonarqube:9000}
ADMIN_PASSWORD=${SONAR_ADMIN_PASSWORD:-admin}
NEW_ADMIN_PASSWORD=${SONAR_ADMIN_NEW_PASSWORD:-admin}
TOKEN_NAME=${SONAR_TOKEN_NAME:-ci-token}

echo "Waiting for SonarQube to be ready at ${SONAR_HOST}..."
until curl -s "${SONAR_HOST}/api/system/status" | grep -q '"UP"'; do
  sleep 3
done
echo "SonarQube is up"

if [ "${NEW_ADMIN_PASSWORD}" != "${ADMIN_PASSWORD}" ]; then
  echo "Changing admin password..."
  curl -s -u "admin:${ADMIN_PASSWORD}" -X POST "${SONAR_HOST}/api/users/change_password" -d "login=admin&previousPassword=${ADMIN_PASSWORD}&password=${NEW_ADMIN_PASSWORD}"
  ADMIN_PASSWORD=${NEW_ADMIN_PASSWORD}
fi


echo "Generating user token ('${TOKEN_NAME}') for admin..."
RESPONSE=$(curl -s -u "admin:${ADMIN_PASSWORD}" -X POST "${SONAR_HOST}/api/user_tokens/generate" -d "name=${TOKEN_NAME}")
TOKEN=$(echo "$RESPONSE" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
  # If token already exists, revoke it and try again
  if echo "$RESPONSE" | grep -qi "already exists"; then
    echo "A token named '${TOKEN_NAME}' already exists — revoking and recreating..."
    REVOKE_RESP=$(curl -s -u "admin:${ADMIN_PASSWORD}" -X POST "${SONAR_HOST}/api/user_tokens/revoke" -d "name=${TOKEN_NAME}")
    # Try to generate again
    RESPONSE=$(curl -s -u "admin:${ADMIN_PASSWORD}" -X POST "${SONAR_HOST}/api/user_tokens/generate" -d "name=${TOKEN_NAME}")
    TOKEN=$(echo "$RESPONSE" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
  fi
fi

if [ -z "$TOKEN" ]; then
  echo "Failed to generate token. Response: $RESPONSE" >&2
  exit 1
fi

mkdir -p /output
echo "SONAR_TOKEN=${TOKEN}" > /output/sonar_token.env
echo "Token saved to /output/sonar_token.env"
echo "Done."
