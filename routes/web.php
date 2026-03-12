<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SuperUserController;
use App\Http\Controllers\SuperReportController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\AdminResolveController;
use App\Http\Controllers\UserReportController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});

Route::middleware(['auth', 'verified', 'role:super'])
    ->prefix('super')
    ->name('super.')
    ->group(function () {
        Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
        Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
        Route::post('/services/{service}/assign-admins', [ServiceController::class, 'assignAdmins'])
            ->name('services.assign-admins');
        Route::get('/users', [SuperUserController::class, 'index'])->name('users.index');
        Route::get('/reports', [SuperReportController::class, 'index'])->name('reports.index');
        Route::post('/reports/{report}/resolve', [SuperReportController::class, 'resolve'])->name('reports.resolve');
    });

Route::middleware(['auth', 'verified', 'role:admin,super'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::post('/reports/{report}/resolve', [AdminReportController::class, 'resolve'])->name('reports.resolve');
        Route::get('/resolves', [AdminResolveController::class, 'index'])->name('resolves.index');
    });

Route::middleware(['auth', 'verified', 'role:user,admin,super'])
    ->prefix('user')
    ->name('user.')
    ->group(function () {
        Route::get('/services', [UserReportController::class, 'index'])->name('services.index');
        Route::post('/reports', [UserReportController::class, 'store'])->name('reports.store');
        Route::get('/reports/{report}/edit', [UserReportController::class, 'edit'])->name('reports.edit');
        Route::patch('/reports/{report}', [UserReportController::class, 'update'])->name('reports.update');
        Route::delete('/reports/{report}', [UserReportController::class, 'destroy'])->name('reports.destroy');
    });

require __DIR__.'/auth.php';
