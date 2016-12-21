## Project-Arche 2.0

### REST API

#### Auctions
```
GET https://project-arche.appspot.com/api/auctions/{server_group}/{item_name}
GET https://project-arche.appspot.com/api/auctions/{server_group}/{item_name}/{item_grade}
```

#### Expeditions
```
GET https://project-arche.appspot.com/api/expeditions/{server_name}/{expedition_number}
```

#### Charactors
```
GET https://project-arche.appspot.com/api/charactors/{charactor_uuid}
GET https://project-arche.appspot.com/api/charactors/{charactor_uuid}/history
```

#### Notices
```
GET     https://project-arche.appspot.com/api/notices

```

#### Daily Event Notification
```
PUT     https://project-arche.appspot.com/api/subscribe/{topic}/{token}
DELETE  https://project-arche.appspot.com/api/unsubscribe/{topic}/{token}
```
