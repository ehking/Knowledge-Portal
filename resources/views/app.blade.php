<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{{ config('app.name', 'Knowledge Portal') }}</title>
        @vite('resources/js/main.jsx')
    </head>
    <body class="antialiased bg-slate-50 text-slate-900">
        <div id="root"></div>
    </body>
</html>
