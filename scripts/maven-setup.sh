#!/bin/bash
# One-time Maven Central setup for arj-89/worldref (run again to rotate the signing key). The owner runs it:
#   bash scripts/maven-setup.sh
# It stores the Central portal token as GitHub secrets, creates a release-signing key, stores it as a GitHub
# secret, publishes the public half to key servers, deletes the local copy, and turns publishing on.
# Secrets go from this Terminal straight to GitHub; the key lives only in a temporary folder deleted at the end.
set -euo pipefail
REPO=arj-89/worldref

echo
echo "Step 1 of 4: Maven Central token"
echo "  1. https://central.sonatype.com/publishing/namespaces : io.github.arj-89 must show Verified."
echo "  2. https://central.sonatype.com/account : Generate User Token."
read -r -p "  Paste the token USERNAME: " CENTRAL_USER
read -r -s -p "  Paste the token PASSWORD (hidden): " CENTRAL_PASS; echo
printf %s "$CENTRAL_USER" | gh secret set MAVEN_CENTRAL_USERNAME -R "$REPO"
printf %s "$CENTRAL_PASS" | gh secret set MAVEN_CENTRAL_PASSWORD -R "$REPO"
unset CENTRAL_USER CENTRAL_PASS

echo
echo "Step 2 of 4: release-signing key (made here, stored in GitHub, then deleted from this Mac)"
GNUPGHOME=$(mktemp -d); export GNUPGHOME; chmod 700 "$GNUPGHOME"
trap 'rm -rf "$GNUPGHOME"' EXIT
KEY_PASS=$(openssl rand -base64 32)
gpg --batch --quiet --pinentry-mode loopback --passphrase "$KEY_PASS" \
    --quick-gen-key "worldref release signing <2502552+arj-89@users.noreply.github.com>" rsa4096 sign 5y
FPR=$(gpg --list-keys --with-colons | awk -F: '/^fpr/ { print $10; exit }')
gpg --batch --pinentry-mode loopback --passphrase "$KEY_PASS" --armor --export-secret-keys "$FPR" \
    | gh secret set MAVEN_SIGNING_KEY -R "$REPO"
printf %s "$KEY_PASS" | gh secret set MAVEN_SIGNING_KEY_PASSWORD -R "$REPO"
unset KEY_PASS

echo
echo "Step 3 of 4: publishing the public key so Maven Central can check signatures"
gpg --keyserver hkps://keyserver.ubuntu.com --send-keys "$FPR"
gpg --keyserver hkps://keys.openpgp.org --send-keys "$FPR" || echo "  (keys.openpgp.org skipped; keyserver.ubuntu.com is enough)"

echo
echo "Step 4 of 4: turning on Maven Central publishing"
gh variable set PUBLISH_MAVEN -R "$REPO" --body true

echo
echo "Done. Signing key fingerprint: $FPR"
echo "Secrets set: MAVEN_CENTRAL_USERNAME, MAVEN_CENTRAL_PASSWORD, MAVEN_SIGNING_KEY, MAVEN_SIGNING_KEY_PASSWORD"
echo "Variable set: PUBLISH_MAVEN=true. The next release publishes to Maven Central."
