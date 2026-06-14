<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Apotek Jaya Farma') }}</title>
        <link rel="icon" type="image/png" href="/images/logo_favicon.png">

        <!-- Fonts -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/app/pages/{$page['component']}.tsx"])
        @inertiaHead
        
        <!-- Midtrans Snap SDK -->
        <script type="text/javascript" src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="{{ config('midtrans.client_key') }}"></script>
    </head>
    <body class="font-sans antialiased overflow-x-clip">
        @inertia
    </body>
</html>
