import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parcel, labelAddress, label, labelGroup } from "~/server/db/schema";
import { phoneNumberRegex, zipCodeRegex } from "~/utils/regex";

export const labelRouter = createTRPCRouter({
  createLabel: protectedProcedure
    .input(
      z.object({
        fromName: z.string().trim(),
        fromCompanyName: z.string().trim(),
        fromAddress: z.string().trim(),
        fromAddress2: z.string().trim(),
        fromZipCode: z.string().trim().regex(zipCodeRegex, { message: "Must enter valid zip code" }),
        fromCity: z.string().trim(),
        fromState: z.string().trim(),
        fromCountry: z.string().trim(),
        fromPhoneNumber: z.string().trim().regex(phoneNumberRegex, { message: "Must enter valid phone number" }).optional(),
        toName: z.string().trim(),
        toCompanyName: z.string().trim(),
        toAddress: z.string().trim(),
        toAddress2: z.string().trim(),
        toZipCode: z.string().trim().regex(zipCodeRegex, { message: "Must enter valid zip code" }),
        toCity: z.string().trim(),
        toState: z.string().trim(),
        toCountry: z.string().trim(),
        toPhoneNumber: z.string().trim().regex(phoneNumberRegex, { message: "Must enter valid phone number" }).optional(),
        height: z.number().int().gte(0.1, { message: "Height must be greater than zero" }),
        weight: z.number().gte(0.1, { message: "Weight must be greater than zero" }).lte(70, { message: "Weight must be less than 70" }),
        length: z.number().int().gte(0.1, { message: "Length must be greater than zero" }),
        width: z.number().int().gte(0.1, { message: "Width must be greater than zero" }),
        price: z.string().trim(),
        pdf: z.string().trim(),
        tracking: z.string().trim(),
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
