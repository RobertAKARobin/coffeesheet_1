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
		table.views = defineViews(table);
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
	$instance.insertColumn = function(data, index){
		var table = this;
		var r, numRows = table.rows.length;
		for(r = 0; r < numRows; r++){
			table.rows[r].insertCell(data[r], index);
		}
		table.maxRowLength += 1;
	}
	$instance.deleteColumn = function(index){
		var table = this;
		var r, row, numRows = table.rows.length;
		if(table.cols.length <= 1){
			return false;
		}
		for(r = 0; r < numRows; r++){
			row = table.rows[r];
			row.cells.splice(index, 1);
		}
		table.cols.splice(index, 1);
		table.maxRowLength = table.cols.length;
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
	$instance.deleteRow = function(index){
		var table = this;
		var c, numCols = table.cols.length;
		if(table.rows.length <= 1){
			return false;
		}
		for(c = 0; c < numCols; c++){
			table.cols[c].splice(index, 1);
		}
		table.rows.splice(index, 1);
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
		events.deleteRow = function(event){
			var index = parseInt(event.currentTarget.getAttribute('rowIndex'));
			event.redraw = table.deleteRow(index);
		}
		events.insertColumn = function(event){
			var index = parseInt(event.currentTarget.getAttribute('colIndex'));
			table.insertColumn([], index);
			table.mapColumns();
		}
		events.deleteColumn = function(event){
			var index = parseInt(event.currentTarget.getAttribute('colIndex'));
			event.redraw = table.deleteColumn(index);
		}
		return events;
	}
	var defineViews = function($instance){
		var table = $instance;
		var views = {};
		var headerLink = function(props, doWhat, text){
			props.href = '#';
			props.onclick = table.events[doWhat];
			return m('a', props, text);
		}
		views.colHeader = function(col, index){
			return m('div.cell.head', [
				(index + 1),
				headerLink({colIndex: index - 1}, 'insertColumn', 'Insert left'),
				headerLink({colIndex: index}, 'insertColumn', 'Insert right'),
				headerLink({colIndex: index}, 'deleteColumn', 'Delete column')
			]);
		}
		views.rowHeader = function(row, index){
			var doWhat = 'insertRow';
			return m('div.cell.head', [
				(index + 1),
				headerLink({rowIndex: index - 1}, doWhat, 'Insert above'),
				headerLink({rowIndex: index}, doWhat, 'Insert below'),
				headerLink({rowIndex: index}, 'deleteRow', 'Delete row')
			]);
		}
		views.bodyRow = function(row, index){
			return m('div.row', [
				table.views.rowHeader(row, index),
				row.view()
			]);
		}
		return views;
	}
	$instance.view = function(){
		var table = this;
		return m('div.table', [
			m('div.row', [
				m('div.cell.head'),
				table.cols.map(table.views.colHeader)
			]),
			table.rows.map(table.views.bodyRow)
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
			row.insertCell(data[i]);
		}
	}
	$instance.insertCell = function(data, index){
		var row = this;
		var cell = Cell.create(data, row);
		if(isNaN(index)){
			row.cells.push(cell);
		}else{
			row.cells.splice((index + 1), 0, cell);
		}
	}
	$instance.pad = function(length){
		var row = this;
		var i = row.cells.length;
		while(i < length){
			row.insertCell(null, i);
			i += 1;
		}
	}
	$instance.view = function(){
		var row = this;
		return row.cells.map(function(cell){
			return m('div.cell', [
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
