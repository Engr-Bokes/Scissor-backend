import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
const router = Router();
// Route to register a new user
router.post('/register', register);
// Route to log in a user
router.post('/login', login);
export default router;
//# sourceMappingURL=authRoutes.js.map