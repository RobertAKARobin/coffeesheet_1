'use strict';

var Table = (function(){
	var $Class = {};
	var $instance = {};

	$Class.create = function(){
		var table = Object.create($instance);
		table.construct.apply(table, arguments);
		return table;
	}

	$instance.construct = function(){
		var table = this;
		table.rows = [];
		table.maxRowLength = 0;
	}
	$instance.load = function(data){
		var table = this;
		var i, l = data.length;
		for(i = 0; i < l; i += 1){
			table.appendRow(data[i]);
		}
		table.padRows(table.maxRowLength);
		return table;
	}
	$instance.padRows = function(length){
		var table = this, row;
		var i, l = table.rows.length;
		for(i = 0; i < l; i += 1){
			row = table.rows[i];
			row.pad(length);
		}
	}
	$instance.createRow = function(data){
		var table = this;
		var row = Row.create(data || []);
		table.maxRowLength = Math.max(row.cells.length, table.maxRowLength);
		row.pad(table.maxRowLength);
		return row;
	}
	$instance.appendRow = function(data, index){
		var table = this;
		var row = table.createRow(data);
		if(isNaN(index)){
			table.rows.push(row);
		}else{
			table.rows.splice((index + 1), 0, row);
		}
	}

	$instance.view = function(){
		var table = this;
		return m('table', [
			table.rows.map(function(row, index){
				return m('tr', [
					m('th', {
						onclick: table.appendRow.bind(table, [], index)
					}, (index + 1)),
					row.view()
				]);
			})
		]);
	}

	return $Class;
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
		var data = (data || []);
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
			return m('td', [
				m('input', {
					value: cell.data(),
					oninput: m.withAttr('value', cell.data)
				})
			]);
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
		cell.data = m.stream(data || '')
	}

	return $Class;
})();

document.addEventListener('DOMContentLoaded', function(){
	var table = Table.create();
	m.mount(document.getElementById('app'), table.load([
		['a','b','c','d','e'],
		['1','2','3','4','5',,],
		[,,,]
	]));
});
