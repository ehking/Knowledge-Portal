<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Models\DocumentAccess;
use App\Models\DocumentTag;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('roles');
        $roleIds = $user->roles->pluck('id');

        $query = Document::with(['tags', 'accesses.role', 'creator'])
            ->whereHas('accesses', fn ($q) => $q->whereIn('role_id', $roleIds));

        if ($search = $request->query('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($tag = $request->query('tag')) {
            $query->whereHas('tags', fn ($q) => $q->where('tag', $tag));
        }

        $documents = $query->orderByDesc('created_at')->paginate(15);

        return DocumentResource::collection($documents);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'string'],
            'roles' => ['required', 'string'],
            'file' => ['required', 'file'],
        ]);

        $filePath = $request->file('file')->store('documents', 'public');

        $document = Document::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'] ?? null,
            'file_path' => $filePath,
            'created_by_user_id' => $request->user()->id,
        ]);

        $this->syncTagsAndRoles($document, $validated['tags'] ?? '', $validated['roles']);

        return (new DocumentResource($document->load(['tags', 'accesses.role', 'creator'])))->response()->setStatusCode(201);
    }

    public function show(Document $document, Request $request)
    {
        $this->authorizeDocument($document, $request);

        return new DocumentResource($document->load(['tags', 'accesses.role', 'creator']));
    }

    public function download(Document $document, Request $request)
    {
        $this->authorizeDocument($document, $request);

        return Storage::disk('public')->download($document->file_path);
    }

    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'string'],
            'roles' => ['nullable', 'string'],
            'file' => ['nullable', 'file'],
        ]);

        $document->loadMissing('tags', 'accesses.role');

        if ($request->hasFile('file')) {
            if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }

            $document->file_path = $request->file('file')->store('documents', 'public');
        }

        $document->fill($validated);
        $document->save();

        if (array_key_exists('tags', $validated) || array_key_exists('roles', $validated)) {
            $this->syncTagsAndRoles(
                $document,
                $validated['tags'] ?? $document->tags->pluck('tag')->implode(','),
                $validated['roles'] ?? $document->accesses->map(fn ($access) => optional($access->role)->name)->filter()->implode(',')
            );
        }

        return new DocumentResource($document->load(['tags', 'accesses.role', 'creator']));
    }

    public function destroy(Document $document)
    {
        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->tags()->delete();
        $document->accesses()->delete();
        $document->delete();

        return response()->json(['message' => 'Deleted']);
    }

    protected function authorizeDocument(Document $document, Request $request): void
    {
        $user = $request->user()->load('roles');
        $roleIds = $user->roles->pluck('id');

        $hasAccess = $document->accesses()->whereIn('role_id', $roleIds)->exists();

        if (! $hasAccess) {
            abort(403, 'Forbidden');
        }
    }

    protected function syncTagsAndRoles(Document $document, ?string $tags, string $roles): void
    {
        $document->tags()->delete();
        $document->accesses()->delete();

        $tagItems = collect(explode(',', (string) $tags))
            ->map(fn ($tag) => trim($tag))
            ->filter();

        foreach ($tagItems as $tag) {
            DocumentTag::create([
                'document_id' => $document->id,
                'tag' => $tag,
            ]);
        }

        $roleNames = collect(explode(',', $roles))->map(fn ($role) => trim($role))->filter();
        $roleModels = Role::whereIn('name', $roleNames)->get();

        if ($roleModels->isEmpty()) {
            throw ValidationException::withMessages([
                'roles' => ['At least one valid role is required.'],
            ]);
        }

        foreach ($roleModels as $role) {
            DocumentAccess::create([
                'document_id' => $document->id,
                'role_id' => $role->id,
            ]);
        }
    }
}
