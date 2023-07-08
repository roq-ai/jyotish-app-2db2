import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { chartValidationSchema } from 'validationSchema/charts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.chart
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getChartById();
    case 'PUT':
      return updateChartById();
    case 'DELETE':
      return deleteChartById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getChartById() {
    const data = await prisma.chart.findFirst(convertQueryToPrismaUtil(req.query, 'chart'));
    return res.status(200).json(data);
  }

  async function updateChartById() {
    await chartValidationSchema.validate(req.body);
    const data = await prisma.chart.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteChartById() {
    const data = await prisma.chart.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
