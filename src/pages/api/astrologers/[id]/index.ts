import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { astrologerValidationSchema } from 'validationSchema/astrologers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.astrologer
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAstrologerById();
    case 'PUT':
      return updateAstrologerById();
    case 'DELETE':
      return deleteAstrologerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAstrologerById() {
    const data = await prisma.astrologer.findFirst(convertQueryToPrismaUtil(req.query, 'astrologer'));
    return res.status(200).json(data);
  }

  async function updateAstrologerById() {
    await astrologerValidationSchema.validate(req.body);
    const data = await prisma.astrologer.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteAstrologerById() {
    const data = await prisma.astrologer.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
