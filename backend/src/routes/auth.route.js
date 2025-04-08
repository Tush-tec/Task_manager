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
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { accessToken, refreshToken, user } = req.user;

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.json({ user, accessToken, refreshToken});

    // Option 2: Or set cookies here

    // res.redirect("http://localhost:3000/dashboard");
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});


// ==========

router.post("/register-worker", createWorker)
router.post('/login-worker', loginWorker)
router.post(  `/logout/:workerId`, logoutWorker)

export default router;
