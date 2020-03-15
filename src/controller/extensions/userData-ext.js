import User from '../../model/user.js';

class UserDataExt {
  static findUserByEmail(email, callback) {
    User.findOne({ 'email': email }, (err, userData) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, userData);
    });
  }
}

export default UserDataExt;
