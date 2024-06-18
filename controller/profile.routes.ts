import { Preference } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { Profile } from "../domain/model/profile";
import profileService from "../service/profile.service";
import swipeService from "../service/swipe.service";
import { AuthenticationResponse, ProfileInput } from "../types";

const profileRouter = express.Router();

profileRouter.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const profiles: Profile[] = await profileService.getAllProfiles("ADMIN");

      res
        .status(200)
        .json({ status: "success", message: "profiles found", profiles });
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.get(
  "/email/:email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.params.email as string;
      const profile: Profile = await profileService.getProfileByEmail(email);

      res
        .status(200)
        .json({ status: "success", message: "profile found", profile });
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.get(
  "/preference",
  async (
    req: Request & { auth: AuthenticationResponse },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const preference = String(req.query.preference);
      const auth = req.auth;
      const profiles = await profileService.getAllPossibleMatches(
        preference as Preference,
        auth
      );
      res.status(200).json({
        status: "success",
        message: "possible matches found",
        profiles,
      });
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.get(
  "/:profileId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profileId: number = parseInt(req.params.profileId);

      const profile: Profile = await profileService.getProfileById(profileId);

      res
        .status(200)
        .json({ status: "success", message: "profile found", profile });
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.put(
  "/:profileId",
  async (
    req: Request & { auth: AuthenticationResponse },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inputProfileId: string | number = parseInt(req.params.profileId);
      const profileInput: ProfileInput = req.body as ProfileInput;
      const auth: AuthenticationResponse = req.auth;
      const updatedProfile: Profile = await profileService.updateProfile(
        inputProfileId,
        profileInput,
        auth
      );

      res.status(200).json({
        status: "success",
        message: "profile updated",
        updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.delete(
  "/:profileId",
  async (
    req: Request & { auth: AuthenticationResponse },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inputProfileId: number = parseInt(req.params.profileId as string);
      const auth: AuthenticationResponse = req.auth;
      const deletedProfile: Profile = await profileService.deleteProfile(
        inputProfileId,
        auth
      );
      res.status(200).json({
        status: "success",
        message: "profile deleted",
        deletedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
);

export { profileRouter };
