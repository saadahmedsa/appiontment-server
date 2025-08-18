import multer from "multer"

import jwt from 'jsonwebtoken';



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
 export const upload = multer({ storage: storage })


const tokenverify = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send({ message: "Token not provided" });
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Token is invalid or expired" });
        }

        req.user = decoded; 
        next();
    });
};

export default tokenverify;
