import express from 'express';
import { refreshToken,   register ,login} from '../controllers/auth.js';

const router = express.Router();

router.post('/refresh-token', refreshToken);
router.post('/register', register);
router.post('/login', login);

export default router;
