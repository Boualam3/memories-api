import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization

    if (token) token = token.split(" ")[1]
    const isCustomAuth = token.length < 500
    let decodedData
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "secret_jsonwebtoken")

      req.userId = decodedData?.id
    } else {
      //* We work here with google auth
      decodedData = jwt.decode(token)
      req.userId = decodedData?.sub
    }
    next()
  } catch (error) {
    console.log(error)
  }
}

export default auth
