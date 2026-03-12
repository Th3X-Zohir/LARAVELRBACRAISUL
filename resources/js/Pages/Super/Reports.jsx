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
                            Super Admin · Open Reports
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            View and resolve all pending reports across
                            services.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Open reports" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        {reports.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500">
                                There are no open reports.
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
        status: 'resolved',
        comment: '',
    });

    const openModal = () => {
        reset({ status: 'resolved', comment: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const submit = (e) => {
        e.preventDefault();
        setData('status', 'resolved');
        post(route('super.reports.resolve', report.id), {
            onSuccess: () => {
                closeModal();
            },
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
                <p className="line-clamp-2">{report.description}</p>
            </td>
            <td className="px-4 py-2 text-right text-xs">
                {isResolved ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-800">
                        Resolved
                    </span>
                ) : (
                    <button
                        type="button"
                        disabled={processing}
                        onClick={openModal}
                        className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
                    >
                        Mark resolved
                    </button>
                )}

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
                                        Add an optional comment describing the
                                        resolution.
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
                                        placeholder="Optional details about how this was resolved"
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
                                        Confirm resolved
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

