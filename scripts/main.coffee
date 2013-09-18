$ ->
  videoInput = document.getElementById('inputVideo')
  canvasInput = document.getElementById('inputCanvas')
  debugCanvas = document.getElementById('debugCanvas')
  htracker = new headtrackr.Tracker(ui: false, calcAngles: true, debug: debugCanvas)

  htracker.init(videoInput, canvasInput)
  new TrackControll(htracker)

class TrackControll
  constructor: (@tracker) ->
    @tracker.start()
    @log = new TrackLog()
    @article = $("article")
    $(document).on "facetrackingEvent", (e) =>
      @log.register(e)
      @moved()


  zoom: (diff) ->
    current_size = parseInt(@article.css('font-size'))
    new_size = current_size + (diff / 10)
    new_size = Math.max(5, new_size)
    @article.css('font-size', "#{new_size}px");

  moved: ->
    newest = @log.newest()
    oldest = @log.oldest()
    zoomDelta = oldest.width - newest.width
    @zoom(zoomDelta)

    @article.css('transform', "rotate(#{-newest.angle + Math.PI/2}rad)");



class TrackLog
  constructor: ->
    @log = []
    @size = 4
    @logging_on = false
    $(document).on "click", =>
      @logging_on = !@logging_on

  pure: (event) ->
    width: event.originalEvent.width
    height: event.originalEvent.height
    x: event.originalEvent.x
    y: event.originalEvent.y
    angle: event.originalEvent.angle

  register: (event) ->
    event = @pure(event)
    @log.push(event)
    if @log.length > @size
      @log.shift()
    if @logging_on
      console.log event.angle

  oldest: ->
    @log[0]

  newest: ->
    @log[@log.length - 1]

