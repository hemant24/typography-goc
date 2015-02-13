/////////////////////////////////////////
// Spaghetti
// Simple wrapper around gst-launch for node
// Written by Tomás Pollak
// (c) 2011 Fork Ltd.
// MIT Licensed.
/////////////////////////////////////////

var fs = require('fs'),
		// net = require('net'),
		spawn = require('child_process').spawn;

var debug = process.env.DEBUG || false;

var mixin = function(target, source) {
	Object.keys(source).forEach(function(key) {
		target[key] = source[key];
	});
	return target;
}

var GStreamer = {

	launcher: 'gst-launch',
	// launcher: 'C:\\test\\gstreamer\\gst-launch.exe', <-- yes I did set up GST on Windows and survived
	streamTimeout: 500,

	videoSources: {
		webcam: {
			linux: 'v4l2src',
			darwin: 'qtkitvideosrc', // 'osxvideosrc',
			win32: 'dshowvideosrc'
		},
		desktop: {
			linux: 'ximagesrc',
			darwin: 'ximagesrc',
			win32: 'dx9screencapsrc'
		}
	},

	defaultEncoderOptions: {
		vp8enc: ['speed=2'],
		ffenc_flv: ['bitrate=128']
	},

	muxers: {
		vp8enc: 'webmmux',
		ffenc_flv: 'flvmux',
		x264enc: 'avimux',
		xvidenc: 'avimux'
	},

//	getEncoderOptions(opts_hash){
//		return this.defaultEncoderOptions[encoder] || []).concat(options.encoder_opts);
//	},

	resolveVideoSource: function(source){
		if(source == 'desktop' || source == 'webcam')
			return this.videoSources[source][process.platform];
		else {
			try {
				fs.statSync(source);
				return 'filesrc location="' + source + '"';
			} catch(e) { // not a file
				return source;
			}
		}
	},

	isFilename: function(str){
		return (typeof str == 'string') ? str.match(/(.+)\.([a-z0-9]{2,4})/) : false;
	},

	parseDestination: function(dest){

		// url:port regex
		var matches = dest.match(/([a-z0-9\.]+):([0-9]+)/);
		if(matches){
			// this.streamDestination = [matches[2], matches[1]];
			return ['tcpclientsink', 'host=' + matches[1], 'port=' + matches[2]];
		} else {
			var matches = this.isFilename(dest);
			if(matches) {
				// this.streamDestination = dest;
				return ['filesink', 'location=' + dest];
			} else {
				return dest.split(' '); // so you can also pass "fdsink fd=1"
			}
		}

	},

//	getStreamObject: function(){

//		if (typeof this.streamDestination == 'string')
//			return fs.createReadStream(this.streamDestination);
//		else if(this.streamDestination)
//			return net.createServer(this.streamDestination[0], this.streamDestination[1]);
//		else
//			return true;

//	},

	spawnChild: function(args){

		if(debug) console.log(args.join(' '));

		var child = spawn(this.launcher, args, {env: {PATH: process.env.PATH + ":/usr/local/bin"}});

		child.stdout.on('data', function(d){
			if(debug) console.log(d.toString());
		});

		child.stderr.on('data', function(d){
			if(debug) console.log(d.toString());
		});

		return child;

	},

	launchCommand: function(args, callback, object){

		var child = this.spawnChild(args);

		child.on('exit', function(code){
			// console.log(code)
			if(code == 0) { // all good
				if(callback) callback(object || true);
			} else {
				// if(object) fs.unlink(object);
				if(callback) callback(false);
			}
		});

		return child;

	},

	launchStream: function(args, callback){

		var child = this.spawnChild(args);

		setTimeout(function(){
			try {
				process.kill(child.pid, 0); // running
				if(callback) callback(null);
			} catch(e) {
				if(callback) callback(false);
			}
		}, this.streamTimeout);

		return child;

	},

	playSound: function(file, options, callback){

		var cb = (typeof options == 'function') ? options : callback ? callback : false;
		var dest = options.dest || 'autoaudiosink';

		var args = [
			'filesrc', 'location=' + file,
			'!', 'decodebin',
			'!', 'audioconvert',
			'!', 'audioresample',
			'!', dest
		];

		return this.launchCommand(args, cb, file);

	},

	captureFrame: function(source, file, options, callback){

		var src  = this.resolveVideoSource(source); // autovideosrc
		var cb = (typeof options == 'function') ? options : callback ? callback : false;

		var enc  = file.search(/\.jpe?g$/) == -1 ? 'pngenc' : 'jpegenc';
		if(process.platform == 'darwin') enc = enc == 'pngenc' ? 'ffenc_png' : 'ffenc_mjpeg';
		var framerate = options.framerate || '15/1';

		if(options.width && options.height)
			var format = ',width=' + options.width + ',height=' + options.height;
		else
			var format = ',width=640,height=480';

		format = ''; // so that it works

		var args = [
			src, 'num-buffers=1',
			'!', 'ffmpegcolorspace',
			'!', 'video/x-raw-yuv' + format, // + ',framerate=' + framerate,
			'!', enc,
			'!', 'filesink', 'location=' + file
		];

		return this.launchCommand(args, cb, file);

	},

	streamAudio: function(options, callback){

		var src  = options.src  || 'autoaudiosrc';
		var dest = options.desc || 'autoaudiosink';

		var args = [
			src,
			'!', 'audioconvert',
			'!', 'audioresample',
			'!', dest
		];

		return this.launchStream(args, callback);

	},

	streamVideo: function(source, options, callback){

		var src  = this.resolveVideoSource(source); // 'autovideosrc';
		var dest = options.dest ? this.parseDestination(options.dest) : ['autovideosink'];

		var framerate = options.framerate || '15/1';

		if(options.width && options.height)
			var format = ',width=' + options.width + ',height=' + options.height;
		else
			var format = ',width=640,height=480';

		// TODO: make this work. we probably need to detect supported formats
		format = '';

		if(options.encoder){
			var encoder = options.encoder; // || 'vp8enc'; // other options: xvidenc, x264enc, ffenc_flv
			var muxer_args = ['!', 'm.', this.muxers[encoder], 'name=m'];
			if(encoder == 'vp8enc' || encoder == 'ffenc_flv') muxer_args.splice(4,0, 'streamable=true');
			var encoder_opts = ['!', encoder].concat(this.defaultEncoderOptions[encoder] || []).concat(options.encoder_opts || []);
		}

		var src_opts = (options.buffers ? ['num-buffers=' + options.buffers] : []).concat(options.src_opts || []);

		var args = [src].concat(src_opts).concat([
			'!', 'video/x-raw-yuv' + format + ',framerate=' + framerate,
//			'!', 'videorate',
			'!', 'ffmpegcolorspace'
//			'max-latency=2', 'max-keyframe-distance=30',
		])

		if(options.filters){
			options.filters.forEach(function(filter){
				args = args.concat(['!']).concat(filter.split(' '));
			});
		}

		if(encoder_opts) args = args.concat(encoder_opts);

		if(options.audio) {
			var audio_encoder = options.audio_encoder || 'vorbisenc';
			args = args.concat(['!', 'queue2',
			'!', 'm.', 'autoaudiosrc',
			'!', 'audioconvert',
			'!', audio_encoder,
			'!', 'queue2'
			]);
		}

		args = args.concat(muxer_args || []).concat(['!'].concat(dest));

		return this.launchStream(args, callback);

	},

	streamVideoWithAudio: function(source, options, callback){
		return this.streamVideo(source, mixin(options, {audio: true}), callback);
	}

};

module.exports = GStreamer;
