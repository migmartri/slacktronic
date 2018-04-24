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

func authHandler(oauthConfig *oauth2.Config, w http.ResponseWriter, r *http.Request) (int, error) {
	url := oauthConfig.AuthCodeURL("TODO")
	http.Redirect(w, r, url, http.StatusFound)
	return http.StatusOK, nil
}

func redirectHandler(oauthConfig *oauth2.Config, w http.ResponseWriter, r *http.Request) (int, error) {
	ctx := context.Background()

	code := r.URL.Query().Get("code")
	// Use the custom HTTP client when requesting a token.
	httpClient := &http.Client{Timeout: 2 * time.Second}
	ctx = context.WithValue(ctx, oauth2.HTTPClient, httpClient)

	tok, err := oauthConfig.Exchange(ctx, code)
	if err != nil {
		log.Fatal(err)
		return http.StatusUnauthorized, err
	}
	fmt.Fprintf(w, "Here is your token %s", tok.AccessToken)
	return http.StatusOK, nil
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

	http.Handle("/oauth/auth", oauthHandler{oauthConfig, authHandler})
	http.Handle("/oauth/redirect", oauthHandler{oauthConfig, redirectHandler})
	glog.Infof("serving http endpoint on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
