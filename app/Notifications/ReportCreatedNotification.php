<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReportCreatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Report $report
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
        $report = $this->report->loadMissing('service', 'user');
        return [
            'type' => 'report_created',
            'report_id' => $this->report->id,
            'service_name' => $report->service?->name,
            'reporter_name' => $report->user?->name,
            'message' => 'New report for ' . ($report->service?->name ?? 'a service') . ' from ' . ($report->user?->name ?? 'a user'),
            'url' => route('admin.reports.index'),
        ];
    }
}
