package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"google.golang.org/appengine"
)

const (
	firebasedatabaseURL = "https://project-arche.firebaseio.com/"
	noticeSubscriberKey = "NoticeSubscriber"
)

func init() {
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/", index)

	// Auction REST API
	r.HandleFunc("/api/auctions/{server_group}/{item_name}", apiHandler(auctionsHandler)).Methods("GET")
	r.HandleFunc("/api/auctions/{server_group}/{item_name}/{item_grade}", apiHandler(auctionsHandler)).Methods("GET")

	// Expedition REST API
	r.HandleFunc("/api/expeditions/{server_name}/{expedition_number}", apiHandler(expeditionsHandler)).Methods("GET")

	// Charactor REST API
	r.HandleFunc("/api/charactors/{charactor_uuid}", apiHandler(charactorsHandler)).Methods("GET")
	r.HandleFunc("/api/charactors/{charactor_uuid}/history", apiHandler(charactorsHistoryHandler)).Methods("GET")

	// notice REST API
	r.HandleFunc("/api/notices", apiHandler(noticesHandler)).Methods("GET")

	// cron job
	r.HandleFunc("/tasks/fetch/notices", fetchNoticesHandler)
	r.HandleFunc("/tasks/fetch/serverStatus", fetchServerStatusHandler)
	r.HandleFunc("/tasks/notify/{topic}", notifyTopicHandler)

	http.Handle("/", r)
}

func apiHandler(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		fn(w, r)
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "It's Project-Arche REST Service")
}

func auctionsHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	auctionSearchParam := func(vars map[string]string) (ap AuctionSearchParam) {
		ap.ItemName = vars["item_name"]
		ap.ServerGroup = vars["server_group"]
		ap.ItemGrade = vars["item_grade"]
		return
	}(mux.Vars(r))
	fmt.Fprintln(w, auctionSearch(ctx, auctionSearchParam))
}

func expeditionsHandler(w http.ResponseWriter, r *http.Request) {
	// ctx := appengine.NewContext(r)

}

func charactorsHandler(w http.ResponseWriter, r *http.Request) {
	// ctx := appengine.NewContext(r)

}

func charactorsHistoryHandler(w http.ResponseWriter, r *http.Request) {
	// ctx := appengine.NewContext(r)
}

func noticesHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	v, err := fetchNoticesFromCache(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintln(w, err)
		return
	}
	fmt.Fprintln(w, v)
}

func fetchNoticesHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	fetchNotices(ctx)
	notices := Notices{}
	if err := getFromFirebase(ctx, "notices", &notices); err == nil && len(notices) > 0 {
		notifyNotices(ctx, notices)
	}
}

func fetchServerStatusHandler(w http.ResponseWriter, r *http.Request) {

}

func notifyTopicHandler(w http.ResponseWriter, r *http.Request) {
	notifyDaily(mux.Vars(r)["topic"])
}
