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
	r.HandleFunc("/api/auctions/{server_group}/{item_name}", auctions)
	r.HandleFunc("/api/auctions/{server_group}/{item_name}/{item_grade}", auctions)

	// about Expedition REST API
	r.HandleFunc("/api/expeditions/{expedition_name}", expeditions)

	// about Charactor REST API
	r.HandleFunc("/api/charactors/{charactor_name}", charactors)

	// about notice REST API
	r.HandleFunc("/api/notices", notices)

	// about push notification
	r.HandleFunc("/tasks/Flowers_of_the_Blind", func(w http.ResponseWriter, r *http.Request) {

	})

	r.HandleFunc("/tasks/A_battle_that_shakes_wheat_fields", func(w http.ResponseWriter, r *http.Request) {

	})

	r.HandleFunc("/tasks/Freedom_Island_gold_trade", func(w http.ResponseWriter, r *http.Request) {

	})

	r.HandleFunc("/tasks/Red_Dew_Battle", func(w http.ResponseWriter, r *http.Request) {

	})

	r.HandleFunc("/tasks/Attack_of_abyss", func(w http.ResponseWriter, r *http.Request) {

	})

	r.HandleFunc("/tasks/A_precursor_of_storm", func(w http.ResponseWriter, r *http.Request) {

	})

	r.HandleFunc("/tasks/Mirage_Island_fishing_tournament", func(w http.ResponseWriter, r *http.Request) {

	})

	r.HandleFunc("/tasks/Siege", func(w http.ResponseWriter, r *http.Request) {

	})

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

func auctions(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	auctionSearchParam := createAuctionSearchParam(mux.Vars(r))
	fmt.Fprintln(w, auctionSearch(ctx, auctionSearchParam))
}

func expeditions(w http.ResponseWriter, r *http.Request) {

}

func charactors(w http.ResponseWriter, r *http.Request) {

}

func notices(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	fmt.Fprintln(w, fetchAllNotice(ctx))
}
