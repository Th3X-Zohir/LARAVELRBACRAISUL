<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\User;
use App\Models\Responsibility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $services = Service::with('responsibilities.user')
            ->orderBy('name')
            ->get();

        $adminRole = User::query()
            ->whereHas('role', fn ($q) => $q->where('name', 'admin'))
            ->get();

        return Inertia::render('Super/Services', [
            'services' => $services,
            'admins' => $adminRole,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $service = Service::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => Auth::id(),
        ]);

        return redirect()
            ->route('super.services.index')
            ->with('success', 'Service created.');
    }

    public function assignAdmins(Request $request, Service $service)
    {
        $validated = $request->validate([
            'admin_ids' => ['array'],
            'admin_ids.*' => ['integer', 'exists:users,id'],
        ]);

        $adminIds = collect($validated['admin_ids'] ?? [])
            ->unique()
            ->values();

        // Only keep IDs that belong to admin role users
        if ($adminIds->isNotEmpty()) {
            $adminIds = User::whereIn('id', $adminIds)
                ->whereHas('role', fn ($q) => $q->where('name', 'admin'))
                ->pluck('id');
        }

        // Remove responsibilities for this service that are not in the new list
        Responsibility::where('service_id', $service->id)
            ->whereNotIn('user_id', $adminIds)
            ->delete();

        // Ensure each admin id has a responsibility row
        $adminIds->each(function ($adminId) use ($service) {
            Responsibility::firstOrCreate(
                [
                    'user_id' => $adminId,
                    'service_id' => $service->id,
                ],
                [
                    'assigned_by' => Auth::id(),
                ],
            );
        });

        return redirect()
            ->route('super.services.index')
            ->with('success', 'Service responsibilities updated.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        //
    }
}
