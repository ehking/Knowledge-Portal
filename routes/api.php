<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DocumentController;
use App\Http\Controllers\API\RoleController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::get('documents', [DocumentController::class, 'index']);
    Route::get('documents/{document}', [DocumentController::class, 'show']);
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');

    Route::post('documents', [DocumentController::class, 'store'])->middleware('role:admin|knowledge_manager');
    Route::put('documents/{document}', [DocumentController::class, 'update'])->middleware('role:admin|knowledge_manager');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->middleware('role:admin');

    Route::get('roles', [RoleController::class, 'index'])->middleware('role:admin');
});
