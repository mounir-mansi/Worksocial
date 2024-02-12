const AbstractManager = require("../AbstractManager/AbstractManager");

class ResetPasswordKeyManager extends AbstractManager {
  constructor() {
    super({ table: "reset_password_keys" });
  }

  getResetPasswordKey(uniqueKey) {
    return this.database.query(
      `SELECT * FROM ${this.table} WHERE unique_key = ?`,
      [uniqueKey]
    );
  }

  addKey(uniqueKey, Email) {
    return this.database.query(
      `INSERT INTO ${this.table} (unique_key, Email) VALUES (?, ?)`,
      [uniqueKey, Email]
    );
  }
}

module.exports = ResetPasswordKeyManager;
