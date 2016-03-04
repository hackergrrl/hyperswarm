var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var defined = require('defined')
var through = require('through2')
var pump = require('pump')

module.exports = function (log, opts) {
  opts = defined(opts,  {})
  if (!opts.hubs) { throw new Error('must specify at least one signalhub') }
  if (!opts.topic) { throw new Error('must specify a unique topic string') }

  var hub = signalhub('swarmlog.' + opts.topic, opts.hubs)
  var sw = swarm(hub, opts)
  var peerStream = opts.peerStream || function (peer) { return peer }

  sw.on('peer', function (peer, id) {
    var stream = peerStream(peer)
    pump(stream, toBuffer(), log.replicate({ live: true }), stream)
  })
  log.swarm = sw
  log.hub = hub
  return log
}

function toBuffer () {
  return through.obj(function (buf, enc, next) {
    next(null, Buffer.isBuffer(buf) ? buf : Buffer(buf))
  })
}
