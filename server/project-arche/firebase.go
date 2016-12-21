package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	fcm "github.com/NaySoftware/go-fcm"
	"golang.org/x/net/context"
	"golang.org/x/oauth2/google"
)

// firebase config
var (
	titleMap = map[string]string{
		"Flowers_of_the_Blind":              "눈먼 자들의 꽃",
		"A_battle_that_shakes_wheat_fields": "밀밭을 흔드는 전투",
		"Freedom_Island_gold_trade":         "자유도 금화 교역상",
		"Red_Dew_Battle":                    "붉은 이슬 전투",
		"Attack_of_abyss":                   "심연의 습격",
		"A_precursor_of_storm":              "풍랑의 전조",
		"Mirage_Island_fishing_tournament":  "신기루 섬 낚시대회",
		"Siege": "공성전",
	}
)

const (
	titleNotificationFormat = "%s 알림"
	bodyNotificationFormat  = "15분 뒤에 %s 입니다."
)

func makeFcmNotificationPayload(event string) *fcm.NotificationPayload {
	return &fcm.NotificationPayload{
		Title: fmt.Sprintf(titleNotificationFormat, titleMap[event]),
		Body:  fmt.Sprintf(bodyNotificationFormat, titleMap[event]),
	}
}

func notifyDaily(event string) (*fcm.FcmResponseStatus, error) {
	c := fcm.NewFcmClient("...")
	c.SetNotificationPayload(makeFcmNotificationPayload(event))
	return c.NewFcmTopicMsg("/topics/"+event, nil).Send()
}

func notifyNotices(ctx context.Context, notices Notices) {

}

func genFirebaseClient(ctx context.Context) *http.Client {
	jsonKey, err := ioutil.ReadFile("project-arche/credentials/firebase.json")
	if err != nil {
		log.Fatal(err)
	}
	conf, err := google.JWTConfigFromJSON(jsonKey,
		"https://www.googleapis.com/auth/userinfo.email",
		"https://www.googleapis.com/auth/firebase.database")
	if err != nil {
		log.Fatal(err)
	}
	return conf.Client(ctx)
}
