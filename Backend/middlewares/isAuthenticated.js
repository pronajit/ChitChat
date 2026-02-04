const jwt = require('jsonwebtoken');

const isAuthenticated = async(req, res , next) =>{
    try {
        // console.log("Cookies received:", req.cookies);
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token received:", token);
        if(!token){
           return res.status(401).json({
                message:"User not authenticated",
                success:false
            })
        }

        const decode = await jwt.verify(token , process.env.JWT_SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"invalid token",
                success:false
            })
        }

        req.id = decode.id;

        next();
    } catch (error) {
         console.log(error);
        return res.status(500).json({
            message: "Authentication failed",
            success: false
        });
    }
}

module.exports = isAuthenticated;