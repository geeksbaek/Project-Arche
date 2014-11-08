(function() {
"use strict";

var DEFAULT_ROUTE = 'Main';

var template = document.querySelector('#t');
var ajax, pages, titles, toolbar, scaffold;
var cache = {};

template.pages = [
  {name: 'Main', hash: 'Main', url: '/main.html', icon: 'home'},
  {name: 'Equip Simulate', hash: 'EquipSimulate', url: '/Equip_Simulate.html', icon: 'perm-identity'},
  {name: 'Nations', hash: 'Nations', url: '/Nations.html', icon: 'account-balance'},
  {name: 'Expeditions', hash: 'Expeditions', url: '/Expeditions.html', icon: 'account-child'},
  {name: 'Trade Price', hash: 'TradePrice', url: '/Trade_Price.html', icon: 'drive-fusiontable'},
  {name: 'Gladiators Ranking', hash: 'ArenaRanking', url: '/Arena_Ranking.html', icon: 'stars'},
  {name: 'Gear Score Ranking', hash: 'GearRanking', url: '/Gear_Ranking.html', icon: 'swap-driving-apps-wheel'}
];

template.addEventListener('template-bound', function(e) {
  scaffold = document.querySelector('#scaffold');
  ajax = document.querySelector('#ajax');
  pages = document.querySelector('#pages');
	titles = document.querySelector('#titles');
  toolbar = document.querySelector('#toolbar');
  var keys = document.querySelector('#keys');

  // Allow selecting pages by num keypad. Dynamically add
  // [1, template.pages.length] to key mappings.
  var keysToAdd = Array.apply(null, template.pages).map(function(x, i) {
    return i + 1;
  }).reduce(function(x, y) {
    return x + ' ' + y;
  });
  keys.keys += ' ' + keysToAdd;

  this.route = this.route || DEFAULT_ROUTE; // Select initial route.
});

template.keyHandler = function(e, detail, sender) {
  // Select page by num key. 
  var num = parseInt(detail.key);
  if (!isNaN(num) && num <= this.pages.length) {
    pages.selectIndex(num - 1);
    return;
  }

  switch (detail.key) {
    case 'left':
    case 'up':
      pages.selectPrevious();
      break;
    case 'right':
    case 'down':
      pages.selectNext();
      break;
    case 'space':
      detail.shift ? pages.selectPrevious() : pages.selectNext();
      break;
  }
};

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
	
  var article = detail.response.querySelector('article').innerHTML;
  var title = detail.response.querySelector('title').innerHTML;
	
  this.injectBoundHTML(article, pages.selectedItem.firstElementChild);
  this.injectBoundHTML(title, titles.selectedItem.firstElementChild);
};

})();