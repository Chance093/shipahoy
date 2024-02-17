import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parcel, labelAddress, label, labelGroup } from "~/server/db/schema";

export const labelRouter = createTRPCRouter({
  createLabel: protectedProcedure
    .input(
      z.object({
        fromName: z.string(),
        fromCompanyName: z.string(),
        fromAddress: z.string(),
        fromAddress2: z.string(),
        fromZipCode: z.string(),
        fromCity: z.string(),
        fromState: z.string().length(2),
        fromCountry: z.string(),
        fromPhoneNumber: z.string(),
        toName: z.string(),
        toCompanyName: z.string(),
        toAddress: z.string(),
        toAddress2: z.string(),
        toZipCode: z.string(),
        toCity: z.string(),
        toState: z.string().length(2),
        toCountry: z.string(),
        toPhoneNumber: z.string(),
        height: z.number(),
        weight: z.number(),
        length: z.number(),
        width: z.number(),
        price: z.string(),
        pdf: z.string(),
        tracking: z.string(),
        labelCount: z.number(),
        uspsServiceId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newLabelGroup = await ctx.db.insert(labelGroup).values({
        userId: ctx.auth.userId,
        shippingServiceId: 1,
        labelCount: input.labelCount,
        totalPrice: input.price,
        pdf: input.pdf,
      });
      const labelGroupId = newLabelGroup.insertId;
      const newLabel = await ctx.db.insert(label).values({
        labelGroupId: parseInt(labelGroupId),
        uspsServiceId: 1,
        price: input.price,
        tracking: input.tracking,
      });
      const labelId = newLabel.insertId;
      await ctx.db.insert(parcel).values({
        labelId: parseInt(labelId),
        weight: input.weight,
        length: input.length,
        width: input.width,
        height: input.height,
      });
      await ctx.db.insert(labelAddress).values({
        labelId: parseInt(labelId),
        isSender: true,
        name: input.fromName,
        company: input.fromCompanyName,
        streetOne: input.fromAddress,
        streetTwo: input.fromAddress2,
        city: input.fromCity,
        state: input.fromState,
        zipCode: input.fromZipCode,
        country: input.fromCountry,
        phoneNumber: input.fromPhoneNumber,
      });
      await ctx.db.insert(labelAddress).values({
        labelId: parseInt(labelId),
        isSender: false,
        name: input.toName,
        company: input.toCompanyName,
        streetOne: input.toAddress,
        streetTwo: input.toAddress2,
        city: input.toCity,
        state: input.toState,
        zipCode: input.toZipCode,
        country: input.toCountry,
        phoneNumber: input.toPhoneNumber,
      });
    }),

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
