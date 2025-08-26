import express from "express";
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
} from "../controllers/groups.controller.js";


import { authMiddleWare } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/", authMiddleWare, createGroup); 
router.get("/", authMiddleWare, getAllGroups);
router.get("/:groupId", authMiddleWare, getGroupById);
router.put("/:groupId", authMiddleWare, updateGroup);
router.delete("/:groupId", authMiddleWare, deleteGroup); 

export default router;