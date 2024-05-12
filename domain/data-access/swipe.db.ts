import { Direction } from "../../types";
import database from "../../util/database";
import { Swipe } from "../model/swipe";

const createSwipe = async (
  swiperId: number,
  swipeeId: number,
  direction: Direction
): Promise<Swipe> => {
  try {
    const swipe = await database.swipe.create({
      data: {
        swiperId: parseInt(swiperId as unknown as string),
        swipeeId: parseInt(swipeeId as unknown as string),
        direction,
      },
    });
    return swipe ? Swipe.from(swipe) : null;
  } catch (error) {
    console.log(error);
  }
};

const getAllSwipes = async (id: number): Promise<Swipe[]> => {
  try {
    const swipes = await database.swipe.findMany({
      where: {
        swiperId: id,
      },
    });
    return swipes ? swipes.map((s) => Swipe.from(s)) : null;
  } catch (error) {
    console.log(error);
  }
};

const getSwipedBy = async (id: number): Promise<Swipe[]> => {
  try {
    const swipes = await database.swipe.findMany({
      where: {
        swipeeId: id,
      },
    });
    return swipes ? swipes.map((s) => Swipe.from(s)) : null;
  } catch (error) {
    console.log(error);
  }
};

const getSwipeByIds = async (
  swiperId: number,
  swipeeId: number
): Promise<Swipe> => {
  try {
    const swipe = await database.swipe.findFirst({
      where: {
        AND: [
          { swiperId: parseInt(swiperId as unknown as string) },
          { swipeeId: parseInt(swipeeId as unknown as string) },
          { direction: "R" },
        ],
      },
    });
    return swipe ? Swipe.from(swipe) : null;
  } catch (error) {
    console.log(error);
  }
};

const deleteSwipe = async (id: number): Promise<Boolean> => {
  try {
    await database.swipe.delete({
      where: {
        id: parseInt(id as unknown as string),
      },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

export default {
  createSwipe,
  getAllSwipes,
  getSwipedBy,
  getSwipeByIds,
  deleteSwipe,
};
