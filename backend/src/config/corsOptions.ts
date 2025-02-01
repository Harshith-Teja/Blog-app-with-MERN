import allowedOrigins from "./allowedOrigins";

//checks if the origin is listed in allowed origins and reports cors error accordingly
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (allowedOrigins.indexOf(origin || "") != -1 || !origin)
      callback(null, true);
    else callback(new Error("Not allowed by cors"));
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
