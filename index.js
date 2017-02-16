'use strict';

var express = require('express');
var app = express();

app.set('PORT', '3000');

app.use('/vendor', express.static('./node_modules'));
app.use('/', express.static('./public'));

app.listen(app.get('PORT'), function(){
	console.log('Running on ' + app.get('PORT'));
});
