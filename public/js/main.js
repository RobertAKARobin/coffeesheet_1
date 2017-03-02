'use strict';

var Table = (function(){
	var $instance = {};

	$instance.rows = [];
	$instance.load = function(data){
		var table = this;
		data.forEach(table.appendRow.bind(table));
		return table;
	}
	$instance.appendRow = function(data){
		var table = this;
		var row = Row.create(data);
		table.rows.push(row);
	}
	$instance.view = function(){
		var table = this;
		return m('table', [
			table.rows.map(function(row, index){
				return m('tr', [
					m('th', (index + 1)),
					row.view()
				]);
			})
		]);
	}

	return $instance;
})();

var Row = (function(){
	var $Class = {};
	var $instance = {};

	$Class.create = function(){
		var row = Object.create($instance);
		row.construct.apply(row, arguments);
		return row;
	}

	$instance.cells = [];
	$instance.construct = function(data){
		var row = this;
		row.cells = data;
	}
	$instance.view = function(){
		var row = this;
		return row.cells.map(function(cell){
			return m('td', cell);
		});
	}

	return $Class;
})();

document.addEventListener('DOMContentLoaded', function(){
	m.mount(document.getElementById('app'), Table.load([
		['a','b','c','d','e'],
		['1','2','3','4','5']
	]));
});
