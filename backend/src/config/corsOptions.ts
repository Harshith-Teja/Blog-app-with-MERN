import allowedOrigins from "./allowedOrigins";

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
