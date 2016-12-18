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

// AuctionSearchResult 구조체는 경매장 검색 결과를 표현합니다.
type AuctionSearchResult struct {
	Quantity    int
	Image       string
	TotalPrice  Price
	SinglePrice Price
}

// Price 구조체는 금, 은, 동으로 이루어진 가격 정보를 표현합니다.
type Price struct {
	Gold   int
	Silver int
	Bronze int
}

// Int 메소드는 Price 구조체를 정수로 변환합니다.
func (p Price) Int() int {
	return p.Bronze + p.Silver*100 + p.Gold*10000
}

// IntPrice 타입은 정수에서 Price 타입으로 변환하기 위한 메소드를 붙이기 위한 타입입니다.
type IntPrice int

// Price 메소드는 정수를 Price 타입으로 변환합니다.
func (i IntPrice) Price() Price {
	return Price{
		Gold:   int(i) / 10000,
		Silver: (int(i) % 10000) / 100,
		Bronze: (int(i) % 10000) % 100,
	}
}

// func (p Price) Add(p2 Price) (ret Price) {}
// func (p Price) Sub(p2 Price) (ret Price) {}
// func (p Price) Mul(n int) (ret Price) {}

// Div 메소드는 Price의 값을 주어진 정수로 나눕니다.
func (p Price) Div(n int) (ret Price) {
	return IntPrice(p.Int() / n).Price()
}

// url
const (
	auctionURL = "https://archeage.xlgames.com/auctions/list/ajax"
)

// query
const (
	rowQuery      = `.tlist`
	priceQuery    = `.auction-bidmoney > .buybid em.gol_num`
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

	var searchResults []AuctionSearchResult

	doc.Find(rowQuery).Each(func(i int, row *goquery.Selection) {
		var searchResult AuctionSearchResult

		// get price
		sumIntPrice := 0
		row.Find(priceQuery).Each(func(i int, moneyCell *goquery.Selection) {
			n, _ := strconv.Atoi(moneyCell.Text())
			sumIntPrice = (sumIntPrice * 100) + n
		})
		searchResult.TotalPrice = IntPrice(sumIntPrice).Price()
		if searchResult.Quantity, err = strconv.Atoi(row.Find(quantityQuery).Text()); err != nil {
			searchResult.Quantity = 1
		}
		searchResult.Image, _ = row.Find(imageQuery).Attr("src")
		searchResult.SinglePrice = searchResult.TotalPrice.Div(searchResult.Quantity)

		searchResults = append(searchResults, searchResult)
	})

	marshaled, err := json.MarshalIndent(searchResults, "", "\t")
	if err != nil {
		return
	}

	return string(marshaled)
}
