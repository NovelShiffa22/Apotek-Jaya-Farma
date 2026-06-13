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
            ->select('products.*')
            ->selectRaw('(SELECT COALESCE(SUM(order_items.kuantitas), 0) FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE order_items.product_id = products.id AND orders.status IN ("diproses", "dikirim", "selesai")) as total_sold')
            ->when($catQuery && $catQuery !== 'all', function ($q) use ($catQuery) {
                $catArray = is_array($catQuery) ? $catQuery : explode(',', $catQuery);
                $catArray = array_filter($catArray, function ($slug) {
                    return $slug !== 'all';
                });
                if (!empty($catArray)) {
                    $q->whereHas('category', function ($q) use ($catArray) {
                        $q->whereIn('slug', $catArray);
                    });
                }
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
            ->paginate(12)
            ->withQueryString();
        
        foreach ($products->items() as $product) {
            $product->terjual = (int) $product->total_sold;
        }

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
        $stockHistories = \App\Models\ProductStockHistory::with('user')->where('product_id', $id)->orderBy('created_at', 'desc')->get();

        return Inertia::render('EditProduct', [
            'isEdit' => true,
            'initialData' => $product,
            'categories' => $categories,
            'symptoms' => $symptoms,
            'stockHistories' => $stockHistories
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



    /**
     * Menyesuaikan stok spesifik dari modal (+ Kelola Stok).
     */
    public function updateStock(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'action' => 'required|in:inbound_purchase,adjustment_damaged,adjustment_lost',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
            'supplier' => 'nullable|required_if:action,inbound_purchase|string|max:255',
            'buy_price' => 'nullable|required_if:action,inbound_purchase|numeric|min:0',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $product) {
            $type = $validated['action'];
            
            if ($type === 'inbound_purchase') {
                $product->stok += $validated['quantity'];
                if (isset($validated['buy_price']) && $validated['buy_price'] > 0) {
                    // Update the product's selling price if necessary, or just track it in history.
                    // $product->harga = max($product->harga, $validated['buy_price']); 
                }
            } else {
                // For damaged or lost
                if ($product->stok < $validated['quantity']) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'quantity' => 'Stok tidak cukup untuk dikurangi sebesar itu.'
                    ]);
                }
                $product->stok -= $validated['quantity'];
            }
            $product->save();

            \App\Models\ProductStockHistory::create([
                'product_id' => $product->id,
                'type' => $type,
                'quantity' => $validated['quantity'],
                'reason' => $validated['reason'],
                'supplier' => $type === 'inbound_purchase' ? ($validated['supplier'] ?? null) : null,
                'buy_price' => $type === 'inbound_purchase' ? ($validated['buy_price'] ?? null) : null,
                'user_id' => auth()->id(),
            ]);
        });

        return redirect()->back()->with('success', 'Penyesuaian stok berhasil disimpan.');
    }
}
