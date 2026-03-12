<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Resolve;
use App\Models\Responsibility;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user()->load('role');

        if ($user->isSuper()) {
            return $this->superDashboard($user);
        }

        if ($user->isAdmin()) {
            return $this->adminDashboard($user);
        }

        return $this->userDashboard($user);
    }

    protected function superDashboard(User $user): Response
    {
        $superRoleId = Role::where('name', 'super')->value('id');
        $adminRoleId = Role::where('name', 'admin')->value('id');
        $userRoleId = Role::where('name', 'user')->value('id');

        $supers = User::when($superRoleId, fn ($q) => $q->where('role_id', $superRoleId))->get();
        $admins = User::when($adminRoleId, fn ($q) => $q->where('role_id', $adminRoleId))->get();
        $users = User::when($userRoleId, fn ($q) => $q->where('role_id', $userRoleId))->get();

        $reports = Report::with(['service', 'user'])->latest()->limit(20)->get();
        $resolves = Resolve::with(['report', 'updatedBy'])->latest()->limit(20)->get();

        return Inertia::render('Dashboard', [
            'role' => 'super',
            'supers' => $supers,
            'admins' => $admins,
            'users' => $users,
            'reports' => $reports,
            'resolves' => $resolves,
        ]);
    }

    protected function adminDashboard(User $user): Response
    {
        $responsibilities = Responsibility::with('service')
            ->where('user_id', $user->id)
            ->get();

        $serviceIds = $responsibilities->pluck('service_id')->unique()->values();

        $reports = Report::with(['service', 'user', 'resolves'])
            ->whereIn('service_id', $serviceIds)
            ->latest()
            ->limit(20)
            ->get();

        $users = User::whereHas('role', fn ($q) => $q->where('name', 'user'))->get();

        return Inertia::render('Dashboard', [
            'role' => 'admin',
            'assignedServices' => $responsibilities,
            'reports' => $reports,
            'users' => $users,
        ]);
    }

    protected function userDashboard(User $user): Response
    {
        $reports = Report::with(['service', 'resolves'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('Dashboard', [
            'role' => 'user',
            'reports' => $reports,
        ]);
    }
}
