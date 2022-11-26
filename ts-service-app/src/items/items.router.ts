/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as ItemService from "./items.service";
import { BaseItem, Item } from "./item.interface";
const client = require("prom-client");
const counter = new client.Counter({
  name: "items",
  help: "metric_help",
});

/**
 * Router Definition
 */
export const itemsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET Metrics
itemsRouter.get("/", async (req: Request, res: Response) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// GET items

itemsRouter.get("/items/", async (req: Request, res: Response) => {
  try {
    const items: Item[] = await ItemService.findAll();
    counter.inc();

    res.status(200).send(items);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// GET items/:id

itemsRouter.get("/items/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item: Item = await ItemService.find(id);

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send("item not found");
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// POST items

itemsRouter.post("/items/", async (req: Request, res: Response) => {
  try {
    const item: BaseItem = req.body;

    const newItem = await ItemService.create(item);

    res.status(201).json(newItem);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// PUT items/:id

itemsRouter.put("/items/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const itemUpdate: Item = req.body;

    const existingItem: Item = await ItemService.find(id);

    if (existingItem) {
      const updatedItem = await ItemService.update(id, itemUpdate);
      return res.status(200).json(updatedItem);
    }

    const newItem = await ItemService.create(itemUpdate);

    res.status(201).json(newItem);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// DELETE items/:id

itemsRouter.delete("/items/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await ItemService.remove(id);

    res.sendStatus(204);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});
