(function() {
"use strict";

var DEFAULT_ROUTE = 'Nations';

var template = document.querySelector('#t');
var ajax, pages, scaffold;
var cache = {};

template.pages = [
  //{name: '소개', hash: 'Notice', url: './pages/Notice.html', icon: 'home'},
  //{name: '장비 시뮬레이터', hash: 'EquipSimulate', url: './pages/Equip_Simulate.html', icon: 'perm-identity'},
  {name: '국가', hash: 'Nations', url: './pages/Nations.html', icon: 'account-balance'},
  {name: '원정대', hash: 'Expeditions', url: './pages/Expeditions.html', icon: 'account-child'},
  //{name: 'Trade Price', hash: 'TradePrice', url: './pages/Trade_Price.html', icon: 'drive-fusiontable'},
  {name: '검투장 지배자', hash: 'ArenaRanking', url: './pages/Arena_Ranking.html', icon: 'stars'},
  {name: '신화창조', hash: 'GearRanking', url: './pages/Gear_Ranking.html', icon: 'star'},
  {name: '리셋창조', hash: 'ResetRanking', url: './pages/Reset_Ranking.html', icon: 'visibility'}
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
			if (!cache[ajax.url]) {
				ajax.go();
			}
			
			if (detail.item.tagName != 'CORE-SUBMENU') {
      	scaffold.closeDrawer();
			}
    });

  }
};

template.ajaxLoad = function(e, detail, sender) {
  e.preventDefault(); // prevent link navigation.
};

template.onResponse = function(e, detail, sender) {	
	cache[ajax.url] = detail.response;
	
	setTimeout(function(cache, url) {
		return function() {
			cache[url] = null;			
		}
	}(cache, ajax.url), 600000);
	
  var article = detail.response.querySelector('article').innerHTML;	
  this.injectBoundHTML(article, pages.selectedItem.firstElementChild);
};
	
template.serverChange = function(el) {
	if(!el.target.checked) {
		return;
	}
	
	var default_ = el.target.dataset.default;
	var target = el.target.dataset.target;
	[].forEach.call(document.querySelectorAll("tr." + default_), function(v) {
		v.style.display = "none";
	});
	[].forEach.call(document.querySelectorAll("tr." + default_ + "." + target), function(v) {
		v.style.display = "";
	});
}

template.resetChange = function(el) {
	document.querySelector('#search-reset input').value = "";
	
	if(!el.target.checked) {
		return;
	}
	
	var default_ = el.target.dataset.default;
	var target = el.target.dataset.target;
	if(!target) {
		[].forEach.call(document.querySelectorAll("tr." + default_), function(v) {
			v.style.display = "";
		});
		[].forEach.call(document.querySelectorAll(".reset-target"), function(v) {
			var falseTarget = v.dataset.target;
			for(i in falseTarget) {
				[].forEach.call(document.querySelectorAll("tr." + default_ + "." + falseTarget.replace(" ", ".")), function(v2) {
					v2.style.display = "none";
				});
			}
		});
	} else {
		[].forEach.call(document.querySelectorAll("tr." + default_), function(v) {
			v.style.display = "none";
		});
		[].forEach.call(document.querySelectorAll("tr." + default_ + "." + target.replace(" ", ".")), function(v) {
			v.style.display = "";
		});
	}
};

template.searchReset = function(v) {
	var value = v.target.committedValue;
	var default_ = v.target.dataset.default;
	if(value == "") {
		[].forEach.call(document.querySelectorAll("tr." + default_), function(v) {
			v.style.display = "";
		});
		console.log(value);
		return;	
	} else {
		[].forEach.call(document.querySelectorAll("tr." + default_), function(v) {
			if(v.dataset.name && v.dataset.name.indexOf(value) == -1) {
				v.style.display = "none";
			} else {
				v.style.display = "";
			}
		});

		[].forEach.call(document.querySelectorAll('paper-radio-button.reset-radio[checked=true]'), function(v) {
			if(v.checked) {
				v.checked = false;
			}
		});
	}
}

template.toggleHelp = function(e) {
	var d = e.target.nextElementSibling;
	if (!d) {
		return;
	}
	d.toggle();
}

template.refresh = function(e) {
	console.log('refresh');
	ajax.go();
}

})();

PolymerExpressions.prototype.slice = function (v, n) {
  return v.slice(0, n) + (v.length > n ? "..." : "");
};

PolymerExpressions.prototype.toFixed = function (v, n) {
  return v.toFixed(n);
};

PolymerExpressions.prototype.redOrBlue = function (v) {
	var i = parseInt(v);
  return i > 0 ? 'red' : i < 0 ? 'blue' : '';
};

PolymerExpressions.prototype.setColor = function (v) {
  switch(v) {
		case "통과":
			return "green";
		case "주의":
			return "goldenrod";
		case "경고":
			return "red";
	}
};

