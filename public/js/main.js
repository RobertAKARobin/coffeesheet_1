'use strict';

var Table = (function(){
	var $Class = {};
	var $instance = {};

	$Class.create = function(){
		var table = Object.create($instance);
		construct.apply(table, arguments);
		return table;
	}

	var construct = function(){
		var table = this;
		table.rows = [];
		table.cols = [];
		table.events = defineEvents(table);
		table.maxRowLength = 0;
	}
	$instance.load = function(data){
		var table = this;
		var i, l = data.length;
		for(i = 0; i < l; i += 1){
			table.insertRow(data[i]);
		}
		table.padRows();
		table.mapColumns();
		return table;
	}
	$instance.padRows = function(){
		var table = this;
		var length = table.maxRowLength;
		var i, l = table.rows.length;
		if(!table.rowsAreSameLength){
			for(i = 0; i < l; i += 1){
				table.rows[i].pad(length);
			}
			table.rowsAreSameLength = true;
		}
	}
	$instance.insertRow = function(data, index){
		var table = this;
		var row = Row.create(data);
		var rowLength = row.cells.length;
		if(rowLength != table.maxRowLength){
			table.rowsAreSameLength = false;
		}
		table.maxRowLength = Math.max(rowLength, table.maxRowLength);
		if(isNaN(index)){
			table.rows.push(row);
		}else{
			table.rows.splice((index + 1), 0, row);
		}
	}
	$instance.mapColumns = function(){
		var table = this;
		var r, row, numRows = table.rows.length;
		var c, col, numCols;
		table.cols = [];
		for(r = 0; r < numRows; r++){
			row = table.rows[r];
			numCols = row.cells.length;
			for(c = 0; c < numCols; c++){
				col = (table.cols[c] || (table.cols[c] = []));
				col.push(row.cells[c]);
			}
		}
	}

	var defineEvents = function($instance){
		var table = $instance;
		var events = {};
		events.insertRow = function(event){
			var index = parseInt(event.currentTarget.getAttribute('rowIndex'));
			var row = table.insertRow([], index);
			table.padRows();
		}
		return events;
	}
	$instance.view = function(){
		var table = this;
		return m('table', [
			m('tr', [
				m('th'),
				table.cols.map(function(col, index){
					return m('th', (index + 1));
				})
			]),
			table.rows.map(function(row, index){
				return m('tr', [
					m('th', {
						rowIndex: index,
						onclick: table.events.insertRow
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
		construct.apply(row, arguments);
		return row;
	}

	var construct = function(data){
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
					oninput: cell.events.update
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
		construct.apply(cell, arguments);
		return cell;
	}

	var construct = function(data){
		var cell = this;
		cell.events = defineEvents(cell);
		cell.data = m.stream(data || '')
	}

	var defineEvents = function($instance){
		var cell = $instance;
		var events = {};
		events.update = function(event){
			event.redraw = false;
			cell.data(event.currentTarget.value);
		}
		return events;
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
