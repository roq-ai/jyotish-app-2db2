import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { astrologerValidationSchema } from 'validationSchema/astrologers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAstrologers();
    case 'POST':
      return createAstrologer();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAstrologers() {
    const data = await prisma.astrologer
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'astrologer'));
    return res.status(200).json(data);
  }

  async function createAstrologer() {
    await astrologerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.chart?.length > 0) {
      const create_chart = body.chart;
      body.chart = {
        create: create_chart,
      };
    } else {
      delete body.chart;
    }
    const data = await prisma.astrologer.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
