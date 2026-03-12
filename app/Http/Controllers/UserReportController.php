<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserReportController extends Controller
{
    public function index(): Response
    {
        $services = Service::orderBy('name')->get();

        return Inertia::render('User/Services', [
            'services' => $services,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'description' => ['required', 'string', 'max:2000'],
        ]);

        Report::create([
            'service_id' => $validated['service_id'],
            'user_id' => Auth::id(),
            'description' => $validated['description'],
            'status' => 'pending',
        ]);

        return redirect()
            ->route('user.services.index')
            ->with('success', 'Report submitted.');
    }

    public function edit(Report $report): Response
    {
        if ($report->user_id !== Auth::id()) {
            abort(403);
        }

        $report->load('service');
        $services = Service::orderBy('name')->get();

        return Inertia::render('User/EditReport', [
            'report' => $report,
            'services' => $services,
        ]);
    }

    public function update(Request $request, Report $report): RedirectResponse
    {
        if ($report->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'description' => ['required', 'string', 'max:2000'],
        ]);

        $report->update([
            'service_id' => $validated['service_id'],
            'description' => $validated['description'],
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Report updated.');
    }

    public function destroy(Report $report): RedirectResponse
    {
        if ($report->user_id !== Auth::id()) {
            abort(403);
        }

        $report->delete();

        return redirect()
            ->route('dashboard')
            ->with('success', 'Report removed.');
    }
}
