import { z } from 'zod';

import { wsCompatProcedure } from '@/business/server/trpc-middlewares/workspaceAuth';
import { NotificationModel } from '@/database/models/notification';
import { router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';

const notificationProcedure = wsCompatProcedure.use(serverDatabase).use(async (opts) => {
  const { ctx } = opts;
  const wsId = ctx.workspaceId ?? undefined;

  return opts.next({
    ctx: {
      notificationModel: new NotificationModel(ctx.serverDB, ctx.userId, wsId),
    },
  });
});

export const notificationRouter = router({
  archive: notificationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.notificationModel.archive(input.id);
    }),

  archiveAll: notificationProcedure.mutation(async ({ ctx }) => {
    return ctx.notificationModel.archiveAll();
  }),

  list: notificationProcedure
    .input(
      z.object({
        category: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        unreadOnly: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.notificationModel.list(input);
    }),

  markAllAsRead: notificationProcedure.mutation(async ({ ctx }) => {
    return ctx.notificationModel.markAllAsRead();
  }),

  markAsRead: notificationProcedure
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.notificationModel.markAsRead(input.ids);
    }),

  unreadCount: notificationProcedure.query(async ({ ctx }) => {
    return ctx.notificationModel.getUnreadCount();
  }),
});

export type NotificationRouter = typeof notificationRouter;
