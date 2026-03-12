<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class SuperUserController extends Controller
{
    public function index(): Response
    {
        $supers = User::with('role')
            ->whereHas('role', fn ($q) => $q->where('name', 'super'))
            ->orderBy('name')
            ->get();

        $admins = User::with('role')
            ->whereHas('role', fn ($q) => $q->where('name', 'admin'))
            ->orderBy('name')
            ->get();

        $users = User::with('role')
            ->whereHas('role', fn ($q) => $q->where('name', 'user'))
            ->orderBy('name')
            ->get();

        return Inertia::render('Super/Users', [
            'supers' => $supers,
            'admins' => $admins,
            'users' => $users,
        ]);
    }
}
