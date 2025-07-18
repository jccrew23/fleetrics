import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

console.log(
  "Google OAuth callback URL:",
  process.env.GOOGLE_OAUTH_REDIRECT_URI
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
      scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      return done(null, profile);
    }
  )
);

router.get("/test-session", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "No session found" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    prompt: "select_account", // Forces Google to show account selection
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    console.log("✅ Google login successful:", req.user);
    res.redirect(process.env.FRONTEND_URL);
  }
);

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }

    if (req.session) {
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error("Session destroy error:", destroyErr);
          return res.status(500).json({ error: "Session destruction failed" });
        }
        
        // Clear the session cookie with the same settings used to create it
        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        
        console.log("✅ User logged out successfully");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      console.log("No session to destroy");
      return res.status(200).json({ message: "No session to destroy, logged out" });
    }
  });
});


export default router;
