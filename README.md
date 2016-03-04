# hyperswarm

Create a p2p webrtc swarm around a [hyperlog][4].

## background

This is a fork of [substack/swarmlog](https://github.com/substack/swarmlog) that
changes the API a bit. The key difference is that `hyperswarm` consumes a
hyperlog rather than producing it. This makes it easy to supply your own
non-standard hyperlog implementation conforming to its API, like
[noffle/ipfs-hyperlog](https://github.com/noffle/ipfs-hyperlog).

## example

Create a hyperlog publisher that will write a new message every second:

`publish.js`:

``` js
var hyperlog = require('hyperlog')
var hyperswarm = require('hyperswarm')
var memdb = require('memdb')

var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})

var swarm = hyperswarm(log, {
  topic: 'example',
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

var times = 0
setInterval(function () {
  log.append({ time: Date.now(), msg: 'HELLO!x' + times })
  times++
}, 1000)
```

and a follower that will consume the log:

```js
var hyperlog = require('hyperlog')
var hyperswarm = require('hyperswarm')
var memdb = require('memdb')

var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})

var swarm = hyperswarm(log, {
  topic: 'example',
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

log.createReadStream({ live: true })
  .on('data', function (data) {
    console.log('RECEIVED', data)
  })
```

## api

```
var hyperswarm = require('hyperswarm')
```

### var swarm = hyperswarm(log, opts)

Create a [hyperswarm][4] instance `swarm` from a hyperlog `log` and options:

* `opts.topic` - a string indicating some topic to use to look for common peers
* `opts.hubs` - array of [signalhub][1] hubs to use
* `opts.peerStream(peer)` - optional function that should return the stream to
use for a peer swarm connection. Use this if you want to multiplex some other
protocols on the same swarm alongside the hyperlog replication.

Optionally provide a [wrtc][3] instance as `opts.wrtc` to create a hyperswarm in
Node.

### swarm.hub

The underlying [signalhub][1] instance.

## p2p

Currently the swarm relies on [signalhub][1] to assist in the webrtc swarm
setup, but ideally in the future this could be replaced or augmented with a
[webrtc DHT][2].

## install

```
npm install hyperswarm
```

## license

BSD

Forked from [substack/swarmlog](https://github.com/substack/swarmlog), which is
also BSD licensed.

[1]: https://npmjs.com/package/signalhub
[2]: https://github.com/feross/webtorrent/issues/288
[3]: https://npmjs.com/package/wrtc
[4]: https://npmjs.com/package/hyperlog
[5]: https://npmjs.com/package/levelup
[6]: https://npmjs.com/package/level-browserify
[7]: https://npmjs.com/package/webrtc-swarm
