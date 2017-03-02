'use strict';

document.addEventListener('DOMContentLoaded', function(){
	var data = [
		['a','b','c','d','e'],
		['1','2','3','4','5']
	];
	m.mount(document.getElementById('app'), {
		view: function(){
			return m('table', [
				data.map(function(row){
					return m('tr', [
						row.map(function(cell){
							return m('td', cell);
						})
					]);
				})
			]);
		}
	});
});
