<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $isAuthenticated = \Illuminate\Support\Facades\Auth::check();

        // Jika request berasal dari navigasi internal Inertia tapi user sudah tidak terotentikasi pada rute yang dilindungi
        $protectedPaths = ['dashboard*', 'profile*', 'admin*', 'pharmacist*', 'checkout*', 'prescriptions*', 'cart*'];
        if (!$isAuthenticated && $request->header('X-Inertia') && $request->is(...$protectedPaths)) {
            abort(409, 'Session Expired');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $isAuthenticated ? $request->user() : null,
            ],
            'cartCount' => function () {
                return count(session()->get('cart', []));
            },
            'whatsapp_number' => \App\Models\Setting::where('key', 'whatsapp_number')->value('value') ?? '6281315324311',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
