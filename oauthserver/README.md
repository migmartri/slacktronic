Slacktronics Slack Oauth server

```bash
# Run the container image providing the Slack application oauth credentials
docker run -p 8080:8080 -it -e OAUTH_CLIENT_SECRET=secret -e OAUTH_CLIENT_ID=myID migmartri/slacktronic-auth

# Build the docker image yourself
make docker-build

# Run the development build locally
OAUTH_CLIENT_ID=myID OAUTH_CLIENT_SECRET=secret make run
```