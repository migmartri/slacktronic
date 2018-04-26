Slacktronics Slack Oauth server

#### TLDR;

```bash
# Run the container providing the Slack application oauth credentials
docker run -p 8080:8080 -it -e OAUTH_CLIENT_SECRET=secret -e OAUTH_CLIENT_ID=myid migmartri/slacktronic-auth
```

#### Build container image

```bash
# From the root of the project
docker build -t oauthserver -f oauthserver/Dockerfile .
```
