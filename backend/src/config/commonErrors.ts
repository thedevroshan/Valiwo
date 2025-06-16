import { Response } from "express";

export const INTERNAL_SERVER_ERROR = (res: Response, erorr: any, errorIn:string) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Error in ${errorIn}`, erorr);
    return;
  }
  res.status(500).json({
    ok: false,
    msg: "Internal Server Error. Please try again later.",
  });
};
