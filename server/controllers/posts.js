import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: {},
    });
    await newPost.save();

    const post = await Post.find();

    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();

    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ mssage: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });

    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ mssage: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    // grabbing id from params, comes from query string
    const { id } = req.params;
    // grabbing userId from body, comes from user body of teh request
    const { userId } = req.body;

    // grabbing post info
    const post = await Post.findById(id);
    // grabbing if user liked
    const isLiked = post.likes.get(userId);

    // setting likes based on liked or not
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    // updating the new liked post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
