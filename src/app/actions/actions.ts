"use server";
import prisma from "@/lib/prisma";

//
// get the grade levels in a school
export async function getGradeLevels(school_id: number | undefined) {
  if (!school_id) return [];
  //
  //school has many levels offered
  //each level offered is associated with a school level
  //each level offered has multiple grades
  //first e need to find the levels offered by the school
  const levels_offered = await prisma.levels_offered.findMany({
    where: { school_id },
    select: { school_level: true },
  });

  //
  //get the grade levels for each level offered
  const grade_levels = await Promise.all(
    levels_offered.map(async (level) => {
      const grades = await prisma.grade_level.findMany({
        where: { school_level: level.school_level },
        select: { level: true, id: true },
      });
      return grades;
    })
  );

  return grade_levels.flat();
}

//
//get the streams in a school
export async function getStreams(school_id: number | undefined) {
  if (!school_id) return [];
  //
  //get the streams in the school
  const streams = await prisma.stream.findMany({
    where: { school_id },
    select: { id: true, name: true, grade_level_id: true },
  });

  return streams;
}
