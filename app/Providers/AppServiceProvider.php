<?php

namespace App\Providers;

use App\Models\Report;
use App\Models\Resolve;
use App\Observers\ReportObserver;
use App\Observers\ResolveObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Report::observe(ReportObserver::class);
        Resolve::observe(ResolveObserver::class);
    }
}
