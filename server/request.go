package main

import (
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/context"
	"google.golang.org/appengine/urlfetch"
)

const (
	timeout = time.Second * 2
)

func form(m map[string]string) io.Reader {
	data := url.Values{}
	for k, v := range m {
		data.Set(k, v)
	}
	return strings.NewReader(data.Encode())
}

func post(ctx context.Context, url string, form io.Reader) (*goquery.Document, error) {
	return do(ctx, url, "POST", form)
}

func get(ctx context.Context, url string) (*goquery.Document, error) {
	return do(ctx, url, "GET", nil)
}

func do(ctx context.Context, url, method string, form io.Reader) (*goquery.Document, error) {
	client := urlfetch.Client(ctx)
	req, err := http.NewRequest(method, url, form)
	if err != nil {
		return nil, err
	}
	client.Timeout = timeout
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	doc, err := goquery.NewDocumentFromResponse(resp)
	if err != nil {
		log.Fatal(err)
	}
	return doc, nil
}
