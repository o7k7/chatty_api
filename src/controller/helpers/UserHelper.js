import User from '../../model/user.js';

class UserHelper {
  static findUserByEmail(email, callback) {
    User.findOne({ email }, (err, userData) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, userData);
    });
  }
}

export default UserHelper;
