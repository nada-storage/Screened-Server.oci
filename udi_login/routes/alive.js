'use strict';
const express = require('express');
const router = express.Router();
const my_reqinfo = require("../my_reqinfo");

/*const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}*/

//========================================================================
//  curl http://127.0.0.1:13890/alive  -H "Content-Type: application/json" -X POST | jq
//  curl http://127.0.0.1:13890/alive  -H "Content-Type: application/json" -X POST -d '{"passwd":}' | jq
//  curl http://127.0.0.1:13890/alive  -H "Content-Type: application/json" -X POST -d '{"pass":-1}' | jq
router.post("/", async(req, res) => 
//========================================================================
//  curl http://127.0.0.1:13890/alive  -H "Content-Type: application/json" -X POST -d '{"passwd":"ten1389"}' | jq
{
    const LOG_FAIL_HEADER = "[FAIL]";
    const LOG_SUCC_HEADER = "[SUCC]";
    const LOG_INFO_HEADER = "[INFO]";
    const EXT_data = my_reqinfo.get_req_url(req);
    
    const fail_status = 500;
    let ret_status = 200;
    let ret_data;
  
    const catch_body = -1;

  //----------------------------------------------------------------------
  // getBODY
  //----------------------------------------------------------------------
  let req_passwd;
 
  try {
    if (typeof req.body.passwd === 'undefined') throw "arguments undefined"
    req_passwd = req.body.passwd;
    if (req_passwd !== "ten1389") throw "..... undefined"
  } catch (e) {
    ret_status = fail_status + -1 * catch_body;
    ret_data = {
      code: "getBODY()",
      value: catch_body,
      value_ext1: ret_status,
      value_ext2: e,
      EXT_data,
    };
    console.log(LOG_FAIL_HEADER + "%s\n", JSON.stringify(ret_data, null, 2));
  }
  if (ret_status != 200)
    return res.status(ret_status).json(ret_data);
//----------------------------------------------------------------------
// result
//----------------------------------------------------------------------

  ret_data = {
    code: "result",
    value: 0,
    value_ext1: ret_status,
    value_ext2: {
      sysnum:  process.env.SYS_NUM,
    },
    EXT_data,
  };
  console.log(LOG_SUCC_HEADER + "%s\n", JSON.stringify(ret_data, null, 2));

  return res.status(ret_status).json(ret_data);
});

module.exports = router;