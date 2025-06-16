import z from "zod";

export const SignUpSchema = z.object({
  username: z
    .string()
    .regex(/^[a-z0-9._]+$/, {
      message: "Username can only contain lowercase letters, numbers, dots and underscores.",
    })
    .min(3, { message: "Username must be at least 3 characters long" })
    .refine((value) => value === value.toLowerCase(), {
      message: "Username must be in lowercase",
    }),
  fullname: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
});
