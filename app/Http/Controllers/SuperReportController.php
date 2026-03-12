<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Resolve;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SuperReportController extends Controller
{
    public function index(): Response
    {
        $reports = Report::with(['service', 'user', 'resolves'])
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Super/Reports', [
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
            ->route('super.reports.index')
            ->with('success', 'Report updated.');
    }
}
