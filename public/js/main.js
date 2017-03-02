'use strict';

var Table = {
	view: function(){
		var table = this;
		return m('table', [
			table.data.map(function(row){
				return m('tr', [
					row.map(function(cell){
						return m('td', cell);
					})
				]);
			})
		]);
	}
};

document.addEventListener('DOMContentLoaded', function(){
	Table.data = [
		['a','b','c','d','e'],
		['1','2','3','4','5']
	];
	m.mount(document.getElementById('app'), Table);
});
