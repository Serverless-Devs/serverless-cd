function ValidationError(resp, message = '') {
  console.error(message);
  resp.statusCode = 424;
  resp.send(
    JSON.stringify({
      success: false,
      message,
    }),
  );
}

function SystemError(resp, ex = '') {
  console.error(ex);
  resp.statusCode = 500;
  resp.send(ex.toString());
}

module.exports = {
  ValidationError,
  SystemError,
};