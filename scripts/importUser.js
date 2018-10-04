require('dotenv').config();
var fs = require("fs");

const { query } = require('../db');

async function importUser(data) {
  const q = `
    INSERT INTO
      users (username, password, name)
    VALUES
      ($1, $2, $3)
    RETURNING *`;

  // const values = ['admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', 'Admin' ];
  const values = ['admin', '$2b$11$MdOQBMHIVNlVThrLqx1bWO1.QDTFBosA2MmXZgdXuo.qNXvc6D.Da', 'Admin' ];

  const result = await query(q, values);

  return result.rows[0];

}
importUser().catch((err) => {
  console.error('Error importing', err);
});
