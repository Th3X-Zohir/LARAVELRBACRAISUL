import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Resolves() {
    const { resolves = [], stats } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-baseline justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Admin · Your resolutions
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            List of problems you have marked as resolved.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Your resolutions" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <StatsCard stats={stats} />
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        {resolves.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500">
                                You have not resolved any reports yet.
                            </p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Service
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Report ID
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Comment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {resolves.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2 text-gray-900">
                                                {item.report?.service?.name ??
                                                    'Unknown service'}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                #{item.report_id}
                                            </td>
                                            <td className="px-4 py-2 text-xs">
                                                <StatusPill
                                                    status={item.status}
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {item.comment ?? (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatsCard({ stats }) {
    const uniqueResolved = stats?.uniqueResolved ?? 0;
    const uniqueReportsOnResponsibilities =
        stats?.uniqueReportsOnResponsibilities ?? 0;

    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
                <h3 className="text-sm font-semibold text-gray-800">
                    Resolution statistics
                </h3>
            </div>
            <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:px-6">
                <div className="rounded-lg bg-gray-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Unique reports you resolved
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {uniqueResolved}
                    </p>
                </div>
                <div className="rounded-lg bg-gray-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Unique reports on your services
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {uniqueReportsOnResponsibilities}
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatusPill({ status }) {
    const color =
        status === 'resolved'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-amber-100 text-amber-800';

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
        >
            {status}
        </span>
    );
}

