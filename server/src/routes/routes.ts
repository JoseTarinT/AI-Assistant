import { Router } from "express";
import {
  setRules,
  getRules,
  sendChat,
  health,
} from "../controllers/controllers";
export const router = Router();

// router.get("/", getDataFromAPI);
router.get("/health", health);
router.get("/api/configure", getRules);
router.post("/api/configure", setRules);
router.post("/api/chat", sendChat);
