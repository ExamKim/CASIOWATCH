export function getEffectivePrice(item) {
    const price = Number(item?.price || 0);
    const salePrice = Number(item?.sale_price || 0);

    if (salePrice > 0 && salePrice < price) {
        return salePrice;
    }

    return price;
}