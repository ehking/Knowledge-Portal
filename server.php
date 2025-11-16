<?php

if (PHP_SAPI === 'cli-server') {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
        return false;
    }
}

require_once __DIR__.'/public/index.php';
