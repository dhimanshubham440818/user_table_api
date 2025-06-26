const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      userId: user._id,
      email: user.email,
      name:user.name,
      loginMethod: user.loginMethod,
      createdAt:user.createdAt,
      tableName: `user_${user._id}_data`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getUserProfile };