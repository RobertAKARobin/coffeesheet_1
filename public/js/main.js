'use strict';

var Table = (function(){
	var $instance = {};

	$instance.load = function(data){
		var table = this;
		var i, l = data.length;
		table.rows = [];
		for(i = 0; i < l; i += 1){
			table.appendRow(data[i]);
		}
		table.padRows(table.findMaxRowLength());
		return table;
	}
	$instance.findMaxRowLength = function(){
		var table = this, row;
		var maxRowLength = 0;
		var i, l = table.rows.length;
		for(i = 0; i < l; i += 1){
			row = table.rows[i];
			maxRowLength = Math.max(row.cells.length, maxRowLength);
		}
		return maxRowLength;
	}
	$instance.padRows = function(length){
		var table = this, row;
		var i, l = table.rows.length;
		for(i = 0; i < l; i += 1){
			row = table.rows[i];
			row.pad(length);
		}
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

	$instance.construct = function(data){
		var row = this;
		var i, l = data.length;
		row.cells = [];
		for(i = 0; i < l; i += 1){
			row.appendCell(data[i]);
		}
	}
	$instance.appendCell = function(data){
		var row = this;
		var cell = Cell.create(data);
		row.cells.push(cell);
	}
	$instance.pad = function(length){
		var row = this;
		var i = row.cells.length;
		while(i < length){
			row.appendCell();
			i += 1;
		}
	}
	$instance.view = function(){
		var row = this;
		return row.cells.map(function(cell){
			return m('td', cell.data);
		});
	}

	return $Class;
})();

var Cell = (function(){
	var $Class = {};
	var $instance = {};

	$Class.create = function(){
		var cell = Object.create($instance);
		cell.construct.apply(cell, arguments);
		return cell;
	}

	$instance.construct = function(data){
		var cell = this;
		cell.data = (data || '');
	}

	return $Class;
})();

document.addEventListener('DOMContentLoaded', function(){
	m.mount(document.getElementById('app'), Table.load([
		['a','b','c','d','e'],
		['1','2','3','4','5',,],
		[,,,]
	]));
});
