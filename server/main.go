package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"google.golang.org/appengine"
)

func init() {
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/", index)

	// about Auction REST API
	r.HandleFunc("/auction/{server_group}/{item_name}", auction)
	r.HandleFunc("/auction/{server_group}/{item_name}/{item_grade}", auction)

	// about Expedition REST API
	r.HandleFunc("/expedition/{expedition_name}", expedition)

	// about notice REST API
	r.HandleFunc("/notice", notice)

	http.Handle("/", r)
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

func auction(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	auctionSearchParam := createAuctionSearchParam(mux.Vars(r))
	fmt.Fprintln(w, auctionSearch(ctx, auctionSearchParam))
}

func expedition(w http.ResponseWriter, r *http.Request) {

}

func notice(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	fmt.Fprintln(w, fetchAllNotice(ctx))
}
