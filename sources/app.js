(function() {
"use strict";

var DEFAULT_ROUTE = 'Nations';

var template = document.querySelector('#t');
var ajax, pages, scaffold, nowPage;
var cache = {};

template.pages = [
	{name: '국가', hash: 'Nations', url: './pages/Nations.html', icon: 'account-balance'},
	//{name: '국민', hash: 'People', url: './pages/People.html', icon: 'face'},
	{name: '원정대', hash: 'Expeditions', url: './pages/Expeditions.html', icon: 'account-child'},
	{name: '검투장 지배자', hash: 'ArenaRanking', url: './pages/Arena_Ranking.html', icon: 'stars'},	
	{name: '신화창조', hash: 'GearRanking', url: './pages/Gear_Ranking.html', icon: 'grade'},
	{name: '신화창조 (국가)', hash: 'NationsRanking', url: './pages/Nations_Ranking.html', icon: 'account-balance'},
	{name: '서버 인구 그래프', hash: 'Chart', url: './pages/Chart.html', icon: 'trending-down'}
];
	
template.servers = [
	{name: '키프로사', value: 'kyprosa'},
	{name: '진', value: 'gene'},
	{name: '루키우스', value: 'lucius'},
	{name: '에안나', value: 'eanna'},
	{name: '안탈론', value: 'anthalon'},
	{name: '크라켄', value: 'kraken'},
	{name: '레비아탄', value: 'leviathan'}
]

template.addEventListener('template-bound', function(e) {
	scaffold = document.querySelector('#scaffold');
	ajax = document.querySelector('#ajax');
	pages = document.querySelector('#pages');

	this.route = this.route || DEFAULT_ROUTE; // Select initial route.
});

template.menuItemSelected = function(e, detail, sender) {
	if (detail.isSelected) {		
		// Need to wait one rAF so <core-ajax> has it's URL set.
		this.async(function() {
			//if (!cache[ajax.url]) {
	   			ajax.go();
			//}
			scaffold.closeDrawer();
			nowPage = pages.selectedItem;
		});
	}
};

template.ajaxLoad = function(e, detail, sender) {
	e.preventDefault(); // prevent link navigation.
};

template.onResponse = function(e, detail, sender) {	
	//cache[ajax.url] = detail.response;
	
	/*
	setTimeout(function(cache, url) {
		return function() {
			cache[url] = null;			
		}
	}(cache, ajax.url), 600000);
	*/
  
    var article = detail.response.querySelector('article').innerHTML;
	var selectedIndex = pages.selectedIndex;
	var t = this;
	
	[].forEach.call(pages.items, function(v, i) {
		setTimeout(function() {if(i == selectedIndex) {
			t.injectBoundHTML(article, pages.items[i].firstElementChild);
		} else {
			var node = pages.items[i].firstElementChild;
			while (node.hasChildNodes()) {
				node.removeChild(node.firstChild);
			}
		}}, 0);
	});
};

template.changeReset = function(el) {
	if(!el.target.checked) {
		return;
	}
	
	nowPage.querySelector('#search-reset input').value = "";
	
	var default_ = el.target.dataset.default.trim();
	var target = el.target.dataset.target.trim();
	if(!target) {
		[].forEach.call(nowPage.querySelectorAll("tr." + default_), function(v) {
			setTimeout(function() {
        v.style.display = "";
      }, 0);
		});
		[].forEach.call(nowPage.querySelectorAll(".reset-target"), function(v) {
			var falseTarget = v.dataset.target.trim();
			[].forEach.call(nowPage.querySelectorAll("tr." + default_ + "." + falseTarget.replace(" ", ".")), function(v2) {
				setTimeout(function() {
          v2.style.display = "none";
        }, 0);
			});
		});
	} else {
		[].forEach.call(nowPage.querySelectorAll("tr." + default_), function(v) {
			setTimeout(function() {
        v.style.display = "none";
      }, 0);
		});
		[].forEach.call(nowPage.querySelectorAll("tr." + default_ + "." + target.replace(" ", ".")), function(v) {
			setTimeout(function() {
        v.style.display = "";
      }, 0);
		});
	}
};

template.searchReset = function(v) {
	var value = v.target.committedValue.trim();
	var default_ = v.target.dataset.default.trim();
	if(value == "") {
		[].forEach.call(nowPage.querySelectorAll("tr." + default_), function(v) {
			setTimeout(function() {
        v.style.display = "";
      }, 0);
		});
		return;	
	} else {
		[].forEach.call(nowPage.querySelectorAll("tr." + default_), function(v) {
			setTimeout(function() {
        if(v.dataset.name && v.dataset.name.indexOf(value) == -1) {
				v.style.display = "none";
			} else {
				v.style.display = "";
			}}, 0);
		});
		[].forEach.call(nowPage.querySelectorAll('.reset-radio[checked]'), function(v) {
      setTimeout(function() {
        v.checked = false;
      }, 0);
		});
	}
}

template.changeServer = function(el) {
	if(!el.target.checked) {
		return;
	}
	
	var default_ = el.target.dataset.default.trim();
	var target = el.target.dataset.target.trim();
	[].forEach.call(nowPage.querySelectorAll("tr." + default_), function(v) {
		setTimeout(function() {
      v.style.display = "none";
    }, 0);
	});
	[].forEach.call(nowPage.querySelectorAll("tr." + default_ + "." + target), function loop(v, i) {
		setTimeout(function() {
      v.style.display = "";
    }, 0);
	});
}
	
template.changeServer2 = function(el) {
	if(!el.target.checked) {
		return;
	}
	
	var default_ = el.target.dataset.default.trim();
	var target = el.target.dataset.target.trim();
	[].forEach.call(nowPage.querySelectorAll("tr." + default_), function(v) {
		setTimeout(function() {
      v.style.opacity = "0.3";
    }, 0);
	});
	[].forEach.call(nowPage.querySelectorAll("tr." + default_ + "." + target), function loop(v, i) {
		setTimeout(function() {
      v.style.opacity = "1";
    }, 0);
	});
}

template.toggleHelp = function(e) {
	var d = e.target.nextElementSibling;
	if (!d) {
		return;
	}
	d.toggle();
}

template.refresh = function(e) {
	ajax.go();
}

String.prototype.insert = function (index, string) {
  	if (index > 0)
    	return this.substring(0, index) + string + this.substring(index, this.length);
  	else
    	return string + this;
};

})();