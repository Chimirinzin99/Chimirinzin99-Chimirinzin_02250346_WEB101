const prisma = require('../lib/prisma');

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit) || 10;

    const videos = await prisma.video.findMany({
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    const formattedVideos = videos.map(video => ({
      ...video,
      likeCount: video._count.likes,
      commentCount: video._count.comments,
      _count: undefined,
    }));

    res.status(200).json({ videos: formattedVideos });
  } catch (error) {
    console.error('Error getting videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await prisma.video.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.status(200).json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Failed to fetch video' });
  }
};

// Get videos by user
exports.getUserVideosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const videos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    const formattedVideos = videos.map(video => ({
      ...video,
      likeCount: video._count.likes,
      commentCount: video._count.comments,
      _count: undefined
    }));

    res.status(200).json({ videos: formattedVideos });
  } catch (error) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ message: 'Failed to fetch user videos' });
  }
};

// Get following videos
exports.getFollowingVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit) || 10;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });

    const followingIds = following.map(f => f.followingId);

    if (followingIds.length === 0) {
      return res.status(200).json({
        videos: [],
        pagination: { nextCursor: null, hasNextPage: false }
      });
    }

    const videos = await prisma.video.findMany({
      where: { userId: { in: followingIds } },
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    const formattedVideos = videos.map(video => ({
      ...video,
      likeCount: video._count.likes,
      commentCount: video._count.comments,
      _count: undefined,
    }));

    res.status(200).json({ videos: formattedVideos });
  } catch (error) {
    console.error('Error getting following videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create video
exports.createVideo = async (req, res) => {
  try {
    const { caption, url, thumbnailUrl } = req.body;
    const userId = req.user.id;

    let videoUrl = url;
    let thumbUrl = thumbnailUrl;

    if (req.files && req.files.video) {
      const videoFile = req.files.video[0];
      videoUrl = `http://localhost:5000/uploads/${videoFile.filename}`;
    }

    if (req.files && req.files.thumbnail) {
      const thumbnailFile = req.files.thumbnail[0];
      thumbUrl = `http://localhost:5000/uploads/${thumbnailFile.filename}`;
    }

    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL or file is required' });
    }

    const video = await prisma.video.create({
      data: {
        userId,
        caption,
        url: videoUrl,
        thumbnailUrl: thumbUrl
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

    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: 'Failed to create video' });
  }
};

// Update video
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    const userId = req.user.id;

    const video = await prisma.video.findUnique({ where: { id } });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: { caption },
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

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: 'Failed to update video' });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const video = await prisma.video.findUnique({ where: { id } });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.video.delete({ where: { id } });

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Failed to delete video' });
  }
};

// Like/unlike video
exports.toggleVideoLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: { userId, videoId: id }
      }
    });

    let action;
    if (existingLike) {
      await prisma.like.delete({
        where: { userId_videoId: { userId, videoId: id } }
      });
      action = 'unliked';
    } else {
      await prisma.like.create({
        data: { userId, videoId: id }
      });
      action = 'liked';
    }

    const likeCount = await prisma.like.count({ where: { videoId: id } });

    res.status(200).json({ message: `Video ${action}`, action, likeCount });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// Get video comments
exports.getVideoComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const comments = await prisma.comment.findMany({
      where: { videoId: id },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
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

    const totalComments = await prisma.comment.count({ where: { videoId: id } });

    res.status(200).json({
      comments,
      totalPages: Math.ceil(totalComments / take),
      currentPage: parseInt(page),
      totalComments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};