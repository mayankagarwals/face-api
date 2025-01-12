// @ts-nocheck

const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const log = require('@vladmandic/pilogger'); // this is my simple logger with few extra features
const child_process = require('child_process');
// note that main process import faceapi or tfjs at all

const imgPathRoot = './demo'; // modify to include your sample images
const numWorkers = 2; // how many workers will be started
const workers = []; // this holds worker processes
const images = []; // this holds queue of enumerated images
const t = []; // timers
let dir;

// trigered by main when worker sends ready message
// if image pool is empty, signal worker to exit otherwise dispatch image to worker and remove image from queue
async function detect(worker) {
  if (!t[2]) t[2] = process.hrtime.bigint(); // first time do a timestamp so we can measure initial latency
  if (images.length === dir.length) worker.send({ test: true }); // for first image in queue just measure latency
  if (images.length === 0) worker.send({ exit: true }); // nothing left in queue
  else {
    log.state('Main: dispatching to worker:', worker.pid);
    worker.send({ image: images[0] });
    images.shift();
  }
}

// loop that waits for all workers to complete
function waitCompletion() {
  const activeWorkers = workers.reduce((any, worker) => (any += worker.connected ? 1 : 0), 0);
  if (activeWorkers > 0) setImmediate(() => waitCompletion());
  else {
    t[1] = process.hrtime.bigint();
    log.info('Processed', dir.length, 'images in', Math.trunc(parseInt(t[1] - t[0]) / 1000 / 1000), 'ms');
  }
}

function measureLatency() {
  t[3] = process.hrtime.bigint();
  const latencyInitialization = Math.trunc(parseInt(t[2] - t[0]) / 1000 / 1000);
  const latencyRoundTrip = Math.trunc(parseInt(t[3] - t[2]) / 1000 / 1000);
  log.info('Latency: worker initializtion: ', latencyInitialization, 'message round trip:', latencyRoundTrip);
}

async function main() {
  log.header();
  log.info('FaceAPI multi-process test');

  // enumerate all images into queue
  dir = fs.readdirSync(imgPathRoot);
  for (const imgFile of dir) {
    if (imgFile.toLocaleLowerCase().endsWith('.jpg')) images.push(path.join(imgPathRoot, imgFile));
  }

  t[0] = process.hrtime.bigint();
  // manage worker processes
  for (let i = 0; i < numWorkers; i++) {
    // create worker process
    workers[i] = await child_process.fork('demo/node-multiprocess-worker.js', ['special']);
    // parse message that worker process sends back to main
    // if message is ready, dispatch next image in queue
    // if message is processing result, just print how many faces were detected
    // otherwise it's an unknown message
    workers[i].on('message', (msg) => {
      if (msg.ready) detect(workers[i]);
      else if (msg.image) log.data('Main: worker finished:', workers[i].pid, 'detected faces:', msg.detected.length);
      else if (msg.test) measureLatency();
      else log.data('Main: worker message:', workers[i].pid, msg);
    });
    // just log when worker exits
    workers[i].on('exit', (msg) => log.state('Main: worker exit:', workers[i].pid, msg));
    // just log which worker was started
    log.state('Main: started worker:', workers[i].pid);
  }

  // wait for all workers to complete
  waitCompletion();
}

main();
