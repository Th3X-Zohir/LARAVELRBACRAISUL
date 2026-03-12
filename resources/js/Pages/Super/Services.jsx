import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Services() {
    const { services = [], admins = [] } = usePage().props;

    const [selectedService, setSelectedService] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        description: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();

        post(route('super.services.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-baseline justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Super Admin · Services & Responsibilities
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Create services and assign admins responsible for
                            them.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Services" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <Card title="Create new service">
                        <form
                            onSubmit={handleCreate}
                            className="grid gap-4 sm:grid-cols-[2fr,3fr,auto]"
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-rose-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <input
                                    id="description"
                                    type="text"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Short description (optional)"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-rose-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{ backgroundColor: '#4f46e5' }}
                                >
                                    Add service
                                </button>
                            </div>
                        </form>
                    </Card>

                    <Card title="Services">
                        {services.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No services yet. Create one above.
                            </p>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Name
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Description
                                            </th>
                                            <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Assigned admins
                                            </th>
                                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white text-sm">
                                        {services.map((service) => (
                                            <tr key={service.id}>
                                                <td className="px-4 py-2">
                                                    <span className="font-medium text-gray-900">
                                                        {service.name}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-gray-700">
                                                    {service.description ?? (
                                                        <span className="text-gray-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-center text-xs text-gray-600">
                                                    {service
                                                        .responsibilities
                                                        ?.length || 0}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedService(
                                                                service,
                                                            )
                                                        }
                                                        className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-white shadow-sm"
                                                        style={{ backgroundColor: '#4f46e5' }}
                                                    >
                                                        Assign admins
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>

                    {selectedService && (
                        <AssignAdminsModal
                            service={selectedService}
                            admins={admins}
                            onClose={() => setSelectedService(null)}
                        />
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

function AssignAdminsModal({ service, admins, onClose }) {
    const assignedAdminIds =
        service.responsibilities?.map((r) => r.user_id) ?? [];

    const { data, setData, post, processing } = useForm({
        admin_ids: assignedAdminIds,
    });

    const toggleAdmin = (adminId) => {
        const current = Array.isArray(data.admin_ids) ? data.admin_ids : [];
        const exists = current.includes(adminId);
        const next = exists
            ? current.filter((id) => id !== adminId)
            : [...current, adminId];

        setData('admin_ids', next);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('super.services.assign-admins', service.id), {
            onSuccess: onClose,
        });
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl ring-1 ring-gray-200">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            Assign admins for {service.name}
                        </h3>
                        {service.description && (
                            <p className="text-xs text-gray-500">
                                {service.description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4 px-4 py-4 sm:px-6">
                    <div className="max-h-64 space-y-2 overflow-y-auto text-sm">
                        {admins.length === 0 ? (
                            <p className="text-gray-500">
                                There are no admins to assign yet.
                            </p>
                        ) : (
                            admins.map((admin) => {
                                const checked = data.admin_ids.includes(
                                    admin.id,
                                );

                                return (
                                    <label
                                        key={admin.id}
                                        className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 ${
                                            checked
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {admin.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {admin.email}
                                            </p>
                                        </div>
                                        <button
                                        
                                            type="button"
                                            onClick={() =>
                                                toggleAdmin(admin.id)
                                            }
                                            className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm text-white"
                                            style={{
                                                backgroundColor: checked
                                                    ? '#059669' // emerald-600
                                                    : '#374151', // slate-700
                                            }}
                                        >
                                            {checked ? 'Assigned' : 'Assign'}
                                        </button>
                                    </label>
                                );
                            })
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                            style={{ backgroundColor: '#4f46e5' }}
                        >
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

