var config = require('../config')
var _from = __dirname + '/../static';
var _to = config.build.assetsRoot + '/static';
var copyList = [
	{
		from: _from + '/jquery-1.10.2.js',
    to: _to + '/jquery-1.10.2.js',
		toType: 'file'
	},
	{
		from: _from + '/cropper.min.js',
    to: _to + '/cropper.min.js',
		toType: 'file'
	},
	{
		from: _from + '/sitelogo.js',
    to: _to + '/sitelogo.js',
		toType: 'file'
	},
	{
		from: _from + '/bootstrap.min.js',
    to: _to + '/bootstrap.min.js',
		toType: 'file'
	}
]
module.exports = copyList;
