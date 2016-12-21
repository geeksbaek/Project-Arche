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
	r.HandleFunc("/api/auctions/{server_group}/{item_name}", apiHandler(auctions)).Methods("GET")
	r.HandleFunc("/api/auctions/{server_group}/{item_name}/{item_grade}", apiHandler(auctions)).Methods("GET")

	// Expedition REST API
	r.HandleFunc("/api/expeditions/{server_name}/{expedition_number}", apiHandler(expeditions)).Methods("GET")

	// Charactor REST API
	r.HandleFunc("/api/charactors/{charactor_uuid}", apiHandler(charactors)).Methods("GET")
	r.HandleFunc("/api/charactors/{charactor_uuid}/history", apiHandler(charactorsHistory)).Methods("GET")

	// notice REST API
	r.HandleFunc("/api/notices", apiHandler(notices)).Methods("GET")

	// notification API
	r.HandleFunc("/api/subscribe/{topic}/{token}", apiHandler(subscribe)).Methods("PUT")
	r.HandleFunc("/api/unsubscribe/{topic}/{token}", apiHandler(unsubscribe)).Methods("DELETE")

	// cron job
	r.HandleFunc("/tasks/notices", func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		fetchNotice(ctx)
		notices := Notices{}
		if err := getFromFirebase(ctx, "notices", &notices); err == nil && len(notices) > 0 {
			notifyNotices(ctx, notices)
		}
	})
	r.HandleFunc("/tasks/notify/{topic}", func(w http.ResponseWriter, r *http.Request) {
		taskWorker(mux.Vars(r)["topic"])
	})

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

func createAuctionSearchParam(vars map[string]string) (ap AuctionSearchParam) {
	ap.ItemName = vars["item_name"]
	ap.ServerGroup = vars["server_group"]
	ap.ItemGrade = vars["item_grade"]
	return
}

func auctions(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	auctionSearchParam := createAuctionSearchParam(mux.Vars(r))
	fmt.Fprintln(w, auctionSearch(ctx, auctionSearchParam))
}

func expeditions(w http.ResponseWriter, r *http.Request) {
	// ctx := appengine.NewContext(r)

}

func charactors(w http.ResponseWriter, r *http.Request) {
	// ctx := appengine.NewContext(r)

}

func charactorsHistory(w http.ResponseWriter, r *http.Request) {
	// ctx := appengine.NewContext(r)
}

func notices(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	v, err := fetchNoticeFromCache(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintln(w, err)
		return
	}
	fmt.Fprintln(w, v)
}

func subscribe(w http.ResponseWriter, r *http.Request) {
	// if err := subscribe("notices", mux.Vars(r)["token"]); err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	fmt.Fprintln(w, err)
	// }
}

func unsubscribe(w http.ResponseWriter, r *http.Request) {
	// if err := unsubscribe("notices", mux.Vars(r)["token"]); err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	fmt.Fprintln(w, err)
	// }
}

func taskWorker(event string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		notifyDaily(event)
	}
}
