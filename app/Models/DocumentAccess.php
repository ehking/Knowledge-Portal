<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentAccess extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'role_id',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
