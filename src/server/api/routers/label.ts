import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parcel, labelAddress, label, labelGroup } from "~/server/db/schema";
import { zipCodeRegex } from "~/utils/regex";

export const labelRouter = createTRPCRouter({
  createLabel: protectedProcedure
    .input(
      z.object({
        orders: z
          .object({
            FromCountry: z.string().trim(),
            FromName: z.string().trim(),
            FromCompany: z.string().trim(),
            FromPhone: z
              .string()
              .trim()
              .transform((val) => (val === "" ? undefined : val)),
            FromStreet: z.string().trim(),
            FromStreet2: z.string().trim(),
            FromCity: z.string().trim(),
            FromZip: z.string().trim().regex(zipCodeRegex, { message: "Must enter valid zip code" }),
            FromState: z.string().trim(),
            ToCountry: z.string().trim(),
            ToName: z.string().trim(),
            ToCompany: z.string().trim(),
            ToPhone: z
              .string()
              .trim()
              .transform((val) => (val === "" ? undefined : val)),
            ToStreet: z.string().trim(),
            ToStreet2: z.string().trim(),
            ToCity: z.string().trim(),
            ToZip: z.string().trim().regex(zipCodeRegex, { message: "Must enter valid zip code" }),
            ToState: z.string().trim(),
            Length: z
              .string()
              .trim()
              .transform((val) => parseInt(val)),
            Height: z
              .string()
              .trim()
              .transform((val) => parseInt(val)),
            Width: z
              .string()
              .trim()
              .transform((val) => parseInt(val)),
            Weight: z
              .string()
              .trim()
              .transform((val) => parseFloat(val)),
          })
          .array(),
        links: z.object({
          pdfLink: z.string().trim(),
          csvLink: z.string().trim(),
          zipLink: z.string().trim(),
        }),
        tracking: z.string().trim().array(),
        labelPrices: z.string().trim().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const orderCount = input.orders.length;
      const totalPrice = input.labelPrices.reduce((a, b) => (+a + +b).toString());
      const newLabelGroup = await ctx.db.insert(labelGroup).values({
        userId: ctx.auth.userId,
        shippingServiceId: 1,
        labelCount: orderCount,
        totalPrice: totalPrice,
        pdfLink: input.links.pdfLink,
        csvLink: input.links.csvLink,
        zipLink: input.links.zipLink,
      });
      const labelGroupId = newLabelGroup.insertId;

      for (const [idx, order] of input.orders.entries()) {
        const newLabel = await ctx.db.insert(label).values({
          labelGroupId: parseInt(labelGroupId),
          uspsServiceId: 1,
          price: input.labelPrices[idx],
          tracking: input.tracking[idx],
        });
        const labelId = newLabel.insertId;
        await ctx.db.insert(parcel).values({
          labelId: parseInt(labelId),
          weight: order.Weight,
          length: order.Length,
          width: order.Width,
          height: order.Height,
        });
        await ctx.db.insert(labelAddress).values({
          labelId: parseInt(labelId),
          isSender: true,
          name: order.FromName,
          company: order.FromCompany,
          streetOne: order.FromStreet,
          streetTwo: order.FromStreet2,
          city: order.FromCity,
          state: order.FromState,
          zipCode: order.FromZip,
          country: order.FromCountry,
          phoneNumber: order.FromPhone,
        });
        await ctx.db.insert(labelAddress).values({
          labelId: parseInt(labelId),
          isSender: false,
          name: order.ToName,
          company: order.ToCompany,
          streetOne: order.ToStreet,
          streetTwo: order.ToStreet2,
          city: order.ToCity,
          state: order.ToState,
          zipCode: order.ToZip,
          country: order.ToCountry,
          phoneNumber: order.ToPhone,
        });
      }
    }),
});
