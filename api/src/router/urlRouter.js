import { Router } from 'express';
import {
  handleGenerateShortURL,
  handleGetAnalytics,
  handleGetUrls,
  handleRedirectToOriginalURL,
} from '../controller/urlController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = Router();

router.post('/shortUrl',verifyToken, handleGenerateShortURL);
router.get('/:shortId', handleRedirectToOriginalURL);
router.get('/analytics/:shortId', handleGetAnalytics);
export default router;
