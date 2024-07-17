import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parcel, labelAddress, label, labelGroup } from "~/server/db/schema";
import { zipCodeRegex } from "~/lib/regex";

export const labelRouter = createTRPCRouter({
  createLabel: protectedProcedure
    .input(
      z.object({
        orders: z
          .object({
            FromCountry: z.string().trim(),
            FromName: z.string().trim(),
            FromCompany: z.string().trim().optional(),
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
            ToCompany: z.string().trim().optional(),
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
              .transform((val) => Number(val)),
            Height: z
              .string()
              .trim()
              .transform((val) => Number(val)),
            Width: z
              .string()
              .trim()
              .transform((val) => Number(val)),
            Weight: z
              .string()
              .trim()
              .transform((val) => Number(val)),
            Reference: z.string().trim().optional(),
          })
          .array(),
        links: z.object({
          pdf: z.string().trim(),
          csv: z.string().trim(),
          zip: z.string().trim(),
        }),
        tracking: z.string().trim().array(),
        labelPrices: z.string().trim().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const orderCount = input.orders.length;
      const totalPrice = input.labelPrices.reduce((a, b) => String(Number(a) + Number(b)));
      const newLabelGroup = await ctx.db.insert(labelGroup).values({
        userId: ctx.auth.userId,
        shippingServiceId: 1,
        labelCount: orderCount,
        totalPrice: totalPrice,
        pdfLink: input.links.pdf,
        csvLink: input.links.csv,
        zipLink: input.links.zip,
      });
      const labelGroupId = newLabelGroup.insertId;

      for (const [idx, order] of input.orders.entries()) {
        const newLabel = await ctx.db.insert(label).values({
          labelGroupId: Number(labelGroupId),
          uspsServiceId: 1,
          price: input.labelPrices[idx],
          tracking: input.tracking[idx],
          reference: order.Reference,
        });
        const labelId = newLabel.insertId;
        await ctx.db.insert(parcel).values({
          labelId: Number(labelId),
          weight: order.Weight,
          length: order.Length,
          width: order.Width,
          height: order.Height,
        });
        await ctx.db.insert(labelAddress).values({
          labelId: Number(labelId),
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
          labelId: Number(labelId),
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
