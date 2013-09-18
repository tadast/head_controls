var TrackControll, TrackLog;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(function() {
  var canvasInput, debugCanvas, htracker, videoInput;
  videoInput = document.getElementById('inputVideo');
  canvasInput = document.getElementById('inputCanvas');
  debugCanvas = document.getElementById('debugCanvas');
  htracker = new headtrackr.Tracker({
    ui: false,
    calcAngles: true,
    debug: debugCanvas
  });
  htracker.init(videoInput, canvasInput);
  return new TrackControll(htracker);
});
TrackControll = (function() {
  function TrackControll(tracker) {
    this.tracker = tracker;
    this.tracker.start();
    this.log = new TrackLog();
    this.article = $("article");
    $(document).on("facetrackingEvent", __bind(function(e) {
      this.log.register(e);
      return this.moved();
    }, this));
  }
  TrackControll.prototype.zoom = function(diff) {
    var current_size, new_size;
    current_size = parseInt(this.article.css('font-size'));
    new_size = current_size + (diff / 10);
    new_size = Math.max(5, new_size);
    return this.article.css('font-size', "" + new_size + "px");
  };
  TrackControll.prototype.moved = function() {
    var newest, oldest, zoomDelta;
    newest = this.log.newest();
    oldest = this.log.oldest();
    zoomDelta = oldest.width - newest.width;
    this.zoom(zoomDelta);
    return this.article.css('transform', "rotate(" + (-newest.angle + Math.PI / 2) + "rad)");
  };
  return TrackControll;
})();
TrackLog = (function() {
  function TrackLog() {
    this.log = [];
    this.size = 4;
    this.logging_on = false;
    $(document).on("click", __bind(function() {
      return this.logging_on = !this.logging_on;
    }, this));
  }
  TrackLog.prototype.pure = function(event) {
    return {
      width: event.originalEvent.width,
      height: event.originalEvent.height,
      x: event.originalEvent.x,
      y: event.originalEvent.y,
      angle: event.originalEvent.angle
    };
  };
  TrackLog.prototype.register = function(event) {
    event = this.pure(event);
    this.log.push(event);
    if (this.log.length > this.size) {
      this.log.shift();
    }
    if (this.logging_on) {
      return console.log(event.angle);
    }
  };
  TrackLog.prototype.oldest = function() {
    return this.log[0];
  };
  TrackLog.prototype.newest = function() {
    return this.log[this.log.length - 1];
  };
  return TrackLog;
})();