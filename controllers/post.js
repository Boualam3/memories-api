import mongoose from "mongoose"
import PostMessage from "../model/postMessage.js"

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find()

    res.status(200).json(postMessages)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const post = req.body
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  })
  try {
    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error })
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const { title, message, creator, selectedFile, tags } = req.body

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`)

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id }

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true })

  res.json(updatedPost)
}

export const deletePost = async (req, res) => {
  const { id } = req.params
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No Post with that id deleted-router")
    }
    await PostMessage.findByIdAndRemove(id)
    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.log(error)
  }
}

export const likePost = async (req, res) => {
  const { id } = req.params

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" })
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`)

  const post = await PostMessage.findById(id)

  const index = post.likes.findIndex((id) => id === String(req.userId))

  if (index === -1) {
    post.likes.push(req.userId)
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId))
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  })
  res.status(200).json(updatedPost)
}
