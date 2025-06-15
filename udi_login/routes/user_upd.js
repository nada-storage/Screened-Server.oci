'use strict';
const express = require('express');
const router = express.Router();
const my_reqinfo = require("../my_reqinfo");
const db = require("./db_dbs_user_maria");


//========================================================================
router.post('/', async(req, res) => 
//========================================================================
//  curl -X POST -H "Content-Type: application/json" -d "{\"userid\":\"user7000\", \"username\":\"내일로\"}" http://127.0.0.1:13890/user/upd
{
  const LOG_FAIL_HEADER = "[FAIL]";
  const LOG_SUCC_HEADER = "[SUCC]";
  const LOG_INFO_HEADER = "[INFO]";
  const EXT_data = my_reqinfo.get_req_url(req);
  
  const fail_status = 500;
  let ret_status = 200;
  let ret_data;

  const catch_body = -1;
  const catch_sqlconn = -2;
  const catch_procedure = -3;
  
  //----------------------------------------------------------------------
  // getBODY
  //----------------------------------------------------------------------
  let req_userid;
  let req_username;
  try {
    if (typeof req.body.userid === 'undefined') throw "userid undefined"
    if (typeof req.body.username === 'undefined') throw "username undefined"
    req_userid = req.body.userid;
    req_username = req.body.username;
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
  // getConnection 
  //----------------------------------------------------------------------
  let sqlconn;
  try {
    sqlconn = await db.pool.getConnection();
  } catch (e) {
    ret_status = fail_status + -1 * catch_sqlconn;
    ret_data = {
      code: "getConnection("+process.env.DB_dbs_user_maria_host+":"+process.env.DB_dbs_user_maria_port+")",
      value: catch_sqlconn,
      value_ext1: ret_status,
      value_ext2: e,
      EXT_data,
    };
    console.log(LOG_FAIL_HEADER + "%s\n", JSON.stringify(ret_data, null, 2));
  }

  if (ret_status != 200)
    return res.status(ret_status).json(ret_data);

  //----------------------------------------------------------------------
  // CALL pc_tuser_upd(@var_userid, @var_username, @res, @res2); 
  //----------------------------------------------------------------------
  let sqlo_res, sqlo_res2;
  try {
    ret_data = await sqlconn.query("CALL pc_tuser_upd(?,?,@res, @res2)", [req_userid, req_username]); 
    //console.log(LOG_HEADER+"CALL pc_tuser_upd("+req_userid+", "+req_username+")=>", ret_data);
    ret_data = await sqlconn.query("SELECT @res, @res2");
    //console.log(LOG_HEADER+"SELECT @res, @res2=>",ret_data);
    sqlo_res = ret_data[0]['@res'];
    sqlo_res2 = ret_data[0]['@res2'];
    //console.log(LOG_HEADER+"SQL res=>",sqlo_res);
    //console.log(LOG_HEADER+"SQL res2=>",sqlo_res2);
    if (sqlo_res < 1)
      throw sqlo_res2;
  } catch (e) {
    ret_status = fail_status + -1 * catch_procedure;
    ret_data = {
      code: "CALL pc_tuser_upd(userid:"+req_userid+", username:"+req_username+")",
      value: catch_procedure,
      value_ext1: ret_status,
      value_ext2: e,
      EXT_data,
    };
    console.log(LOG_FAIL_HEADER + "%s\n", JSON.stringify(ret_data, null, 2));
  }  

  if (ret_status != 200) {
    sqlconn.release();
    return res.status(ret_status).json(ret_data);
  }
  
  //----------------------------------------------------------------------
  // result
  //----------------------------------------------------------------------
  sqlconn.release();
  ret_data = {
    code: "result",
    value: sqlo_res,
    value_ext1: ret_status,
    value_ext2: {
    },
    EXT_data,
  };
  console.log(LOG_SUCC_HEADER + "%s\n", JSON.stringify(ret_data, null, 2));

  return res.status(ret_status).json(ret_data);
});

     
module.exports = router;
