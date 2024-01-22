const AbstractManager = require("../AbstractManager/AbstractManager");

class IndividualchatManager extends AbstractManager {
  constructor() {
    super({ table: "individualchat" });
  }

  findByIndividualchatId(individualchatID) {
    return this.database.query(
      `SELECT * FROM ${this.table} WHERE Chat_ID = ?`,
      [individualchatID]
    );
  }

  findAllByUserId(userId) {
    return this.database.query(
      `SELECT * FROM ${this.table} WHERE User_ID1 = ? OR User_ID2 = ?`,
      [userId, userId]
    );
  }

  // Dans IndividualchatManager.js
  insert(individualchat) {
    if (
      !individualchat.Content ||
      !individualchat.User_ID1 ||
      !individualchat.User_ID2
    ) {
      throw new Error("Missing required fields");
    }

    return this.database.query(
      `
    INSERT INTO ${this.table} (Content, User_ID1, User_ID2)
    VALUES (?, ?, ?);
    `,
      [individualchat.Content, individualchat.User_ID1, individualchat.User_ID2]
    );
  }

  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE Chat_ID = ?`, [
      id,
    ]);
  }

  update(individualchat) {
    return this.database.query(
      `UPDATE ${this.table}
       SET Content = ?, Created_At = ?, Updated_At = ?, User_ID1 = ?, User_ID2 = ? 
       WHERE Chat_ID = ?`,
      [
        individualchat.Content,
        individualchat.Created_At,
        individualchat.Updated_At,
        individualchat.User_ID1,
        individualchat.User_ID2,
        individualchat.Chat_ID,
      ]
    );
  }
}

module.exports = IndividualchatManager;
