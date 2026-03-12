<?php

namespace App\Http\Controllers;

use App\Models\ServicePurchase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $purchases = ServicePurchase::with('service.type')
            ->where('user_id', $user->id)
            ->latest('purchased_at')
            ->get();

        $services = $purchases
            ->pluck('service')
            ->filter()
            ->values();

        return Inertia::render('User/MyServices', [
            'services' => $services,
        ]);
    }
}
