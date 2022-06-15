// app/services/auth.server.ts

import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "~/services/session.server";
import { User } from "~/types";
import { db } from "~/db.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    const userEmail = profile.emails[0].value;
    return db.user.upsert({
      where: { email: userEmail },
      create: { email: userEmail },
      update: {},
    });
  }
);

authenticator.use(googleStrategy);
