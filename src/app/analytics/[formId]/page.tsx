'use client';

import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Loader2,
  MousePointerClick,
  Trophy,
} from 'lucide-react';

interface FieldAnalyticsRecord {
  totalTime: number;
  avgTime: number;
  interactions: number;
}

interface VersionAnalyticsRecord {
  label: string;
  totalTime: number;
  avgTime: number;
  interactions: number;
  submissions: number;
  completionRate: number;
}

interface AnalyticsPayload {
  fields: Record<string, FieldAnalyticsRecord>;
  versions: Record<string, VersionAnalyticsRecord>;
  winner: string | null;
  isDemo?: boolean;
}

interface AnalyticsApiResponse {
  success: boolean;
  data?: AnalyticsPayload;
  message?: string;
}

interface AnalyticsPageProps {
  params: Promise<{
    formId: string;
  }>;
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { formId } = use(params);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/analytics?formId=${encodeURIComponent(formId)}`,
          { signal: controller.signal }
        );
        const json = (await response.json()) as AnalyticsApiResponse;

        if (!response.ok || !json.success || !json.data) {
          throw new Error(json.message || 'Unable to load analytics');
        }

        setAnalytics(json.data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message || 'Unable to load analytics');
          setAnalytics(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();

    return () => controller.abort();
  }, [formId]);

  const fieldEntries = useMemo(
    () => (analytics ? Object.entries(analytics.fields) : []),
    [analytics]
  );

  const versionEntries = useMemo(
    () =>
      analytics
        ? Object.values(analytics.versions).sort((a, b) =>
            a.label.localeCompare(b.label)
          )
        : [],
    [analytics]
  );

  const maxAvgTime = useMemo(
    () =>
      fieldEntries.reduce(
        (max, [, record]) => Math.max(max, record.avgTime),
        0
      ),
    [fieldEntries]
  );

  const totalSubmissions = useMemo(
    () => versionEntries.reduce((sum, version) => sum + version.submissions, 0),
    [versionEntries]
  );

  const totalInteractions = useMemo(
    () =>
      versionEntries.reduce((sum, version) => sum + version.interactions, 0),
    [versionEntries]
  );

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 rounded-lg border border-transparent px-2 py-1 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-200 hover:bg-white hover:text-cyan-700 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-cyan-300"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
              A/B Testing
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Form Analytics
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Form ID:{' '}
              <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">
                {formId}
              </code>
            </p>
            {analytics?.isDemo && (
              <span className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                Demo data
              </span>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300">
            <BarChart3 size={26} />
          </div>
        </div>

        {loading ? (
          <StatePanel icon={<Loader2 className="animate-spin" size={32} />}>
            Loading analytics...
          </StatePanel>
        ) : error ? (
          <StatePanel>{error}</StatePanel>
        ) : !analytics ? (
          <StatePanel>No analytics data available for this form.</StatePanel>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard
                icon={<Trophy size={20} />}
                title="Winning Version"
                value={
                  analytics.winner
                    ? `Version ${analytics.winner} performing better`
                    : 'No winner yet'
                }
              />
              <SummaryCard
                icon={<MousePointerClick size={20} />}
                title="Total Interactions"
                value={totalInteractions.toString()}
              />
              <SummaryCard
                icon={<BarChart3 size={20} />}
                title="Total Submissions"
                value={totalSubmissions.toString()}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {versionEntries.map((version) => (
                <VersionCard
                  key={version.label}
                  version={version}
                  isWinner={analytics.winner === version.label}
                />
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                    Field Performance
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Interaction timing remains separated by version above.
                  </p>
                </div>
                <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {fieldEntries.length} fields
                </span>
              </div>

              {fieldEntries.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No field interactions tracked yet.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {fieldEntries.map(([fieldId, record]) => {
                    const avgRatio =
                      maxAvgTime > 0 ? record.avgTime / maxAvgTime : 0;

                    return (
                      <div
                        key={fieldId}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Field ID
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-950 dark:text-white">
                          {fieldId}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <Metric
                            label="Avg Time"
                            value={`${record.avgTime.toFixed(1)}s`}
                          />
                          <Metric
                            label="Interactions"
                            value={record.interactions.toString()}
                          />
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-cyan-500"
                            style={{
                              width: `${Math.max(
                                5,
                                Math.min(100, avgRatio * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function VersionCard({
  version,
  isWinner,
}: {
  version: VersionAnalyticsRecord;
  isWinner: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-6 shadow-sm ${
        isWinner
          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Version {version.label}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            {version.completionRate.toFixed(1)}% completion
          </h2>
        </div>
        {isWinner && (
          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
            Winner
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Metric label="Avg Time" value={`${version.avgTime.toFixed(1)}s`} />
        <Metric label="Interactions" value={version.interactions.toString()} />
        <Metric label="Submissions" value={version.submissions.toString()} />
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300">
        {icon}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function StatePanel({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {icon && (
        <div className="mb-4 rounded-full bg-cyan-50 p-4 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300">
          {icon}
        </div>
      )}
      {children}
    </div>
  );
}
