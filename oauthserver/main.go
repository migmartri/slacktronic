package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang/glog"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/slack"
)

var (
	listen            = flag.String("listen", ":8080", "HTTP server listen address")
	oauthClientID     = flag.String("oauth-client-id", "", "OAuth Client ID")
	oauthClientSecret = flag.String("oauth-client-secret", "", "OAuth Client Secret")
)

type oauthHandler struct {
	config *oauth2.Config
	H      func(*oauth2.Config, http.ResponseWriter, *http.Request) (int, error)
}

func (oh oauthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	status, err := oh.H(oh.config, w, r)
	if err != nil {
		switch status {
		case http.StatusInternalServerError:
			http.Error(w, http.StatusText(status), status)
		default:
			http.Error(w, http.StatusText(status), status)
		}
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "ok")
}

func authHandler(oauthConfig *oauth2.Config, w http.ResponseWriter, r *http.Request) (int, error) {
	url := oauthConfig.AuthCodeURL("TODO")
	http.Redirect(w, r, url, http.StatusFound)
	return http.StatusTemporaryRedirect, nil
}

func redirectHandler(oauthConfig *oauth2.Config, w http.ResponseWriter, r *http.Request) (int, error) {
	ctx := context.Background()

	code := r.URL.Query().Get("code")
	// Use the custom HTTP client when requesting a token.
	httpClient := &http.Client{Timeout: 2 * time.Second}
	ctx = context.WithValue(ctx, oauth2.HTTPClient, httpClient)

	tok, err := oauthConfig.Exchange(ctx, code)
	if err != nil {
		glog.Error(err)
		return http.StatusUnauthorized, err
	}

	fmt.Fprintf(w, "Hooray! here is your token. Now paste it back in Slacktronic\n\n%s", tok.AccessToken)
	return http.StatusOK, nil
}

func main() {
	flag.Parse()

	// We read the values either from flags or env variables
	if *oauthClientID == "" {
		*oauthClientID = os.Getenv("OAUTH_CLIENT_ID")
	}

	if *oauthClientSecret == "" {
		*oauthClientSecret = os.Getenv("OAUTH_CLIENT_SECRET")
	}

	if *oauthClientID == "" || *oauthClientSecret == "" {
		glog.Exit("oauth-client-id (OAUTH_CLIENT_ID) and oauth-client-secret (OAUTH_CLIENT_SECRET) options are required")
	}

	oauthConfig := &oauth2.Config{
		ClientID:     *oauthClientID,
		ClientSecret: *oauthClientSecret,
		Scopes:       []string{"client"},
		Endpoint:     slack.Endpoint,
	}

	http.Handle("/oauth/auth", oauthHandler{oauthConfig, authHandler})
	http.Handle("/oauth/redirect", oauthHandler{oauthConfig, redirectHandler})
	http.HandleFunc("/healthz", healthHandler)
	glog.Infof(fmt.Sprintf("serving http endpoint on %s", *listen))
	log.Fatal(http.ListenAndServe(*listen, nil))
}
