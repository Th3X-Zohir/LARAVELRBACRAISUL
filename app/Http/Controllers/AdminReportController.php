<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Resolve;
use App\Models\Responsibility;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminReportController extends Controller
{
    public function index(Request $request): Response
    {
        $adminId = Auth::id();

        $serviceIds = Responsibility::where('user_id', $adminId)
            ->pluck('service_id')
            ->unique()
            ->values();

        $reports = Report::with(['service', 'user', 'resolves'])
            ->whereIn('service_id', $serviceIds)
            ->latest()
            ->get();

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
        ]);
    }

    public function resolve(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'resolved'])],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $report->update([
            'status' => $validated['status'],
        ]);

        Resolve::create([
            'report_id' => $report->id,
            'status' => $validated['status'],
            'comment' => $validated['comment'] ?? null,
            'updated_by' => Auth::id(),
        ]);

        return redirect()
            ->route('admin.reports.index')
            ->with('success', 'Report updated.');
    }
}
