<?php

namespace App\Observers;

use App\Models\Report;
use App\Models\Responsibility;
use App\Notifications\ReportCreatedNotification;
use Illuminate\Support\Facades\Log;

class ReportObserver
{
    /**
     * Handle the Report "created" event.
     */
    public function created(Report $report): void
    {
        Log::info('Report created', [
            'report_id' => $report->id,
            'service_id' => $report->service_id,
            'user_id' => $report->user_id,
            'status' => $report->status,
        ]);

        $admins = Responsibility::where('service_id', $report->service_id)
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter()
            ->unique('id');

        foreach ($admins as $admin) {
            if ($admin->id !== $report->user_id) {
                $admin->notify(new ReportCreatedNotification($report));
            }
        }
    }

    /**
     * Handle the Report "updated" event.
     */
    public function updated(Report $report): void
    {
        Log::info('Report updated', [
            'report_id' => $report->id,
            'status' => $report->status,
        ]);
    }

    /**
     * Handle the Report "deleted" event.
     */
    public function deleted(Report $report): void
    {
        Log::info('Report deleted', [
            'report_id' => $report->id,
            'service_id' => $report->service_id,
            'user_id' => $report->user_id,
        ]);
    }

    /**
     * Handle the Report "restored" event.
     */
    public function restored(Report $report): void
    {
        //
    }

    /**
     * Handle the Report "force deleted" event.
     */
    public function forceDeleted(Report $report): void
    {
        //
    }
}
