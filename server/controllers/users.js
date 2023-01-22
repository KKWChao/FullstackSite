import User from "../models/User";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { eid, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // chjeck user frineds that includes the specified id
    if (user.friends.includes(friendId)) {
      // first checking if user contains the friend id, then removes it
      user.friends = user.friends.filter((id) => id !== friendId);

      // removes the friend from the friends item
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // if not in friends list, then add to user friends
      user.friends.push(id);
    }

    await user.save();
    await friend.save();

    // formatting
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
