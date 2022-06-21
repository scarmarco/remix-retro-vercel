import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-socials";
import { sessionStorage } from "~/services/session.server";
import { User } from "~/types";
import { db } from "~/db.server";

export const authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  async ({ profile }) => {
    const userEmail = profile.emails[0].value;
    const picture = profile.photos[0].value;
    const user = await db.user.upsert({
      where: { email: userEmail },
      create: {
        email: userEmail,
        name: profile.displayName,
        picture,
      },
      update: {},
    });

    return user;
  }
);

authenticator.use(googleStrategy);
