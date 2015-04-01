PolymerExpressions.prototype.getProfileImage = function(v) {
	return v + '/profileImage';
}

PolymerExpressions.prototype.getRank = function(v) {
    return Math.ceil((v.v / v.arr.length) * 100).toFixed() + "%";
};

PolymerExpressions.prototype.getChangeSimbol = function(v) {
    return v > 0 ? '▲' + v : v < 0 ? '▼' + Math.abs(v) : '';
};

PolymerExpressions.prototype.getChangeColor = function(v) {
    return v > 0 ? 'red' : v < 0 ? 'blue' : 'black';
};

PolymerExpressions.prototype.getRandomNumber = function(v) {
    return Math.floor((Math.random() * v) + 1);
};

PolymerExpressions.prototype.parseInt = function (v) {
	return parseInt(v);
};

PolymerExpressions.prototype.toFixed = function (v, n) {
	return v.toFixed(n);
};

PolymerExpressions.prototype.getRankIndex = function (v) {
    var items = [];
	for(i in v.arr) {
		if(v.arr[i][v.target]) {
			items.push(v.arr[i][v.target]['$t']);
		}
	}

	var index = items.sort(function(a, b) {
		var a = parseInt(a);
		var b = parseInt(b);
		return a > b ? -1 : a < b ? 1 : 0;
	}).indexOf(v.value);
	return index + 1;
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
};