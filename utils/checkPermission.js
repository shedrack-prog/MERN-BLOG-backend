const checkPermission = (requestUser, resourceUserId, res) => {
  // if (requestUser.role === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return;

  return res
    .status(403)
    .json({ message: 'Unauthorized to perform this action' });
};

module.exports = checkPermission;
