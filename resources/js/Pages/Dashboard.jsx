import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const {
        auth,
        role,
        supers = [],
        admins = [],
        users = [],
        reports = [],
        resolves = [],
        assignedServices = [],
    } = usePage().props;

    const currentRole = role ?? auth?.user?.role?.name ?? 'user';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-baseline justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {currentRole === 'super'
                                ? 'Super Admin Dashboard'
                                : currentRole === 'admin'
                                  ? 'Admin Dashboard'
                                  : 'User Dashboard'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Signed in as {auth?.user?.name} (
                            {auth?.user?.role?.name})
                        </p>
                    </div>

                    {currentRole === 'super' && (
                        <div className="flex gap-2">
                            <Link
                                href={route('super.services.index')}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500"
                            >
                                Manage services
                            </Link>
                            <Link
                                href={route('super.reports.index')}
                                className="inline-flex items-center rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-amber-400"
                            >
                                Open reports
                            </Link>
                            <Link
                                href={route('super.users.index')}
                                className="inline-flex items-center rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-600"
                            >
                                View users
                            </Link>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {currentRole === 'super' && (
                        <>
                            <RoleSummary supers={supers} admins={admins} users={users} />
                            <SuperReportOverview reports={reports} resolves={resolves} />
                        </>
                    )}

                    {currentRole === 'admin' && (
                        <>
                            <AdminServices assignedServices={assignedServices} />
                            <AdminReports reports={reports} />
                        </>
                    )}

                    {currentRole === 'user' && (
                        <UserReports reports={reports} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Card({ title, children }) {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
                <h3 className="text-sm font-semibold text-gray-800">
                    {title}
                </h3>
            </div>
            <div className="px-4 py-4 sm:px-6">{children}</div>
        </div>
    );
}

function RoleSummary({ supers, admins, users }) {
    return (
        <section id="super-users">
            <Card title="Accounts overview">
                <dl className="grid gap-4 sm:grid-cols-3">
                    <SummaryItem label="Super admins" value={supers.length} />
                    <SummaryItem label="Admins" value={admins.length} />
                    <SummaryItem label="Users" value={users.length} />
                </dl>
            </Card>
        </section>
    );
}

function SummaryItem({ label, value }) {
    return (
        <div className="rounded-lg bg-gray-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {value}
            </dd>
        </div>
    );
}

function SuperReportOverview({ reports, resolves }) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Recent reports">
                <div className="space-y-3 text-sm">
                    {reports.length === 0 && (
                        <p className="text-gray-500">No reports yet.</p>
                    )}
                    {reports.map((r) => (
                        <div
                            key={r.id}
                            className="rounded-lg border border-gray-100 px-3 py-2.5"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {r.service?.name ?? 'Unknown service'}
                                </span>
                                <StatusPill status={r.status} />
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-gray-800">
                                {r.description}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                By {r.user?.name ?? 'Unknown user'}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Recent resolutions">
                <div className="space-y-3 text-sm">
                    {resolves.length === 0 && (
                        <p className="text-gray-500">
                            No resolve activity yet.
                        </p>
                    )}
                    {resolves.map((res) => (
                        <div
                            key={res.id}
                            className="rounded-lg border border-gray-100 px-3 py-2.5"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Report #{res.report_id}
                                </span>
                                <StatusPill status={res.status} />
                            </div>
                            {res.comment && (
                                <p className="mt-1 line-clamp-2 text-sm text-gray-800">
                                    {res.comment}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Updated by {res.updated_by?.name ?? 'Unknown'}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function AdminServices({ assignedServices }) {
    return (
        <Card title="Your assigned services">
            <div className="space-y-2 text-sm">
                {assignedServices.length === 0 && (
                    <p className="text-gray-500">
                        You are not assigned to any services yet.
                    </p>
                )}
                {assignedServices.map((resp) => (
                    <div
                        key={resp.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
                    >
                        <div>
                            <p className="font-medium text-gray-900">
                                {resp.service?.name ?? 'Unknown service'}
                            </p>
                            <p className="text-xs text-gray-500">
                                Service ID: {resp.service_id}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function AdminReports({ reports }) {
    return (
        <Card title="Reports for your services">
            <div className="space-y-3 text-sm">
                {reports.length === 0 && (
                    <p className="text-gray-500">No reports yet.</p>
                )}
                {reports.map((r) => (
                    <div
                        key={r.id}
                        className="rounded-lg border border-gray-100 px-3 py-2.5"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {r.service?.name ?? 'Unknown service'}
                            </span>
                            <StatusPill status={r.status} />
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-800">
                            {r.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            By {r.user?.name ?? 'Unknown user'}
                        </p>
                        {/* You can later add actions here to update status */}
                    </div>
                ))}
            </div>
        </Card>
    );
}

function UserReports({ reports }) {
    return (
        <Card title="Your reports">
            <div className="space-y-3 text-sm">
                {reports.length === 0 && (
                    <p className="text-gray-500">
                        You have not submitted any reports yet.
                    </p>
                )}
                {reports.map((r) => (
                    <div
                        key={r.id}
                        className="rounded-lg border border-gray-100 px-3 py-2.5"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {r.service?.name ?? 'Unknown service'}
                            </span>
                            <StatusPill status={r.status} />
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-800">
                            {r.description}
                        </p>
                        {r.resolves?.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500">
                                Latest update:{' '}
                                {
                                    r.resolves[0]
                                        ?.comment
                                }
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </Card>
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

