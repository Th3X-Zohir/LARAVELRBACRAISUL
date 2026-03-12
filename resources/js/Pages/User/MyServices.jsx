import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function MyServices() {
    const { services = [] } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-baseline justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            My services
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Services you have purchased.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="My services" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {services.length === 0 ? (
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                            <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    My services
                                </h3>
                            </div>
                            <div className="px-4 py-4 sm:px-6">
                                <p className="text-sm text-gray-500">
                                    You have not bought any services yet.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                            <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    My services
                                </h3>
                            </div>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm"
                                        >
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                    {service.type?.name ?? 'Service'}
                                                </p>
                                                <h3 className="mt-1 text-base font-semibold text-gray-900">
                                                    {service.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                    {service.description ||
                                                        'No description provided.'}
                                                </p>
                                                <p className="mt-2 text-sm font-semibold text-gray-900">
                                                    {service.price !== null &&
                                                    service.price !== undefined
                                                        ? `৳${Number(
                                                              service.price,
                                                          ).toFixed(2)}`
                                                        : 'Contact for price'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

