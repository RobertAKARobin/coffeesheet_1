'use strict';

document.addEventListener('DOMContentLoaded', function(){
	m.mount(document.getElementById('app'), {
		view: function(){
			return m('p', 'This is Mithril!');
		}
	});
});
