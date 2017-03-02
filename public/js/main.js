'use strict';

var Table = (function(){
	var $instance = {};

	$instance.data = [];
	$instance.load = function(data){
		var table = this;
		table.rows = data;
		return table;
	}
	$instance.view = function(){
		var table = this;
		return m('table', [
			table.rows.map(function(row){
				return m('tr', [
					row.map(function(cell){
						return m('td', cell);
					})
				]);
			})
		]);
	}

	return $instance;
})();

document.addEventListener('DOMContentLoaded', function(){
	m.mount(document.getElementById('app'), Table.load([
		['a','b','c','d','e'],
		['1','2','3','4','5']
	]));
});
