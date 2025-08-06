module.exports.explodeQuotes = (quotes) => {
    const rows = [];

    for (const q of quotes) {
        // if quote has no items, still emit one row so it isn't lost
        if (!q.items?.length) {
            rows.push({ ...q, items: undefined, files: undefined });
            continue;
        }

        q.items.forEach((item, idx) => {
            // Optionally blank quote columns after the first item so Excel looks tidy
            const quotePart = idx === 0 ? q : Object.fromEntries(
                Object.keys(q).map(k => [k, ''])
            );

            rows.push({
                ...quotePart,
                item_name: item.item_name || '',
                item_desc: item.qi_description || '',
                item_qty: item.qi_quantity ?? '',
                item_discount_type: item.qi_discount_type ?? '',
                item_discount_amount: item.qi_discount ?? '',
                item_tax_amount: item.qi_tax_amount ?? '',
                item_total: item.qi_amount ?? '',
                item_price: item.qi_rate ?? '',
                item_tax_id: item.qi_tax_id ?? '',

                items: undefined,
                files: undefined
            });
        });
    }

    return rows;
}
