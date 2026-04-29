import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) return res.status(401).json({message: "Unauthorzed access"})

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;

    next()
  } catch (err){
    return res.status(403).json({ message: "Invalid login, Please login again!" })
  }
}

export default verifyJWT;