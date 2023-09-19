const authorizeUser = (allowedRole) => {
  return (req, res, next) => {
    console.log(JSON.stringify(res.locals));
    console.log(allowedRole);
    const { attributes } = res.locals.user;

    if (!attributes) {
      return res.status(404)
      .json({ message: 'User attributes not found.' });
    }

    const { role } = attributes;

    if (!role || role === allowedRole) {
      return next();
    }

    return res.status(403)
    .json({ message: 'User is not authorized.' });
  };
};


module.exports = authorizeUser;
