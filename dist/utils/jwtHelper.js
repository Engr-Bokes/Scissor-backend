import jwt from 'jsonwebtoken';
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
//# sourceMappingURL=jwtHelper.js.map