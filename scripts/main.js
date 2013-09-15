var TrackControll, TrackLog;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(function() {
  var canvasInput, htracker, videoInput;
  videoInput = document.getElementById('inputVideo');
  canvasInput = document.getElementById('inputCanvas');
  htracker = new headtrackr.Tracker();
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
      return this.log.register(e);
    }, this));
    $(document).on("zoomEvent", __bind(function(e, zoom) {
      return this.zoom(zoom);
    }, this));
  }
  TrackControll.prototype.zoom = function(diff) {
    var current_size, new_size;
    current_size = parseInt(this.article.css('font-size'));
    new_size = current_size + (diff / 10);
    new_size = Math.max(5, new_size);
    return this.article.css('font-size', "" + new_size + "px");
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
  TrackLog.prototype.register = function(event) {
    var zoomDelta;
    this.push(event);
    zoomDelta = this.last().originalEvent.width - event.originalEvent.width;
    if (zoomDelta !== 0) {
      return $(document).trigger("zoomEvent", zoomDelta);
    }
  };
  TrackLog.prototype.pure = function(event) {
    return {
      width: event.originalEvent.width,
      height: event.originalEvent.height,
      x: event.originalEvent.x,
      y: event.originalEvent.y
    };
  };
  TrackLog.prototype.push = function(event) {
    this.log.push(event);
    if (this.log.length > this.size) {
      this.log.shift();
    }
    if (this.logging_on) {
      return console.log(this.pure(event));
    }
  };
  TrackLog.prototype.last = function() {
    return this.log[0];
  };
  return TrackLog;
})();