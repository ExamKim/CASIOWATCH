const STORAGE_KEY = "casio_guest_cart";

function readGuestCart() {
    if (typeof window === "undefined") return [];

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeGuestCart(items) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getGuestCart() {
    return readGuestCart();
}

export function addGuestCartItem(product, quantity = 1) {
    const items = readGuestCart();
    const existingIndex = items.findIndex((item) => String(item.product_id) === String(product.id));

    if (existingIndex >= 0) {
        const current = items[existingIndex];
        items[existingIndex] = {
            ...current,
            quantity: Number(current.quantity || 0) + Number(quantity || 1),
        };
    } else {
        items.push({
            product_id: product.id,
            name: product.name,
            price: Number(product.price || 0),
            image_url: product.image_url || "",
            quantity: Number(quantity || 1),
            brand: product.brand || "CASIO",
        });
    }

    writeGuestCart(items);
    return items;
}

export function updateGuestCartItem(productId, quantity) {
    const items = readGuestCart().map((item) => {
        if (String(item.product_id) !== String(productId)) return item;
        return { ...item, quantity: Number(quantity || 1) };
    });

    writeGuestCart(items);
    return items;
}

export function removeGuestCartItem(productId) {
    const items = readGuestCart().filter((item) => String(item.product_id) !== String(productId));
    writeGuestCart(items);
    return items;
}

export function clearGuestCart() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
}
