<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServicePurchase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ServicePurchaseController extends Controller
{
    public function store(Service $service, Request $request): RedirectResponse
    {
        $user = $request->user();

        ServicePurchase::firstOrCreate(
            [
                'user_id' => $user->id,
                'service_id' => $service->id,
            ],
            [
                'price' => $service->price,
                'purchased_at' => now(),
            ],
        );

        return redirect()
            ->route('dashboard')
            ->with('success', 'Service purchased successfully.');
    }
}
