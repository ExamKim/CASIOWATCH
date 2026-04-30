import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import productsApi from "../api/productsApi";
import { addToast } from "../store/uiSlice";
import { normalizeApiError } from "../utils/apiError";
import SiteFooter from "../components/SiteFooter";
import "../styles/admin.css";

const initialForm = {
    name: "",
    category: "watch",
    gender: "unisex",
    brand: "CASIO",
    price: "",
    sale_price: "",
    stock: "0",
    status: "active",
};

export default function AdminProducts() {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialForm);

    const submitLabel = useMemo(() => (editingId ? "Cập nhật sản phẩm" : "Tạo sản phẩm"), [editingId]);

    const loadProducts = async () => {
        try {
            setStatus("loading");
            setError("");
            const res = await productsApi.getProducts({ page: 1, limit: 100 });
            setProducts(res.data?.data || []);
            setStatus("succeeded");
        } catch (err) {
            setStatus("failed");
            setError(normalizeApiError(err, "Không thể tải sản phẩm"));
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialForm);
        setEditingId(null);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                sale_price: formData.sale_price ? Number(formData.sale_price) : null,
                stock: Number(formData.stock || 0),
            };

            if (editingId) {
                await productsApi.updateProduct(editingId, payload);
                dispatch(addToast({ type: "success", message: "Cập nhật sản phẩm thành công" }));
            } else {
                await productsApi.createProduct(payload);
                dispatch(addToast({ type: "success", message: "Tạo sản phẩm thành công" }));
            }

            resetForm();
            loadProducts();
        } catch (err) {
            dispatch(addToast({ type: "error", message: normalizeApiError(err, "Lưu sản phẩm thất bại") }));
        }
    };

    const onEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name || "",
            category: product.category || "watch",
            gender: product.gender || "unisex",
            brand: product.brand || "CASIO",
            price: String(product.price ?? ""),
            sale_price: product.sale_price == null ? "" : String(product.sale_price),
            stock: String(product.stock ?? 0),
            status: product.status || "active",
        });
    };

    const onDelete = async (id) => {
        try {
            await productsApi.deleteProduct(id);
            dispatch(addToast({ type: "success", message: `Đã xóa sản phẩm #${id}` }));
            if (editingId === id) resetForm();
            loadProducts();
        } catch (err) {
            dispatch(addToast({ type: "error", message: normalizeApiError(err, "Xóa sản phẩm thất bại") }));
        }
    };

    return (
        <div className="admin-page">
            <section className="admin-hero">
                <p className="admin-kicker">Admin</p>
                <h1>Quản lý sản phẩm</h1>
                <p>Tạo, sửa, xóa sản phẩm để cập nhật danh mục bán hàng.</p>
            </section>

            <section className="admin-content">
                <form className="admin-product-form" onSubmit={onSubmit}>
                    <h2>{submitLabel}</h2>
                    <div className="admin-grid-form">
                        <input name="name" value={formData.name} onChange={onChange} placeholder="Tên sản phẩm" required />
                        <input name="brand" value={formData.brand} onChange={onChange} placeholder="Brand" required />
                        <input name="category" value={formData.category} onChange={onChange} placeholder="Category" required />
                        <input name="gender" value={formData.gender} onChange={onChange} placeholder="Gender" required />
                        <input name="price" type="number" value={formData.price} onChange={onChange} placeholder="Price" required />
                        <input name="sale_price" type="number" value={formData.sale_price} onChange={onChange} placeholder="Sale price" />
                        <input name="stock" type="number" value={formData.stock} onChange={onChange} placeholder="Stock" required />
                        <select name="status" value={formData.status} onChange={onChange}>
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                        </select>
                    </div>
                    <div className="admin-row-actions">
                        <button type="submit">{submitLabel}</button>
                        {editingId && (
                            <button type="button" onClick={resetForm}>
                                Huy sua
                            </button>
                        )}
                    </div>
                </form>

                {status === "loading" && <p className="admin-note">Đang tải sản phẩm...</p>}
                {status === "failed" && <p className="admin-error">{error}</p>}

                {status !== "loading" && products.length === 0 && (
                    <div className="admin-empty">Không có sản phẩm nào.</div>
                )}

                {products.length > 0 && (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.status || "active"}</td>
                                        <td>
                                            <div className="admin-row-actions">
                                                <button type="button" onClick={() => onEdit(product)}>Sua</button>
                                                <button type="button" onClick={() => onDelete(product.id)}>Xoa</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <SiteFooter />
        </div>
    );
}