PolymerExpressions.prototype.setContextualClasses = function (v) {
  switch(v) {
		case "통과":
			return "pass";
		case "주의":
			return "warning";
		case "경고":
			return "danger";
	}
};

PolymerExpressions.prototype.propertyTranslate = function (v) {
  var properties = v.split(" ");
	var translated = [];
	
	var propertyMap = {
		'격투': 'battlerage',
		'철벽': 'defence',
		'죽음': 'occultism',
		'마법': 'sorcery',
		'낭만': 'songcraft',
		'환술': 'witchcraft',
		'의지': 'auramancy',
		'야성': 'archery',
		'사명': 'shadowplay',
		'사랑': 'vitalism',
	};
	
	for(i in properties) {
		translated.push(propertyMap[properties[i]]);
	}
	
	return translated.join(" ");
};

PolymerExpressions.prototype.serverTranslate = function (v) {
	var serverMap = {
		'키프로사': 'kyprosa',
		'진': 'gene',
		'루키우스': 'lucius',
		'에안나': 'eanna',
		'안탈론': 'anthalon',
		'크라켄': 'kraken',
		'레비아탄': 'leviathan',
	};
	
	return serverMap[v];
};

PolymerExpressions.prototype.getRow = function (v) {
	var count = 0;
	var start = false;
	for(var i = 0; i < v.arr.length; i++) {
		if(v.arr[i].gsx$_cn6ca && v.arr[i].gsx$_cn6ca.$t == v.t) {
			start = true;
		}
		if(start && v.arr[i].gsx$_cn6ca && v.arr[i].gsx$_cn6ca.$t != v.t) {
			break;
		}
		if(start) {
			count++;	
		}			
	}
	return count;
};

PolymerExpressions.prototype.serverPercentage = function (v) {
	var sum = 0;
	var start = false;
	for(var i = 0; i < v.arr.length; i++) {
		if(v.arr[i].gsx$_cn6ca && v.arr[i].gsx$_cn6ca.$t == v.t) {
			start = true;
		}
		if(start && v.arr[i].gsx$_cn6ca && v.arr[i].gsx$_cn6ca.$t != v.t) {
			break;
		}
		if(start) {
			sum += parseInt(v.arr[i].gsx$sumoflv55.$t);	
		}			
	}
	
	var total = 0;
	for(var i = 0; i < v.arr.length; i++) {
		total += parseInt(v.arr[i].gsx$sumoflv55.$t);
	}
	
	return ((sum / total) * 100).toFixed(2);
};

PolymerExpressions.prototype.comma = function (num) {
  var len, point, str;  
  
	num = num + "";  
	point = num.length % 3  
	len = num.length;  

	str = num.substring(0, point);  
	while (point < len) {  
			if (str != "") str += ",";  
			str += num.substring(point, point + 3);  
			point += 3;  
	}  
	return str;
};

PolymerExpressions.prototype.nationPercentage = function (v) {
	var target;
	for(var i = 0; i < v.arr.length; i++) {
		if(v.arr[i] == v.t) {
			target = i;
			break;
		}
	}
		
	var startType;
	var sum = 0;
	for(var i = target, j = target, outI = false, outJ = false; ; i++, j--) {
		if(i == j) {
			sum += parseInt(v.arr[i][v.m].$t);
			startType = v.arr[i].gsx$_cn6ca ? 'A' : 'B';
		} else if(startType == 'A') {
			if(i < v.arr.length && !v.arr[i].gsx$_cn6ca) {
				sum += parseInt(v.arr[i][v.m].$t);	
			} else {
				break;	
			}
		} else if(startType == 'B') {
			if(!outI) {
				if(i < v.arr.length && !v.arr[i].gsx$_cn6ca) {
					sum += parseInt(v.arr[i][v.m].$t);	
				} else {
					outI = true;	
				}
			}
			
			if(!outJ) {
				if(!v.arr[j].gsx$_cn6ca) {
					sum += parseInt(v.arr[j][v.m].$t);	
				} else {
					sum += parseInt(v.arr[j][v.m].$t);	
					outJ = true;
				}
			}
			
			if(outI && outJ) {
				break;	
			}
		}
	}
	
	return ((parseInt(v.arr[target][v.m].$t) / sum) * 100).toFixed(2);
};

PolymerExpressions.prototype.parseDate = function (v) {
	var timeSince = function (date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
			return interval + "년";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
			return interval + "개월";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
			return interval + "일";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
			return interval + "시간";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
			return interval + "분";
    }
    return Math.floor(seconds) + " 초";
	}
	
	var isInt = function isInt(x) {
		var y = parseInt(x, 10);
		return !isNaN(y) && x == y && x.toString() == y.toString();
	}
	
	var d = new Date(isInt(v) ? parseInt(v) : v);
	
	return timeSince(d) + " 전";
}