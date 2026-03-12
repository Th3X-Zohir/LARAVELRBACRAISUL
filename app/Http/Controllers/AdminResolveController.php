<?php

namespace App\Http\Controllers;

use App\Models\Resolve;
use App\Models\Responsibility;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminResolveController extends Controller
{
    public function index(): Response
    {
        $adminId = Auth::id();

        $resolves = Resolve::with(['report.service'])
            ->where('updated_by', $adminId)
            ->latest()
            ->get();

        $uniqueResolvedCount = Resolve::where('updated_by', $adminId)
            ->distinct('report_id')
            ->count('report_id');

        $serviceIds = Responsibility::where('user_id', $adminId)
            ->pluck('service_id')
            ->unique()
            ->values();

        $uniqueReportsOnResponsibilities = Report::whereIn('service_id', $serviceIds)
            ->distinct('id')
            ->count('id');

        return Inertia::render('Admin/Resolves', [
            'resolves' => $resolves,
            'stats' => [
                'uniqueResolved' => $uniqueResolvedCount,
                'uniqueReportsOnResponsibilities' => $uniqueReportsOnResponsibilities,
            ],
        ]);
    }
}
