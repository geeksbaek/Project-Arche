package main

import (
	"encoding/json"
	"sync"

	"strings"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/context"
)

// Notice 타입은 공지사항입니다.
type Notice struct {
	NoticeCategory string
	Title          string
	Description    string
	URL            string
	Date           string
}

// Notices 타입은 공지사항의 Slice입니다.
type Notices []Notice

// NoticeCategory 타입은 공지사항의 카테고리입니다.
type NoticeCategory struct {
	Name   string
	URL    string
	Parser NoticeParser
}

// NoticeParser 타입은 공지사항의 파서입니다.
type NoticeParser func(*goquery.Document, string) Notices

// query
const (
	mboardNoticeRowQuery = `.news tbody tr`
	eventNoticeRowQuery  = `ul.lst_event li a`
)

var allNoticesCategory = []NoticeCategory{
	{"공지사항", "https://archeage.xlgames.com/mboards/notice", mboardNoticeParser},
	{"업데이트", "https://archeage.xlgames.com/mboards/patchnote", mboardNoticeParser},
	{"이벤트", "https://archeage.xlgames.com/events", eventNoticeParser},
	{"아키인사이드", "https://archeage.xlgames.com/mboards/inside", mboardNoticeParser},
	{"아미고", "https://archeage.xlgames.com/mboards/amigo", mboardNoticeParser},
}

func fetchAllNotice(ctx context.Context) string {
	notices := Notices{}
	temp := make([][]Notice, len(allNoticesCategory))

	wg := new(sync.WaitGroup)
	wg.Add(len(allNoticesCategory))
	for i, noticeCategory := range allNoticesCategory {
		go func(i int, noticeCategory NoticeCategory) {
			defer wg.Done()
			temp[i] = noticeCategory.fetch(ctx, noticeCategory.Parser)
		}(i, noticeCategory)
	}
	wg.Wait()

	for _, t := range temp {
		notices = append(notices, t...)
	}

	marshaled, err := json.MarshalIndent(notices, "", "\t")
	if err != nil {
		return err.Error()
	}
	return string(marshaled)
}

func (n NoticeCategory) fetch(ctx context.Context, parser NoticeParser) Notices {
	doc, err := get(ctx, n.URL)
	if err != nil {
		return nil
	}
	return parser(doc, n.Name)
}

func mboardNoticeParser(doc *goquery.Document, categoryName string) (notices Notices) {
	doc.Find(mboardNoticeRowQuery).Each(func(i int, row *goquery.Selection) {
		var notice Notice

		notice.NoticeCategory = categoryName
		if row.Find("a.pjax .tit, a.pjax strong.thumb-tit").Length() > 0 {
			notice.Title = strings.TrimSpace(row.Find("a.pjax .tit, a.pjax strong.thumb-tit").Text())
		} else {
			notice.Title = strings.TrimSpace(row.Find("a.pjax").Text())
		}
		notice.Description = strings.TrimSpace(row.Find("a.pjax .txt, a.pjax span.thumb-txt").Text())
		notice.URL, _ = row.Find("a.pjax").Attr("href")
		notice.Date = strings.TrimSpace(row.Find("td.time").Text())

		notices = append(notices, notice)
	})
	return
}

func eventNoticeParser(doc *goquery.Document, categoryName string) (notices Notices) {
	doc.Find(eventNoticeRowQuery).Each(func(i int, row *goquery.Selection) {
		var notice Notice

		notice.NoticeCategory = categoryName
		notice.Title = strings.TrimSpace(row.Find("dl dt").Text())
		notice.Description = strings.TrimSpace(row.Find("dl dd:not(.img)").Text())
		notice.URL, _ = row.Attr("href")

		notices = append(notices, notice)
	})
	return
}
