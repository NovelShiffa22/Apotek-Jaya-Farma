<?php
$orderSearch = 'farida';
$q = \App\Models\Order::query()->where(function($q) use ($orderSearch) {
    $q->whereHas('user', function($uq) use ($orderSearch) {
        $uq->where('name', 'like', "%{$orderSearch}%");
    })->orWhereHas('statusHistories', function($hq) use ($orderSearch) {
        $hq->whereHas('changedByUser', function($cuq) use ($orderSearch) {
            $cuq->where('name', 'like', "%{$orderSearch}%");
        });
    });
});
echo "Count: " . $q->count() . "\n";
$first = $q->first();
if ($first) {
    echo "First Order ID: " . $first->id . "\n";
}
