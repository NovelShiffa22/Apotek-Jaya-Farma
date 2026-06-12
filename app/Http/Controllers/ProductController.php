<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Symptom;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk beserta kategorinya.
     */
    public function index(Request $request)
    {
        $categories = Category::all();
        $symptoms = Symptom::all();

        $catQuery = $request->input('category');
        $symQuery = $request->input('symptoms');
        $searchQuery = $request->input('search');
        $priceMin = $request->input('price_min');
        $priceMax = $request->input('price_max');

        $products = Product::with(['category', 'symptoms'])
            ->when($catQuery && $catQuery !== 'all', function ($q) use ($catQuery) {
                $q->whereHas('category', function ($q) use ($catQuery) {
                    $q->where('slug', $catQuery);
                });
            })
            ->when($symQuery, function ($q) use ($symQuery) {
                $symArray = is_array($symQuery) ? $symQuery : explode(',', $symQuery);
                $q->whereHas('symptoms', function ($q) use ($symArray) {
                    $q->whereIn('slug', $symArray);
                });
            })
            ->when($searchQuery, function ($q) use ($searchQuery) {
                $q->where('nama_obat', 'like', '%' . $searchQuery . '%');
            })
            ->when(!is_null($priceMin), function ($q) use ($priceMin) {
                $q->where('harga', '>=', $priceMin);
            })
            ->when(!is_null($priceMax), function ($q) use ($priceMax) {
                $q->where('harga', '<=', $priceMax);
            })
            ->get();
        
        $products = Product::attachSoldCounts($products);

        return Inertia::render('Catalog', [
            'products' => $products,
            'masterCategories' => $categories,
            'masterSymptoms' => $symptoms,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Menampilkan detail spesifik dari sebuah produk.
     */
    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return Inertia::render('ProductDetail', [
            'product' => $product
        ]);
    }

    /**
     * Menampilkan form untuk membuat produk baru.
     */
    public function create()
    {
        $categories = Category::all();
        $symptoms = Symptom::all();
        
        return Inertia::render('CreateProduct', [
            'categories' => $categories,
            'symptoms' => $symptoms
        ]);
    }

    /**
     * Menyimpan data produk baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_obat' => 'required|string|max:150',
            'category_id' => 'nullable|exists:categories,id',
            'deskripsi' => 'nullable|string',
            'jenis_obat' => 'required|in:bebas,keras,terbatas',
            'indikasi' => 'required|string',
            'aturan_pakai' => 'required|string',
            'efek_samping' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'boolean',
            'symptom_ids' => 'nullable|array',
            'symptom_ids.*' => 'exists:symptoms,id',
        ]);

        $validated['slug'] = Str::slug($request->nama_obat) . '-' . time();

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('products', 'public');
            $validated['gambar'] = $path;
        }

        // is_active default to true if not provided or parsing boolean
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        $product = Product::create(collect($validated)->except('symptom_ids')->toArray());

        if ($request->has('symptom_ids')) {
            $syncData = [];
            if (is_array($request->symptom_ids)) {
                foreach ($request->symptom_ids as $id) {
                    $syncData[$id] = ['bobot_relevansi' => 1.00];
                }
            }
            $product->symptoms()->sync($syncData);
        }

        return redirect()->route('admin.dashboard')->with('success', 'Produk berhasil ditambahkan');
    }

    /**
     * Menampilkan form untuk mengedit produk.
     */
    public function edit($id)
    {
        $product = Product::with('symptoms')->findOrFail($id);
        $categories = Category::all();
        $symptoms = Symptom::all();

        // format symptom_ids
        $product->symptom_ids = $product->symptoms->pluck('id')->toArray();

        return Inertia::render('CreateProduct', [
            'isEdit' => true,
            'initialData' => $product,
            'categories' => $categories,
            'symptoms' => $symptoms
        ]);
    }

    /**
     * Update data teks produk (tanpa gambar).
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'nama_obat' => 'required|string|max:150',
            'category_id' => 'nullable|exists:categories,id',
            'deskripsi' => 'nullable|string',
            'jenis_obat' => 'required|in:bebas,keras,terbatas',
            'indikasi' => 'required|string',
            'aturan_pakai' => 'required|string',
            'efek_samping' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'symptom_ids' => 'nullable|array',
            'symptom_ids.*' => 'exists:symptoms,id',
        ]);

        // Cek jika nama berubah, update slug
        if ($product->nama_obat !== $request->nama_obat) {
            $validated['slug'] = Str::slug($request->nama_obat) . '-' . time();
        }

        // Proses unggahan gambar
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($product->gambar && Storage::disk('public')->exists($product->gambar)) {
                Storage::disk('public')->delete($product->gambar);
            }

            $path = $request->file('gambar')->store('products', 'public');
            $validated['gambar'] = $path;
        } elseif ($request->boolean('delete_gambar')) {
            if ($product->gambar && Storage::disk('public')->exists($product->gambar)) {
                Storage::disk('public')->delete($product->gambar);
            }
            $validated['gambar'] = null;
        } else {
            // Jangan timpa (overwrite) gambar dengan null jika tidak ada file baru yang diunggah
            unset($validated['gambar']);
        }

        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : $product->is_active;

        $product->update(collect($validated)->except('symptom_ids')->toArray());

        if ($request->has('symptom_ids')) {
            $syncData = [];
            if (is_array($request->symptom_ids)) {
                foreach ($request->symptom_ids as $id) {
                    $syncData[$id] = ['bobot_relevansi' => 1.00];
                }
            }
            $product->symptoms()->sync($syncData);
        }

        return redirect()->route('admin.dashboard')->with('success', 'Data produk berhasil diperbarui');
    }

    /**
     * Endpoint khusus untuk update gambar produk via modal.
     */
    public function updateImage(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($product->gambar && Storage::disk('public')->exists($product->gambar)) {
                Storage::disk('public')->delete($product->gambar);
            }

            // Simpan gambar baru
            $path = $request->file('gambar')->store('products', 'public');
            
            $product->update(['gambar' => $path]);

            // Jika Frontend butuh JSON response untuk modal AJAX
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Gambar berhasil diperbarui',
                    'gambar_url' => asset('storage/' . $path)
                ]);
            }
        }

        return redirect()->back()->with('success', 'Gambar berhasil diperbarui');
    }

    /**
     * Menghapus produk (Soft Delete).
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus');
    }
}
