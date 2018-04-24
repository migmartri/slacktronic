package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/golang/glog"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/slack"
)

var (
	oauthClientID     = flag.String("oauth-client-id", "", "OAuth Client ID")
	oauthClientSecret = flag.String("oauth-client-secret", "", "OAuth Client Secret")
)

func makeOauthHandler(config *oauth2.Config, fn func(*oauth2.Config, http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fn(config, w, r)
	}
}

func authHandler(oauthConfig *oauth2.Config, w http.ResponseWriter, r *http.Request) {
	url := oauthConfig.AuthCodeURL("TODO")
	http.Redirect(w, r, url, http.StatusFound)
	return
}

func redirectHandler(oauthConfig *oauth2.Config, w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	code := r.URL.Query().Get("code")
	// Use the custom HTTP client when requesting a token.
	httpClient := &http.Client{Timeout: 2 * time.Second}
	ctx = context.WithValue(ctx, oauth2.HTTPClient, httpClient)

	tok, err := oauthConfig.Exchange(ctx, code)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Fprintf(w, "Here is your token %s", tok.AccessToken)
}

func main() {
	flag.Parse()

	if *oauthClientID == "" || *oauthClientSecret == "" {
		glog.Exit("oauth-client-id and oauth-client-secret options are required")
	}

	oauthConfig := &oauth2.Config{
		ClientID:     *oauthClientID,
		ClientSecret: *oauthClientSecret,
		Scopes:       []string{"client"},
		Endpoint:     slack.Endpoint,
	}

	http.HandleFunc("/oauth/auth", makeOauthHandler(oauthConfig, authHandler))
	http.HandleFunc("/oauth/redirect", makeOauthHandler(oauthConfig, redirectHandler))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
