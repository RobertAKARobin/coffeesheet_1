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
		table.events = defineEvents(table);
		table.maxRowLength = 0;
	}
	$instance.load = function(data){
		var table = this;
		var i, l = data.length;
		for(i = 0; i < l; i += 1){
			table.insertRow(data[i]);
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
	$instance.insertRow = function(data, index){
		var table = this;
		var row = Row.create(data);
		if(isNaN(index)){
			table.rows.push(row);
		}else{
			table.rows.splice((index + 1), 0, row);
		}
		table.maxRowLength = Math.max(row.cells.length, table.maxRowLength);
		row.pad(table.maxRowLength);
	}

	var defineEvents = function($instance){
		var table = $instance;
		var events = {};
		events.insertRow = function(event){
			var index = parseInt(event.currentTarget.getAttribute('rowIndex'));
			var row = table.insertRow([], index);
		}
		return events;
	}
	$instance.view = function(){
		var table = this;
		return m('table', [
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
