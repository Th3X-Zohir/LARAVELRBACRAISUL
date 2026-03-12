import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Reports() {
    const { reports = [] } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-baseline justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Admin · Reports
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            All reports for services assigned to you.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Reports" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        {reports.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500">
                                No reports found for your services.
                            </p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Service
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            User
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Description
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <ReportRow key={report.id} report={report} />
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

function ReportRow({ report }) {
    const [showModal, setShowModal] = useState(false);
    const isResolved = report.status === 'resolved';

    const { data, setData, post, processing, reset } = useForm({
        status: report.status ?? 'pending',
        comment: '',
    });

    const openModal = () => {
        reset({
            status: report.status ?? 'pending',
            comment: '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.reports.resolve', report.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <tr>
            <td className="px-4 py-2 text-gray-900">
                {report.service?.name ?? 'Unknown service'}
            </td>
            <td className="px-4 py-2 text-gray-700">
                {report.user?.name ?? 'Unknown user'}
            </td>
            <td className="px-4 py-2 text-gray-700">
                {report.description}
            </td>
            <td className="px-4 py-2 text-xs">
                <StatusPill status={report.status} />
            </td>
            <td className="px-4 py-2 text-right text-xs">
                <button
                    type="button"
                    disabled={processing}
                    onClick={openModal}
                    className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
                >
                    Resolve
                </button>

                {showModal && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-gray-200">
                            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Resolve report for{' '}
                                        {report.service?.name ??
                                            'Unknown service'}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Set the status and add an optional
                                        comment.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-sm text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <form
                                onSubmit={submit}
                                className="space-y-4 px-4 py-4 sm:px-6"
                            >
                                <div>
                                    <label
                                        htmlFor={`status-${report.id}`}
                                        className="block text-xs font-medium text-gray-700"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id={`status-${report.id}`}
                                        value={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>
                                        <option value="resolved">
                                            Resolved
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor={`comment-${report.id}`}
                                        className="block text-xs font-medium text-gray-700"
                                    >
                                        Comment
                                    </label>
                                    <textarea
                                        id={`comment-${report.id}`}
                                        rows={3}
                                        value={data.comment}
                                        onChange={(e) =>
                                            setData(
                                                'comment',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Optional details about this resolution"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </td>
        </tr>
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

