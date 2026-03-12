import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function EditReport() {
    const { report, services = [] } = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        service_id: report?.service_id ?? report?.service?.id ?? '',
        description: report?.description ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('user.reports.update', report.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-baseline justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Edit report
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update the service and description for this report.
                        </p>
                    </div>
                    <Link
                        href={route('dashboard')}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Back to dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Edit report" />

            <div className="py-10">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <form
                            onSubmit={submit}
                            className="space-y-4 px-4 py-4 sm:px-6"
                        >
                            <div>
                                <label
                                    htmlFor="service"
                                    className="block text-xs font-medium text-gray-700"
                                >
                                    Service
                                </label>
                                <select
                                    id="service"
                                    value={data.service_id}
                                    onChange={(e) =>
                                        setData('service_id', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    required
                                >
                                    {services.map((service) => (
                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.service_id && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.service_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-xs font-medium text-gray-700"
                                >
                                    Problem description
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Explain what is not working or what you need help with"
                                    required
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
