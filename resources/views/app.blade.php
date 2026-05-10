<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @viteReactRefresh
        @vite(['resources/js/app.tsx', 'resources/css/app.css'])
        @inertiaHead
        <link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet" />

    </head>

    <body class="font-sans antialiased">
        @inertia
    </body>
    <script
  type="module"
  src="https://unpkg.com/@splinetool/viewer@1.12.6/build/spline-viewer.js">
</script>

</html>
