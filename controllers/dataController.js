import generateModel from '../utils/generateModel.js';

const getUserData = async (req, res) => {
  try {
    const UserData = generateModel(req.user._id);
    const data = await UserData.find({});
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const addUserData = async (req, res) => {
  const { title, description } = req.body;

  try {
    const UserData = generateModel(req.user._id);
    const newData = await UserData.create({
      title,
      description,
    });

    res.status(201).json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteUserData = async (req, res) => {
  try {
    const UserData = generateModel(req.user._id);
    const data = await UserData.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    await data.deleteOne();
    res.json({ message: 'Data removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getUserData, addUserData, deleteUserData };