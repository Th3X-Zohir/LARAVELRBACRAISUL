<?php

namespace App\Observers;

use App\Models\Resolve;
use App\Notifications\ReportResolvedNotification;
use Illuminate\Support\Facades\Log;

class ResolveObserver
{
    /**
     * Handle the Resolve "created" event.
     */
    public function created(Resolve $resolve): void
    {
        Log::info('Resolve created', [
            'resolve_id' => $resolve->id,
            'report_id' => $resolve->report_id,
            'status' => $resolve->status,
            'updated_by' => $resolve->updated_by,
        ]);

        if ($resolve->status === 'resolved') {
            $report = $resolve->report;
            if ($report?->user_id) {
                $report->user?->notify(new ReportResolvedNotification($resolve));
            }
        }
    }

    /**
     * Handle the Resolve "updated" event.
     */
    public function updated(Resolve $resolve): void
    {
        Log::info('Resolve updated', [
            'resolve_id' => $resolve->id,
            'report_id' => $resolve->report_id,
            'status' => $resolve->status,
        ]);
    }

    /**
     * Handle the Resolve "deleted" event.
     */
    public function deleted(Resolve $resolve): void
    {
        Log::info('Resolve deleted', [
            'resolve_id' => $resolve->id,
            'report_id' => $resolve->report_id,
        ]);
    }

    /**
     * Handle the Resolve "restored" event.
     */
    public function restored(Resolve $resolve): void
    {
        //
    }

    /**
     * Handle the Resolve "force deleted" event.
     */
    public function forceDeleted(Resolve $resolve): void
    {
        //
    }
}
