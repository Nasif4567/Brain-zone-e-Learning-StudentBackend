const jwt = require('jsonwebtoken');

function JWTGenerate(UserID){
  try {
    return jwt.sign({
      UserID: UserID
    }, 'shhhhh');

  } catch (error) {
    console.error(error)
  }

}

function JWTVerify(token){
  try {
    if(token){
    return jwt.verify(token, 'shhhhh');
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = {JWTGenerate, JWTVerify}