import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Services() {
    const { services = [] } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        service_id: services[0]?.id ?? '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('user.reports.store'), {
            onSuccess: () => {
                reset({
                    service_id: services[0]?.id ?? '',
                    description: '',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-baseline justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Report a problem
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Choose a service and describe the issue you are
                            facing.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Report a problem" />

            <div className="py-10">
                <div className="mx-auto max-w-2xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        {services.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500">
                                There are no services available to report
                                against yet.
                            </p>
                        ) : (
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
                                            setData(
                                                'service_id',
                                                e.target.value,
                                            )
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
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="Explain what is not working or what you need help with"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-end border-t border-gray-100 pt-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
                                    >
                                        Submit report
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

