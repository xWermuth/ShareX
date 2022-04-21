///util
const readNotifications = require("../util/notification").markOneAsRead;
const readAllNotifications = require("../util/notification").markAllAsRead;
const getNotifications = require("../util/notification").getNotifications;

module.exports = {
  async markRead(req, res) {
    const { notificationIds } = req.body;
    const userHandle = req.user.handle;

    try {
      const response = await readNotifications(notificationIds, userHandle);

      res.status(200).send(response);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  async markAllAsRead(req, res) {
    const userHandle = req.user.handle;

    try {
      const response = await readAllNotifications(userHandle);

      res.status(200).send(response);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  async getNotifications(req, res) {
    const user = req.user;
    const { offset = 0 } = req.query;

    try {
      const notifications = await getNotifications(user, offset);

      res.status(200).send(notifications);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
};
