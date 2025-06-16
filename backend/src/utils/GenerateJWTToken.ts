import jwt from "jsonwebtoken";

export const GenerateJWTToken = async (userId: string):Promise<string|null> => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "28d",
        algorithm: "HS512",
      }
    )
    return token;
  } catch (error) {
    if ((process.env.NODE_ENV as string) !== "production") {
      console.log("Error From GenerateJWTToken: ", error);
      return null;
    }
    return null;
  }
};
