const prisma = require('../lib/prisma');

// Get all comments for a video
exports.getAllComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20 } = req.query;
    const limitNum = parseInt(limit) || 20;

    // Check if video exists
    const videoExists = await prisma.video.findUnique({
      where: { id }
    });

    if (!videoExists) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comments = await prisma.comment.findMany({
      where: { videoId: id },
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        }
      }
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        },
        video: {
          select: {
            id: true,
            caption: true,
            thumbnailUrl: true
          }
        }
      }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ message: 'Failed to fetch comment' });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;
    const userId = req.user.id;

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        videoId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { text },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        }
      }
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        video: { select: { userId: true } }
      }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== userId && comment.video.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.comment.delete({ where: { id } });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

module.exports = {
  getAllComments: exports.getAllComments,
  getCommentById: exports.getCommentById,
  createComment: exports.createComment,
  updateComment: exports.updateComment,
  deleteComment: exports.deleteComment
};