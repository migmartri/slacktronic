package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
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
	httpsOnly         = flag.Bool("httpsOnly", false, "Enforce redirection to https://")
	oauthClientID     = flag.String("oauth-client-id", "", "OAuth Client ID")
	oauthClientSecret = flag.String("oauth-client-secret", "", "OAuth Client Secret")
)

type oauthHandler struct {
	config *oauth2.Config
	H      func(*oauth2.Config, http.ResponseWriter, *http.Request) (int, error)
}

// Redirects all requests to https://*
// Useful when the app runs behind a load balancer in charge of the SSL termination
func forceSSL(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if *httpsOnly {
			if r.Header.Get("x-forwarded-proto") != "https" {
				sslURL := "https://" + r.Host + r.RequestURI
				http.Redirect(w, r, sslURL, http.StatusTemporaryRedirect)
				return
			}
		}

		next.ServeHTTP(w, r)
	})

}

const cookieOauthStateName string = "oauthState"

func (oh oauthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	status, err := oh.H(oh.config, w, r)
	if err != nil {
		http.Error(w, http.StatusText(status), status)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "ok")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://github.com/migmartri/slacktronic", http.StatusFound)
}

func authHandler(oauthConfig *oauth2.Config, w http.ResponseWriter, r *http.Request) (int, error) {
	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	http.SetCookie(w, &http.Cookie{Name: cookieOauthStateName, Value: state})

	url := oauthConfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusFound)
	return http.StatusTemporaryRedirect, nil
}

func authCallbackHandler(oauthConfig *oauth2.Config, w http.ResponseWriter, r *http.Request) (int, error) {
	ctx := context.Background()

	cookieState, err := r.Cookie(cookieOauthStateName)
	if err != nil {
		glog.Error(err)
		return http.StatusUnauthorized, err
	}

	if r.URL.Query().Get("state") != cookieState.Value {
		glog.Error("The oauth state retrieved does not match, possible XSS")
		return http.StatusUnauthorized, errors.New("Oauth state does not match")
	}

	code := r.URL.Query().Get("code")
	// Use the custom HTTP client when requesting a token.
	httpClient := &http.Client{Timeout: 2 * time.Second}
	ctx = context.WithValue(ctx, oauth2.HTTPClient, httpClient)

	tok, err := oauthConfig.Exchange(ctx, code)
	if err != nil {
		glog.Error(err)
		return http.StatusUnauthorized, err
	}
	if !tok.Valid() {
		return http.StatusUnauthorized, errors.New("retrieved invalid Token")
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

	r := http.NewServeMux()

	r.Handle("/oauth/auth", oauthHandler{oauthConfig, authHandler})
	r.Handle("/oauth/callback", oauthHandler{oauthConfig, authCallbackHandler})
	r.HandleFunc("/healthz", healthHandler)
	r.HandleFunc("/", indexHandler)
	glog.Infof(fmt.Sprintf("serving http endpoint on %s", *listen))
	log.Fatal(http.ListenAndServe(*listen, forceSSL(r)))
}
