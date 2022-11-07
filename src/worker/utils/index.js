function getPayload(event) {
  if (Object.prototype.toString.call(event) === '[object Uint8Array]') {
    return JSON.parse(event.toString() || '{}');
  }
  return event;
}

function getOTSTaskPayload(steps = []) {
  console.log('steps:: ', steps);
  return steps.map(({ run, name, process_time, stepCount, status }) => ({ run: name || run, process_time, stepCount, status }))
}

module.exports = {
  getPayload,
  getOTSTaskPayload,
}
