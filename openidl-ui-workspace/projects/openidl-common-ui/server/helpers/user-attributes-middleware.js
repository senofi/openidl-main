module.exports = (req, res) => {
  const userAttributes = res.locals.user.attributes;

  if (userAttributes) {
    return res.json(userAttributes);
  }

  res.status(404)
  .json({ message: 'User attributes not found' });
};
