import { db } from '../libs/db.js';

export const checkIfStudentAllowed = async (email) => {
  const exists = await db.batchMember.findFirst({
    where: { email },
  });

  return !!exists;
};
