// import express, { NextFunction } from "express";
// import { rateLimit } from "express-rate-limit";
// export const errorHandler = (
//   err: any,
//   req: express.Request,
//   res: express.Response,
//   next: NextFunction
// ) => {
//   if (err instanceof rateLimit.RateLimitExceeded) {
//     return res.status(429).json({
//       error: "Too many requests, please try again later !!!",
//     });
//   }
//   next(err);
// };
