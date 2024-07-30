import { Router } from 'express';
import {
  userLogin,
  userRegister,
  userLogout,
  getUser,
} from '../controller/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { handleDeleteUrl, handleGetUrls } from '../controller/urlController.js';

const router = Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.get('/user', verifyToken, getUser);
router.get('/urls', verifyToken, handleGetUrls);
router.delete('/delete/:shortId', verifyToken, handleDeleteUrl);
export default router;
