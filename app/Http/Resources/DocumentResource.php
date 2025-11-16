<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->pluck('tag')->values()),
            'roles' => $this->whenLoaded('accesses', fn () => $this->accesses->map(fn ($access) => $access->role->name)->values()),
            'file_url' => Storage::disk('public')->url($this->file_path),
            'download_url' => route('documents.download', $this->id),
            'created_by' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
                'username' => $this->creator->username,
            ]),
            'created_at' => optional($this->created_at)->toDateTimeString(),
            'updated_at' => optional($this->updated_at)->toDateTimeString(),
        ];
    }
}
