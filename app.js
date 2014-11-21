(function() {
"use strict";

var DEFAULT_ROUTE = 'Notice';

var template = document.querySelector('#t');
var ajax, pages, scaffold;
var cache = {};

template.pages = [
  {name: 'Notice', hash: 'Notice', url: 'Notice.html', icon: 'home'},
  //{name: 'Equip Simulate', hash: 'EquipSimulate', url: 'Equip_Simulate.html', icon: 'perm-identity'},
  {name: 'Nations', hash: 'Nations', url: 'Nations.html', icon: 'account-balance'},
  {name: 'Expeditions', hash: 'Expeditions', url: 'Expeditions.html', icon: 'account-child'},
  {name: 'Trade Price', hash: 'TradePrice', url: 'Trade_Price.html', icon: 'drive-fusiontable'},
  {name: 'Gladiators Ranking', hash: 'ArenaRanking', url: 'Arena_Ranking.html', icon: 'stars'},
  {name: 'Gear Score Ranking', hash: 'GearRanking', url: 'Gear_Ranking.html', icon: 'swap-driving-apps-wheel'}
];

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

})();

PolymerExpressions.prototype.slice = function (v, n) {
  return v.slice(0, n) + (v.length > n ? "..." : "");
};

PolymerExpressions.prototype.toInt = function (v) {
  return parseInt(v);
};

PolymerExpressions.prototype.getRow = function (v) {
	if(v.t) {
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
	}
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

PolymerExpressions.prototype.percentage = function (v) {
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
			sum += parseInt(v.arr[i].gsx$sumoflv55.$t);
			startType = v.arr[i].gsx$_cn6ca ? 'A' : 'B';
		} else if(startType == 'A') {
			if(i < v.arr.length && !v.arr[i].gsx$_cn6ca) {
				sum += parseInt(v.arr[i].gsx$sumoflv55.$t);	
			} else {
				break;	
			}
		} else if(startType == 'B') {
			if(outI == false) {
				if(i < v.arr.length && !v.arr[i].gsx$_cn6ca) {
					sum += parseInt(v.arr[i].gsx$sumoflv55.$t);	
				} else {
					outI = true;	
				}
			}
			
			if(outJ == false) {
				if(!v.arr[j].gsx$_cn6ca) {
					sum += parseInt(v.arr[j].gsx$sumoflv55.$t);	
				} else {
					sum += parseInt(v.arr[j].gsx$sumoflv55.$t);	
					outJ = true;
				}
			}
			
			if(outI && outJ) {
				break;	
			}
		}
	}
	
	return ((parseInt(v.arr[target].gsx$sumoflv55.$t) / sum) * 100).toFixed(2);
};
