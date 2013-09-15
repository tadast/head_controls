$ ->
  videoInput = document.getElementById('inputVideo')
  canvasInput = document.getElementById('inputCanvas')
  htracker = new headtrackr.Tracker()

  htracker.init(videoInput, canvasInput)
  new TrackControll(htracker)

class TrackControll
  constructor: (@tracker) ->
    @tracker.start()
    @log = new TrackLog()
    @article = $("article")
    $(document).on "facetrackingEvent", (e) =>
      @log.register(e)

    $(document).on "zoomEvent", (e, zoom) =>
      @zoom(zoom)


  zoom: (diff) ->
    current_size = parseInt(@article.css('font-size'))
    new_size = current_size + (diff / 10)
    new_size = Math.max(5, new_size)
    @article.css('font-size', "#{new_size}px");


class TrackLog
  constructor: ->
    @log = []
    @size = 4
    @logging_on = false
    $(document).on "click", =>
      @logging_on = !@logging_on

  register: (event) ->
    @push(event)
    zoomDelta = @last().originalEvent.width - event.originalEvent.width
    if zoomDelta != 0
      $(document).trigger "zoomEvent", zoomDelta

  pure: (event) ->
    width: event.originalEvent.width
    height: event.originalEvent.height
    x: event.originalEvent.x
    y: event.originalEvent.y

  push: (event) ->
    @log.push(event)
    if @log.length > @size
      @log.shift()
    if @logging_on
      console.log(@pure(event))

  last: ->
    @log[0]

