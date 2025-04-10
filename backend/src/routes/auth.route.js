import { Router } from "express";
import passport from "passport";
import { createWorker, loginWorker, logoutWorker } from "../controller/worker.admin.js";


const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  async (req, res) => {
    try {      
      const { user, accessToken, refreshToken } = req.user;

      const userData = encodeURIComponent(JSON.stringify(user));

      res.redirect(
        `http://localhost:5173/google/success#user=${userData}&accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (err) {
      console.error("Google callback error:", err.message);
      res.redirect("http://localhost:5173/login");
    }
  }
);





router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});


// router.get("/auth/failed", (req, res) => {
//   res.status(401).json({ message: "Google login failed" });
// });



// ==========

router.post("/register-worker", createWorker)
router.post('/login-worker', loginWorker)
router.post(  `/logout/:workerId`, logoutWorker)

export default router;
