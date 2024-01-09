// EventLikeManager.js
const AbstractManager = require("./AbstractManager");

class EventLikeManager extends AbstractManager {
  constructor() {
    super({ table: "event_likes" });
  }

  like(eventId, userId) {
    return this.database.query(
      `INSERT INTO ${this.table} (Event_ID, User_ID) VALUES (?, ?)`,
      [eventId, userId]
    );
  }

  unlike(eventId, userId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE Event_ID = ? AND User_ID = ?`,
      [eventId, userId]
    );
  }
}

module.exports = EventLikeManager;
