var hyperswarm = require('../')
var memdb = require('memdb')
var test = require('tape')
var signalhub = require('signalhub/server')
var hyperlog = require('hyperlog')
// var wrtc = require('wrtc')

test('log', function (t) {
  t.plan(3)
  var hub = signalhub()
  hub.listen(0, function () {
    var href = 'http://localhost:' + hub.address().port
    var pubLog = hyperlog(memdb(), {
      valueEncoding: 'json'
    })
    var subLog = hyperlog(memdb(), {
      valueEncoding: 'json'
    })
    var publisher = hyperswarm(pubLog, {
      // wrtc: wrtc,
      topic: 'tape/test',
      hubs: [ href ]
    })
    var follower = hyperswarm(subLog, {
      // wrtc: wrtc,
      topic: 'tape/test',
      hubs: [ href ]
    })
    publisher.append({ x: 'HELLO-0' })
    publisher.append({ x: 'HELLO-1' })
    publisher.append({ x: 'HELLO-2' })

    var expected = [
      { x: 'HELLO-0' },
      { x: 'HELLO-1' },
      { x: 'HELLO-2' }
    ]
    follower.createReadStream({ live: true })
      .on('data', function (data) {
        t.deepEqual(data.value, expected.shift())
      })

    t.once('end', function () {
      hub.close()
    })
  })
})

test(function (t) {
  t.end()
  process.exit(0)
})
