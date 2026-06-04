import { prisma } from '@/lib/prisma';

export interface FieldAnalyticsSummary {
  totalTime: number;
  avgTime: number;
  interactions: number;
}

export interface VersionAnalyticsSummary {
  label: string;
  totalTime: number;
  avgTime: number;
  interactions: number;
  submissions: number;
  completionRate: number;
}

export interface FormAnalyticsSummary {
  fields: Record<string, FieldAnalyticsSummary>;
  versions: Record<string, VersionAnalyticsSummary>;
  winner: string | null;
  isDemo?: boolean;
}

function seconds(ms: number) {
  return Math.round((ms / 1000) * 10) / 10;
}

export function getDemoAnalytics(): FormAnalyticsSummary {
  return {
    isDemo: true,
    winner: 'B',
    versions: {
      A: {
        label: 'A',
        totalTime: 192.4,
        avgTime: 8.7,
        interactions: 22,
        submissions: 7,
        completionRate: 31.8,
      },
      B: {
        label: 'B',
        totalTime: 156.8,
        avgTime: 6.0,
        interactions: 26,
        submissions: 13,
        completionRate: 50,
      },
    },
    fields: {
      full_name: {
        totalTime: 42.6,
        avgTime: 5.3,
        interactions: 8,
      },
      email_address: {
        totalTime: 61.2,
        avgTime: 6.8,
        interactions: 9,
      },
      project_details: {
        totalTime: 103.5,
        avgTime: 11.5,
        interactions: 9,
      },
      budget_range: {
        totalTime: 38.4,
        avgTime: 4.8,
        interactions: 8,
      },
    },
  };
}

export async function getFieldAnalytics(
  formId: string
): Promise<FormAnalyticsSummary> {
  const analyticsRecords = await prisma.$queryRaw<
    Array<{
      fieldId: string;
      timeSpent: number;
      version: string | null;
    }>
  >`
    SELECT "fieldId", "timeSpent", "version"
    FROM "Analytics"
    WHERE "formId" = ${formId}
  `;
  const submissions = await prisma.$queryRaw<Array<{ version: string | null }>>`
    SELECT "version"
    FROM "Submission"
    WHERE "formId" = ${formId}
  `;
  const formVersions = await prisma.$queryRaw<Array<{ label: string }>>`
    SELECT "label"
    FROM "FormVersion"
    WHERE "formId" = ${formId}
    ORDER BY "label" ASC
  `;

  const fields: Record<string, FieldAnalyticsSummary> = {};
  const versions: Record<string, VersionAnalyticsSummary> = {};

  const ensureVersion = (label: string) => {
    if (!versions[label]) {
      versions[label] = {
        label,
        totalTime: 0,
        avgTime: 0,
        interactions: 0,
        submissions: 0,
        completionRate: 0,
      };
    }

    return versions[label];
  };

  formVersions.forEach((version) => ensureVersion(version.label));
  ensureVersion('A');
  ensureVersion('B');

  analyticsRecords.forEach((record) => {
    const existing = fields[record.fieldId];
    if (existing) {
      existing.totalTime += seconds(record.timeSpent);
      existing.interactions += 1;
      existing.avgTime =
        Math.round((existing.totalTime / existing.interactions) * 10) / 10;
    } else {
      fields[record.fieldId] = {
        totalTime: seconds(record.timeSpent),
        avgTime: seconds(record.timeSpent),
        interactions: 1,
      };
    }

    const version = ensureVersion(record.version || 'A');
    version.totalTime += seconds(record.timeSpent);
    version.interactions += 1;
    version.avgTime =
      Math.round((version.totalTime / version.interactions) * 10) / 10;
  });

  submissions.forEach((submission) => {
    ensureVersion(submission.version || 'A').submissions += 1;
  });

  Object.values(versions).forEach((version) => {
    version.completionRate =
      version.interactions > 0
        ? Math.round((version.submissions / version.interactions) * 1000) / 10
        : version.submissions > 0
          ? 100
          : 0;
  });

  const rankedVersions = Object.values(versions)
    .filter((version) => version.interactions > 0 || version.submissions > 0)
    .sort((a, b) => {
      if (b.completionRate !== a.completionRate) {
        return b.completionRate - a.completionRate;
      }

      if (a.avgTime !== b.avgTime) {
        return a.avgTime - b.avgTime;
      }

      return b.submissions - a.submissions;
    });

  if (analyticsRecords.length === 0 && submissions.length === 0) {
    return getDemoAnalytics();
  }

  return {
    fields,
    versions,
    winner: rankedVersions[0]?.label ?? null,
  };
}
