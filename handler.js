const headers = require('./headers');


const successHandler = (res, data) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    status: 'success',
    data
  }))
  res.end();
};

const errorHandler = (res, data) => {
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    status: 'false',
    data
  }))
  res.end();
};

module.exports = {
  successHandler,
  errorHandler
};