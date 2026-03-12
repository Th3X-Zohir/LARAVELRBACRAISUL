<?php

namespace App\Notifications;

use App\Models\Resolve;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReportResolvedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Resolve $resolve
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $resolve = $this->resolve->loadMissing('report.service');
        $report = $resolve->report;
        return [
            'type' => 'report_resolved',
            'report_id' => $report?->id,
            'resolve_id' => $this->resolve->id,
            'service_name' => $report?->service?->name,
            'comment' => $this->resolve->comment,
            'status' => $this->resolve->status,
            'message' => 'Your report for ' . ($report?->service?->name ?? 'a service') . ' has been marked as ' . $this->resolve->status,
            'url' => route('dashboard'),
        ];
    }
}
