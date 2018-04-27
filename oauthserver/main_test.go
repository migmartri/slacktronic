package main

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/slack"
)

var (
	port = "8080"

	oauthConfig = &oauth2.Config{
		ClientID:     "myClient",
		ClientSecret: "mySecret",
		Scopes:       []string{"client"},
		Endpoint:     slack.Endpoint,
	}
)

func TestHealthHandler(t *testing.T) {
	expected := []byte("ok")

	req := httptest.NewRequest("GET", buildURL("/healthz"), nil)
	res := httptest.NewRecorder()

	healthHandler(res, req)

	if res.Code != http.StatusOK {
		t.Errorf("Response code was %v; want %v", res.Code, http.StatusOK)
	}

	if bytes.Compare(expected, res.Body.Bytes()) != 0 {
		t.Errorf("Response body was '%s'; want '%s'", res.Body, expected)
	}
}

func TestIndexHandler(t *testing.T) {
	expectedLocation := "https://github.com/migmartri/slacktronic"

	req := httptest.NewRequest("GET", buildURL("/"), nil)
	res := httptest.NewRecorder()

	indexHandler(res, req)

	if res.Code != http.StatusFound {
		t.Errorf("Response code was %v; want %v", res.Code, http.StatusFound)
	}

	location := res.HeaderMap.Get("location")
	if expectedLocation != location {
		t.Errorf("Location was '%s'; want '%s'", location, expectedLocation)
	}
}

func TestAuthHandler(t *testing.T) {
	expectedLocation := "https://slack.com/oauth/authorize?client_id=myClient&response_type=code&scope=client&state=TODO"

	req := httptest.NewRequest("GET", buildURL("/"), nil)
	res := httptest.NewRecorder()

	oHandler := oauthHandler{oauthConfig, authHandler}
	oHandler.ServeHTTP(res, req)

	if res.Code != http.StatusFound {
		t.Errorf("Response code was %v; want %v", res.Code, http.StatusFound)
	}

	location := res.HeaderMap.Get("location")
	if expectedLocation != location {
		t.Errorf("Location was '%s'; want '%s'", location, expectedLocation)
	}
}
func TestAuthCallback(t *testing.T) {
	t.Run("it return StatusUnauthorized if code is not returned", func(t *testing.T) {
		req := httptest.NewRequest("GET", buildURL("/oauth/callback"), nil)
		res := httptest.NewRecorder()

		oHandler := oauthHandler{oauthConfig, authCallbackHandler}
		oHandler.ServeHTTP(res, req)

		if res.Code != http.StatusUnauthorized {
			t.Errorf("Response code was %v; want %v", res.Code, http.StatusUnauthorized)
		}
	})

	t.Run("it return the access token if exchange successful", func(t *testing.T) {
		ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.String() != "/token" {
				t.Errorf("Unexpected exchange request URL, %v is found.", r.URL)
			}
			headerContentType := r.Header.Get("Content-Type")
			if headerContentType != "application/x-www-form-urlencoded" {
				t.Errorf("Unexpected Content-Type header, %v is found.", headerContentType)
			}
			body, err := ioutil.ReadAll(r.Body)
			if err != nil {
				t.Errorf("Failed reading request body: %s.", err)
			}
			if string(body) != "code=myCode&grant_type=authorization_code" {
				t.Errorf("Unexpected exchange payload, %v is found.", string(body))
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"access_token": "THEAccessToken", "scope": "user", "token_type": "bearer", "expires_in": 86400}`))
		}))

		defer ts.Close()

		req, err := http.NewRequest("GET", buildURL("/oauth/callback?code=myCode"), nil)
		if err != nil {
			t.Fatal(err)
		}

		res := httptest.NewRecorder()
		oauthConfig.Endpoint = oauth2.Endpoint{
			AuthURL:  ts.URL + "/auth",
			TokenURL: ts.URL + "/token",
		}

		oHandler := oauthHandler{oauthConfig, authCallbackHandler}
		oHandler.ServeHTTP(res, req)

		if res.Code != http.StatusOK {
			t.Errorf("Response code was %v; want %v", res.Code, http.StatusOK)
		}

		expected := "THEAccessToken"

		if !strings.Contains(res.Body.String(), expected) {
			t.Errorf("Response body was '%s'; wanted to include '%s'", res.Body, expected)
		}
	})

}

func buildURL(path string) string {
	return urlFor("http", port, path)
}

func urlFor(scheme string, serverPort string, path string) string {
	return scheme + "://localhost:" + serverPort + path
}
