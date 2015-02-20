Project-Arche는 Polymer를 사용해 만든 Single Page Application이다. 서버는 따로 운영하지 않고 Google Sheet와 Google Apps Script 서비스를 사용한다. 일정 주기마다 Apps Script에서 지원하는 UrlFetch API 등을 이용해 공식 홈페이지의 데이터를 가져와 파싱한 뒤 Google Sheet에 저장해두고, 클라이언트 사이드에서 이 Google Sheet의 데이터를 가져와 뿌려주고 있다.

http://youtu.be/k35ciJNoqR0
