"use strict";

//========================================================================
exports.get_req_url =  (req) => {
//========================================================================

  let ret;
  try {
    ret = {
      src_ip: req.socket.remoteAddress.replace(/^.*:/, ''),
      src_port: req.socket.remotePort,
      req_url: req.originalUrl,
      req_method: req.method,
      req_body: req.body,
    };
 }
  catch (e) {
    console.log(e);
    ret = "";
  }

  return ret;
}
