###Porject-Arche
Project-Arche는 일단 Polymer를 사용해 만든 single page application 이다. github를 통해 html 호스팅만 하고 있으며, server side 로직은 없다. Polymer의 google-sheet element를 이용해 Google Spreadsheets에 있는 데이터를 읽어와 적절히 파싱해서 뿌려주는 기능을 하고 있다. 

###Data Source
모든 데이터는 Google App Script를 통해 가져온 뒤 Spreadsheets에 쌓아놓는다. 짧게 말하자면 urlfetch 서비스와 time-based trigger를 이용한다. 일일 제한이 있는 서비스이기 때문에 가져올 수 있는 데이터에 한계가 있다. 더 많은 데이터를 가져올 수 있는 방안을 찾고 있다.
