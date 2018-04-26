# Stage 1: Compile oauth server
FROM golang:1.10 as build

COPY oauthserver/ /go/src/github.com/migmartri/slacktronic/oauthserver

RUN cd /go/src/github.com/migmartri/slacktronic/oauthserver && go build

# Stage 2: Create minideb containing binary
FROM bitnami/minideb
RUN install_packages ca-certificates
COPY --from=build /go/src/github.com/migmartri/slacktronic/oauthserver/oauthserver /slacktronic/oauthserver

WORKDIR /slacktronic
USER 1001
CMD ./oauthserver
