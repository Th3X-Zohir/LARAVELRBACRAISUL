import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Users() {
    const { supers = [], admins = [], users = [] } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-baseline justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Super Admin · Users
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            View all super admins, admins, and users.
                        </p>
                    </div>

                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-600"
                    >
                        Back to dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Users" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <UserTable title="Super admins" users={supers} />
                    <UserTable title="Admins" users={admins} />
                    <UserTable title="Users" users={users} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function UserTable({ title, users }) {
    return (
        <section>
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">
                    {title}
                </h3>
                <span className="text-xs text-gray-500">
                    Total: {users.length}
                </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {users.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                        No users in this group.
                    </p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Email
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Role
                                </th>
                                <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-2 text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-2 text-xs uppercase text-gray-500">
                                        {user.role?.name}
                                    </td>
                                    <td className="px-4 py-2 text-right text-xs">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-2 inline-flex items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-rose-500"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}

