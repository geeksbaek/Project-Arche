package main

import (
	"strconv"

	"encoding/json"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/context"
)

// AuctionSearchParam 구조체는 경매장 검색에 사용될 인자들의 집합입니다.
type AuctionSearchParam struct {
	ItemName    string
	ServerGroup string
	ItemGrade   string
}

// SearchResult 구조체는 경매장 검색 결과를 표현합니다.
type SearchResult struct {
	Quantity int
	Image    string
	Price
}

// Price 구조체는 금, 은, 동으로 이루어진 가격 정보를 표현합니다.
type Price struct {
	Gold   int
	Silver int
	Bronze int
}

// url
const (
	auctionURL = "https://archeage.xlgames.com/auctions/list/ajax"
)

// query
const (
	rowQuery      = `.tlist`
	priceQuery    = `.money-layer .buybid .gol_num`
	quantityQuery = `.item-num`
	imageQuery    = `.eq_img img`
)

func auctionSearch(ctx context.Context, ap AuctionSearchParam) (searchResult string) {
	searchForm := form(map[string]string{
		"sortType":     "BUYOUT_PRICE_ASC",
		"searchType":   "NAME",
		"serverCode":   ap.ServerGroup,
		"gradeId":      ap.ItemGrade,
		"keyword":      ap.ItemName,
		"equalKeyword": "true",
	})

	doc, err := post(ctx, auctionURL, searchForm)
	if err != nil {
		return
	}

	var searchResults []SearchResult

	doc.Find(rowQuery).Each(func(i int, row *goquery.Selection) {
		var searchResult SearchResult

		// get price
		row.Find(priceQuery).Each(func(i int, cell *goquery.Selection) {
			switch i {
			case 0:
				searchResult.Gold, _ = strconv.Atoi(cell.Text())
			case 1:
				searchResult.Silver, _ = strconv.Atoi(cell.Text())
			case 2:
				searchResult.Bronze, _ = strconv.Atoi(cell.Text())
			}
		})

		searchResult.Quantity, _ = strconv.Atoi(row.Find(quantityQuery).Text())
		searchResult.Image, _ = row.Find(imageQuery).Attr("src")

		searchResults = append(searchResults, searchResult)
	})

	marshaled, err := json.Marshal(searchResults)
	if err != nil {
		return
	}

	return string(marshaled)
}
