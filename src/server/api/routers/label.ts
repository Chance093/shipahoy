import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parcel, labelAddress, label } from "~/server/db/schema";

export const labelRouter = createTRPCRouter({
  addParcel: protectedProcedure
    .input(
      z.object({
        labelId: z.number(),
        weight: z.number(),
        length: z.number(),
        width: z.number(),
        height: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(parcel).values({
        labelId: input.labelId,
        weight: input.weight,
        length: input.length,
        width: input.width,
        height: input.height,
      });
    }),

  addAddress: protectedProcedure
    .input(
      z.object({
        labelId: z.number(),
        isSender: z.boolean(),
        name: z.string(),
        company: z.string(),
        streetOne: z.string(),
        streetTwo: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
        phoneNumber: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(labelAddress).values({
        labelId: input.labelId,
        isSender: input.isSender,
        name: input.name,
        company: input.company,
        streetOne: input.streetOne,
        streetTwo: input.streetTwo,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
        country: input.country,
        phoneNumber: input.phoneNumber,
      });
    }),

  addLabel: protectedProcedure
    .input(
      z
        .object({
          labelGroupId: z.number(),
          uspsServiceId: z.number(),
          uspsExternalServiceId: z.number(),
          price: z.string(),
          tracking: z.string(),
        })
        .partial({
          uspsServiceId: true,
          uspsExternalServiceId: true,
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const newLabel = await ctx.db.insert(label).values({
        labelGroupId: input.labelGroupId,
        uspsServiceId: input.uspsServiceId,
        uspsExternalServiceId: input.uspsExternalServiceId,
        price: input.price,
        tracking: input.tracking,
      });

      return newLabel.insertId;
    }),
});
