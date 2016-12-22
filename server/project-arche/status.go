package main

import (
	"encoding/json"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/context"
)

const serverStatusURL = "https://archeage.xlgames.com/serverstatus"

const (
	serverStatusRowQuery = `table tr`
)

type ServerStatus map[string]bool

func fetchServerStatus(ctx context.Context) (string, error) {
	doc, err := get(ctx, serverStatusURL)
	if err != nil {
		return "", err
	}
	serverStatus, err := serverStatusParser(doc)
	if err != nil {
		return "", err
	}
	marshaled, err := json.MarshalIndent(serverStatus, "", "\t")
	if err != nil {
		return "", err
	}
	return string(marshaled), nil
}

func serverStatusParser(doc *goquery.Document) (serverStatus ServerStatus, err error) {
	doc.Find(serverStatusRowQuery).Each(func(i int, s *goquery.Selection) {
		name := s.Find(".server").Text()
		status := s.Find(".stats span").HasClass(".on")
		serverStatus[name] = status
	})
	return
}
