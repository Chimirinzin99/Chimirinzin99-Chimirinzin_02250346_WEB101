const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/following', protect, videoController.getFollowingVideos);
router.get('/', videoController.getAllVideos);
router.get('/:id/comments', videoController.getVideoComments);
router.get('/user/:userId', videoController.getUserVideosByUserId);
router.get('/:id', videoController.getVideoById);


// ✅ NEW ROUTE: For JSON submission (files already in Supabase)
router.post('/metadata', protect, videoController.createVideoMetadata);

// Protected routes - for file upload (multipart/form-data)
router.post('/', protect, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), videoController.createVideo);

router.put('/:id', protect, videoController.updateVideo);
router.delete('/:id', protect, videoController.deleteVideo);

// Like/unlike video
router.post('/:id/like', protect, videoController.toggleVideoLike);
router.delete('/:id/like', protect, videoController.toggleVideoLike);

module.exports = router;