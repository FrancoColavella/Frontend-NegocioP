/* =========================================================
   NEGOCIOP - CATÁLOGO DINÁMICO + API
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /*
     * =====================================================
     * CONFIGURACIÓN API
     * =====================================================
     */

    const API_URL = "http://localhost:8080/api/productos";
    const CATEGORIES_API_URL = "http://localhost:8080/api/categorias";
    const VARIANTS_API_URL = "http://localhost:8080/api/variantes";
    const ORDERS_API_URL = "http://localhost:8080/api/pedidos";


    /*
     * =====================================================
     * ESTADO PRINCIPAL
     * =====================================================
     */

    let products = Array.isArray(STORE_CONFIG.products)
        ? STORE_CONFIG.products
        : [];

    let categories = Array.isArray(STORE_CONFIG.categories)
        ? STORE_CONFIG.categories
        : [];

    let cart = loadCart();

    let currentCategory = "all";
    let currentSearch = "";

    let selectedProduct = null;
    let selectedColor = null;
    let selectedSize = null;

    let selectedVariant = null;
    let productVariants = [];
    let productImages = [];


    /*
     * =====================================================
     * ELEMENTOS DOM
     * =====================================================
     */

    const elements = {

        storeLogo: document.getElementById("storeLogo"),
        mobileStoreName: document.getElementById("mobileStoreName"),
        footerLogo: document.getElementById("footerLogo"),
        copyrightName: document.getElementById("copyrightName"),

        desktopNav: document.getElementById("desktopNav"),
        mobileNav: document.getElementById("mobileNav"),
        footerCategories: document.getElementById("footerCategories"),

        categories: document.getElementById("categories"),

        productsGrid: document.getElementById("productsGrid"),
        emptyProducts: document.getElementById("emptyProducts"),

        categoryFilter: document.getElementById("categoryFilter"),

        searchButton: document.getElementById("searchButton"),
        searchOverlay: document.getElementById("searchOverlay"),
        closeSearch: document.getElementById("closeSearch"),
        searchInput: document.getElementById("searchInput"),

        menuButton: document.getElementById("menuButton"),
        mobileMenu: document.getElementById("mobileMenu"),
        closeMobileMenu: document.getElementById("closeMobileMenu"),

        productModal: document.getElementById("productModal"),
        closeProductModal: document.getElementById("closeProductModal"),

        modalProductImage: document.getElementById("modalProductImage"),
        modalImageThumbnails: document.getElementById("modalImageThumbnails"),
        modalProductCategory: document.getElementById("modalProductCategory"),
        modalProductName: document.getElementById("modalProductName"),
        modalProductPrice: document.getElementById("modalProductPrice"),
        modalProductDescription: document.getElementById("modalProductDescription"),

        colorSection: document.getElementById("colorSection"),
        colorOptions: document.getElementById("colorOptions"),
        selectedColorName: document.getElementById("selectedColorName"),

        sizeSection: document.getElementById("sizeSection"),
        sizeOptions: document.getElementById("sizeOptions"),
        selectedSizeName: document.getElementById("selectedSizeName"),

        modalStockMessage: document.getElementById("modalStockMessage"),

        addToCartButton: document.getElementById("addToCartButton"),

        cartButton: document.getElementById("cartButton"),
        cartCount: document.getElementById("cartCount"),

        cartOverlay: document.getElementById("cartOverlay"),
        cartDrawer: document.getElementById("cartDrawer"),
        closeCart: document.getElementById("closeCart"),

        cartItems: document.getElementById("cartItems"),
        emptyCart: document.getElementById("emptyCart"),
        cartFooter: document.getElementById("cartFooter"),

        cartTotal: document.getElementById("cartTotal"),
        checkoutButton: document.getElementById("checkoutButton"),

        checkoutOverlay: document.getElementById("checkoutOverlay"),
        closeCheckout: document.getElementById("closeCheckout"),

        checkoutForm: document.getElementById("checkoutForm"),
        checkoutFormView: document.getElementById("checkoutFormView"),

        checkoutSummary: document.getElementById("checkoutSummary"),
        checkoutError: document.getElementById("checkoutError"),
        checkoutSubmit: document.getElementById("checkoutSubmit"),

        checkoutSuccess: document.getElementById("checkoutSuccess"),
        checkoutOrderId: document.getElementById("checkoutOrderId"),
        checkoutSuccessTotal: document.getElementById("checkoutSuccessTotal"),
        closeCheckoutSuccess: document.getElementById("closeCheckoutSuccess"),

        continueShopping: document.getElementById("continueShopping"),

        clearFilters: document.getElementById("clearFilters"),

        toast: document.getElementById("toast"),
        toastMessage: document.getElementById("toastMessage"),

        heroLabel: document.getElementById("heroLabel"),
        heroTitle: document.getElementById("heroTitle"),
        heroDescription: document.getElementById("heroDescription"),
        heroButton: document.getElementById("heroButton"),

        footerDescription: document.getElementById("footerDescription"),

        instagramLink: document.getElementById("instagramLink"),
        facebookLink: document.getElementById("facebookLink"),

        currentYear: document.getElementById("currentYear")
    };


    /*
     * =====================================================
     * INICIALIZACIÓN
     * =====================================================
     */

    initializeStore();

    initializeEvents();


    /*
     * Primero cargamos las categorías
     * desde Spring Boot.
     */

    await loadCategoriesFromAPI();


    /*
     * Después cargamos los productos
     * desde Spring Boot.
     */

    await loadProductsFromAPI();


    /*
     * Una vez cargados ambos datos,
     * renderizamos el catálogo.
     */

    renderNavigation();
    renderCategories();
    renderCatalog();

    updateCartUI();


    /*
     * =====================================================
     * CARGAR CATEGORÍAS DESDE SPRING BOOT
     * =====================================================
     */

    async function loadCategoriesFromAPI() {

        try {

            console.log(
                "Consultando categorías en:",
                CATEGORIES_API_URL
            );


            const response =
                await fetch(CATEGORIES_API_URL);


            if (!response.ok) {

                throw new Error(
                    `Error HTTP: ${response.status}`
                );

            }


            const categoriesFromAPI =
                await response.json();


            if (!Array.isArray(categoriesFromAPI)) {

                throw new Error(
                    "La API no devolvió un array de categorías"
                );

            }


            console.log(
                "Categorías cargadas desde API:",
                categoriesFromAPI
            );


            /*
             * IMPORTANTE:
             * Ahora actualizamos la variable
             * categories que realmente utiliza
             * el resto del frontend.
             */

            categories =
                categoriesFromAPI
                    .filter(category => category.activa)
                    .map(category => ({
                        id: category.id,
                        name: category.nombre,
                        description: category.descripcion || ""
                    }));


            /*
             * También mantenemos STORE_CONFIG
             * actualizado como respaldo.
             */

            STORE_CONFIG.categories =
                categories;


            console.log(
                "Categorías disponibles para el frontend:",
                categories
            );


            return true;


        } catch (error) {

            console.error(
                "No se pudieron cargar las categorías desde la API:",
                error
            );


            /*
             * Si falla la API,
             * seguimos utilizando las categorías
             * originales de config.js.
             */

            categories =
                Array.isArray(STORE_CONFIG.categories)
                    ? STORE_CONFIG.categories
                    : [];


            return false;

        }

    }


    /*
     * =====================================================
     * CARGAR PRODUCTOS DESDE SPRING BOOT
     * =====================================================
     */

    async function loadProductsFromAPI() {

        try {

            console.log(
                "Consultando productos en:",
                API_URL
            );


            const response =
                await fetch(API_URL);


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const apiProducts =
                await response.json();


            if (!Array.isArray(apiProducts)) {

                throw new Error(
                    "La API no devolvió un array de productos"
                );

            }


            /*
             * Transformamos los productos
             * del backend al formato que
             * utiliza nuestra plantilla.
             */

            products =
                apiProducts.map(apiProduct => {

                    /*
                     * Buscamos si este producto
                     * ya existe en config.js.
                     *
                     * Esto nos permite conservar
                     * temporalmente imágenes,
                     * colores, talles y badges.
                     */

                    const localProduct =
                        STORE_CONFIG.products?.find(
                            product =>
                                Number(product.id) ===
                                Number(apiProduct.id)
                        );


                    /*
                     * Categoría REAL proveniente
                     * de MySQL.
                     */

                    const categoryId =
                        apiProduct.categoria?.id ??
                        localProduct?.category ??
                        categories[0]?.id ??
                        "general";


                    /*
                     * Datos del backend + datos
                     * visuales temporales de config.js.
                     */

                    return {

                        ...(localProduct || {}),

                        /*
                         * Datos provenientes
                         * directamente de MySQL
                         */

                        id: apiProduct.id,

                        name: apiProduct.nombre,

                        description:
                            apiProduct.descripcion || "",

                        price:
                            Number(apiProduct.precio) || 0,

                        visible:
                            apiProduct.visible,

                        available:
                            apiProduct.disponible,


                        /*
                         * AHORA LA CATEGORÍA
                         * VIENE DE MYSQL.
                         */

                        category:
                            categoryId,


                        /*
                         * Imagen genérica si todavía
                         * no tenemos una imagen configurada.
                         */

                        image:
                            localProduct?.image ||
                            "https://placehold.co/800x1000?text=Producto"

                    };

                });


            console.log(
                "Productos cargados desde API:",
                products
            );


        } catch (error) {

            /*
             * Si la API falla,
             * mantenemos los productos
             * de config.js.
             */

            console.error(
                "No se pudieron cargar los productos desde la API:",
                error
            );


            console.warn(
                "Se utilizarán temporalmente los productos de config.js"
            );

        }

    }

    /*
     * =====================================================
     * CARGAR VARIANTES DESDE SPRING BOOT
     * =====================================================
     */

    async function loadProductVariants(productId) {

        try {

            console.log(
                `Consultando variantes del producto ${productId} en:`,
                `${VARIANTS_API_URL}/producto/${productId}`
            );

            const response =
                await fetch(
                    `${VARIANTS_API_URL}/producto/${productId}`
            );

            if (!response.ok) {

                throw new Error(
                    `Error HTTP: ${response.status}`
                );

            }

            const variants =
                await response.json();

            if (!Array.isArray(variants)) {

                throw new Error(
                    "La API no devolvió un array de variantes"
                );

            }

            console.log(
                `Variantes del producto ${productId}:`,
                variants
            );

            return variants;

        } catch (error) {

            console.error(
                `No se pudieron cargar las variantes del producto ${productId}:`,
                error
            );

            return [];

        }

    }

    async function loadProductImages(productId) {

        try {

            console.log(
                `Consultando imágenes del producto ${productId}:`,
                `http://localhost:8080/api/productos/${productId}/imagenes`
            );

            const response = await fetch(
                `http://localhost:8080/api/productos/${productId}/imagenes`
            );

            if (!response.ok) {

                throw new Error(
                    `Error HTTP: ${response.status}`
                );

            }

            const images = await response.json();

            if (!Array.isArray(images)) {

                throw new Error(
                    "La API no devolvió un array de imágenes"
                );

            }

            console.log(
                `Imágenes del producto ${productId}:`,
                images
            );

            return images;

        } catch (error) {

            console.error(
                `No se pudieron cargar las imágenes del producto ${productId}:`,
                error
            );

            return [];

        }

    }

    function renderModalImageGallery(images) {

        const container =
            elements.modalImageThumbnails;

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (!images || images.length === 0) {

            container.style.display = "none";

            return;
        }

        container.style.display = "flex";

        const orderedImages =
            [...images].sort(
                (a, b) =>
                    Number(a.orden || 0) -
                    Number(b.orden || 0)
            );

        orderedImages.forEach(
            (image, index) => {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "modal-image-thumbnail";

                if (index === 0) {

                    button.classList.add(
                        "selected"
                    );

                }

                button.innerHTML = `
                    <img
                        src="${escapeAttribute(image.url)}"
                        alt="Imagen ${index + 1}"
                    >
                `;

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".modal-image-thumbnail"
                            )
                            .forEach(
                                thumbnail =>
                                    thumbnail.classList.remove(
                                        "selected"
                                    )
                            );

                        button.classList.add(
                            "selected"
                        );

                        changeModalImage(
                            image.url
                        );

                    }
                );

                container.appendChild(
                    button
                );

            }
        );

    }


    // Construir opciones de producto a partir de variantes
    function buildProductOptionsFromVariants(variants) {

        const colorsMap = new Map();

        variants.forEach(variant => {

            const color = variant.color;
            const talle = variant.talle;

            if (!color || !talle) {
                return;
            }

            if (!colorsMap.has(color.id)) {

                colorsMap.set(color.id, {
                    id: color.id,
                    name: color.nombre,
                    hex: color.codigoHex,
                    sizes: []
                });

            }

            const currentColor =
                colorsMap.get(color.id);

            const existingSize =
                currentColor.sizes.find(
                    size => size.id === talle.id
                );

            if (!existingSize) {

                currentColor.sizes.push({
                    id: talle.id,
                    name: talle.nombre,
                    variantId: variant.id,
                    stock: Number(variant.stock) || 0,
                    available:
                    Number(variant.stock) > 0
                });

            }

        });

        return Array.from(colorsMap.values());

    }


    /*
     * =====================================================
     * CONFIGURACIÓN DEL NEGOCIO
     * =====================================================
     */

    function initializeStore() {

        const store = STORE_CONFIG.store || {};

        const storeName =
            store.name || "NOVA";


        document.title =
            `${storeName} | Tienda`;


        elements.storeLogo.textContent =
            store.logo || storeName;


        elements.mobileStoreName.textContent =
            store.logo || storeName;


        elements.footerLogo.textContent =
            store.logo || storeName;


        elements.copyrightName.textContent =
            storeName;


        elements.footerDescription.textContent =
            store.description || "";


        elements.heroLabel.textContent =
            store.hero?.label ||
            "NUEVA COLECCIÓN";


        elements.heroTitle.innerHTML =
            store.hero?.title ||
            "Vestite<br>diferente.";


        elements.heroDescription.textContent =
            store.hero?.description ||
            "Descubrí nuestra nueva colección.";


        elements.heroButton.textContent =
            store.hero?.buttonText ||
            "Ver colección";


        if (store.instagram) {

            elements.instagramLink.href =
                store.instagram;

        } else {

            elements.instagramLink.style.display =
                "none";

        }


        if (store.facebook) {

            elements.facebookLink.href =
                store.facebook;

        } else {

            elements.facebookLink.style.display =
                "none";

        }


        elements.currentYear.textContent =
            new Date().getFullYear();

    }


    /*
     * =====================================================
     * NAVEGACIÓN
     * =====================================================
     */

    function renderNavigation() {

        elements.desktopNav.innerHTML = "";

        elements.mobileNav.innerHTML = "";


        categories.forEach(category => {

            const desktopLink =
                document.createElement("a");


            desktopLink.href =
                "#catalog";


            desktopLink.textContent =
                category.name;


            desktopLink.dataset.category =
                category.id;


            desktopLink.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    selectCategory(category.id);

                }
            );


            elements.desktopNav.appendChild(
                desktopLink
            );


            const mobileLink =
                document.createElement("a");


            mobileLink.href =
                "#catalog";


            mobileLink.textContent =
                category.name;


            mobileLink.dataset.category =
                category.id;


            mobileLink.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    selectCategory(category.id);

                    closeMobileMenu();

                }
            );


            elements.mobileNav.appendChild(
                mobileLink
            );

        });


        /*
         * Footer
         */

        elements.footerCategories.innerHTML = "";


        categories.forEach(category => {

            const link =
                document.createElement("a");


            link.href =
                "#catalog";


            link.textContent =
                category.name;


            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    selectCategory(
                        category.id
                    );


                    document
                        .getElementById("catalog")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );


            elements.footerCategories.appendChild(
                link
            );

        });


        /*
         * Select
         */

        elements.categoryFilter.innerHTML = `
            <option value="all">
                Todas las categorías
            </option>
        `;


        categories.forEach(category => {

            const option =
                document.createElement("option");


            option.value =
                category.id;


            option.textContent =
                category.name;


            elements.categoryFilter.appendChild(
                option
            );

        });

    }


    /*
     * =====================================================
     * CATEGORÍAS
     * =====================================================
     */

    function renderCategories() {

        elements.categories.innerHTML = "";


        categories.forEach((category, index) => {

            const card =
                document.createElement("button");


            card.className =
                "category-card";


            card.type =
                "button";


            card.innerHTML = `
                <span class="category-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <h3>
                    ${escapeHTML(category.name)}
                </h3>

                <p>
                    ${escapeHTML(category.description || "")}
                </p>
            `;


            card.addEventListener(
                "click",
                () => {

                    selectCategory(
                        category.id
                    );


                    document
                        .getElementById("catalog")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );


            elements.categories.appendChild(
                card
            );

        });

    }


    /*
     * =====================================================
     * PRODUCTOS
     * =====================================================
     */

    function renderCatalog() {

        const filteredProducts =
            getFilteredProducts();


        elements.productsGrid.innerHTML = "";


        if (filteredProducts.length === 0) {

            elements.emptyProducts.classList.add(
                "visible"
            );

            return;

        }


        elements.emptyProducts.classList.remove(
            "visible"
        );


        filteredProducts.forEach(product => {

            const card =
                createProductCard(product);


            elements.productsGrid.appendChild(
                card
            );

        });


        updateNavigationActiveState();

    }


    function getFilteredProducts() {

        return products.filter(product => {

            /*
             * Productos ocultos nunca aparecen
             */

            if (product.visible === false) {

                return false;

            }


            /*
             * Categoría
             */

            const categoryMatch =
                currentCategory === "all" ||
                String(product.category) ===
                    String(currentCategory);


            /*
             * Búsqueda
             */

            const searchText =
                currentSearch
                    .toLowerCase()
                    .trim();


            if (!searchText) {

                return categoryMatch;

            }


            const categoryName =
                getCategoryName(
                    product.category
                );


            const searchableText = [

                product.name,

                product.description,

                categoryName

            ]
                .join(" ")
                .toLowerCase();


            const searchMatch =
                searchableText.includes(
                    searchText
                );


            return (
                categoryMatch &&
                searchMatch
            );

        });

    }


    function createProductCard(product) {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        if (product.available === false) {

            card.classList.add(
                "unavailable"
            );

        }


        const image =
            getFirstAvailableImage(
                product
            );


        const categoryName =
            getCategoryName(
                product.category
            );


        const colorsHTML =
            getProductColorDots(
                product
            );


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(product.name)}"
                    loading="lazy"
                >

                <div class="product-overlay"></div>

                ${
                    product.available === false
                        ? `
                            <span class="product-badge sold-out">
                                AGOTADO
                            </span>
                        `
                        : product.badge
                            ? `
                                <span class="product-badge">
                                    ${escapeHTML(product.badge)}
                                </span>
                            `
                            : ""
                }

            </div>

            <div class="product-info">

                <div class="product-category">
                    ${escapeHTML(categoryName)}
                </div>

                <div class="product-name">
                    ${escapeHTML(product.name)}
                </div>

                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>

                ${
                    colorsHTML
                        ? `
                            <div class="product-colors">
                                ${colorsHTML}
                            </div>
                        `
                        : ""
                }

            </div>
        `;


        card.addEventListener(
            "click",
            () => {

                openProductModal(product);

            }
        );


        return card;

    }


    /*
     * =====================================================
     * PRODUCT MODAL
     * =====================================================
     */

    async function openProductModal(product) {

        selectedProduct =
            product;


        selectedColor =
            null;


        selectedSize =
            null;

        selectedVariant = null;

        productVariants = await loadProductVariants(product.id);

        const apiOptions =
            buildProductOptionsFromVariants(productVariants);

        if (apiOptions.length > 0) {

            apiOptions.forEach(color => {

                color.images =
                    productImages.filter(
                        image =>
                            Number(image.color?.id) ===
                            Number(color.id)
                    );

            });

            product.apiOptions =
                apiOptions;

            product.colors =
                apiOptions;

        }

        productImages =
            await loadProductImages(product.id);

        console.log(
            "Opciones construidas desde variantes:",
            apiOptions
        );


        elements.modalProductCategory.textContent =
            getCategoryName(
                product.category
            );


        elements.modalProductName.textContent =
            product.name;


        elements.modalProductPrice.textContent =
            formatPrice(
                product.price
            );


        elements.modalProductDescription.textContent =
            product.description || "";


        /*
         * Imagen inicial
         */

        const firstImage =
            getFirstAvailableImage(
                product
            );


        elements.modalProductImage.src =
            firstImage;


        elements.modalProductImage.alt =
            product.name;


        /*
         * Producto agotado
         */

        if (product.available === false) {

            elements.modalStockMessage.textContent =
                "Este producto está agotado.";


            elements.addToCartButton.disabled =
                true;

        } else {

            elements.modalStockMessage.textContent =
                "";

        }


        /*
         * Colores
         */

        renderColorOptions();


        /*
         * Talles
         */

        renderSizeOptions();


        /*
         * Mostrar modal
         */

        elements.productModal.classList.add(
            "open"
        );


        document.body.classList.add(
            "no-scroll"
        );


        /*
         * Seleccionar automáticamente
         * el primer color disponible
         */

        if (product.available !== false) {

            const firstColor =
                getAvailableColors(
                    product
                )[0];


            if (firstColor) {

                selectColor(
                    firstColor.name
                );

            } else {

                renderSizeOptions();

                updateAddButtonState();

            }

        } else {

            updateAddButtonState();

        }

    }


    function closeProductModal() {

        elements.productModal.classList.remove(
            "open"
        );


        document.body.classList.remove(
            "no-scroll"
        );


        selectedProduct =
            null;


        selectedColor =
            null;


        selectedSize =
            null;

    }


    /*
     * =====================================================
     * COLORES
     * =====================================================
     */


    function renderColorOptions() {

        elements.colorOptions.innerHTML = "";

        if (!selectedProduct) {
            elements.colorSection.style.display = "none";
            return;
        }

        const colors =
            Array.isArray(selectedProduct.apiOptions) &&
            selectedProduct.apiOptions.length > 0
                ? selectedProduct.apiOptions
                : selectedProduct.colors || [];

        if (!colors.length) {

            elements.colorSection.style.display =
                "none";

            return;
        }

        elements.colorSection.style.display =
            "block";

        colors.forEach(color => {

            const button =
                document.createElement("button");

            button.type =
                "button";

            button.className =
                "color-option";

            const colorAvailable =
                color.available !== false &&
                (
                    !Array.isArray(color.sizes) ||
                    color.sizes.some(
                        size => size.available !== false
                    )
                );

            if (!colorAvailable) {

                button.classList.add(
                    "disabled"
                );

            }

            button.innerHTML = `
                <span
                    style="background:${escapeAttribute(
                        color.hex || "#ccc"
                    )}"
                ></span>
            `;

            button.title =
                colorAvailable
                    ? color.name
                    : `${color.name} - Agotado`;

            if (
                selectedColor?.name ===
                color.name
            ) {

                button.classList.add(
                    "selected"
                );

            }

            if (colorAvailable) {

                button.addEventListener(
                    "click",
                    () => {

                        selectColor(
                            color.name
                        );

                    }
                );

            }

            elements.colorOptions.appendChild(
                button
            );

        });

        elements.selectedColorName.textContent =
            selectedColor?.name || "";

    }




    /**
     * =====================================================
     * COLORES
     * =====================================================
     */
    function selectColor(colorName) {

        if (!selectedProduct) {
            return;
        }

        const color =
            selectedProduct.colors.find(
                item =>
                    item.name === colorName
            );

        if (
            !color ||
            color.available === false
        ) {
            return;
        }

        selectedColor =
            color;

        selectedSize =
            null;

        const colorImages =
            productImages
                .filter(
                    image =>
                        Number(image.color?.id) ===
                        Number(color.id)
                )
                .sort(
                    (a, b) =>
                        Number(a.orden || 0) -
                        Number(b.orden || 0)
                );

        if (colorImages.length > 0) {

            changeModalImage(
                colorImages[0].url
            );

            renderModalImageGallery(
                colorImages
            );

        } else {

            renderModalImageGallery([]);

        }

        elements.selectedColorName.textContent =
            color.name;

        renderColorOptions();

        renderSizeOptions();

        updateAddButtonState();

    }


    /*
     * =====================================================
     * TALLES
     * =====================================================
     */

    
    function renderSizeOptions() {

        elements.sizeOptions.innerHTML = "";

        if (!selectedProduct) {
            return;
        }

        let sizes = [];

        if (selectedColor) {

            sizes =
            selectedColor.sizes || [];

        } else if (
            Array.isArray(
                selectedProduct.sizes
            )
        ) {

            sizes =
                selectedProduct.sizes;

        }

        if (!sizes.length) {

            elements.sizeSection.style.display =
                "none";

            elements.selectedSizeName.textContent =
                "";

            return;
        }

        elements.sizeSection.style.display =
            "block";

        sizes.forEach(size => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "size-option";

            button.textContent =
                size.name;

            const available =
                size.available !== false &&
                (
                    size.stock === undefined ||
                    Number(size.stock) > 0
                );

            if (!available) {

                button.classList.add(
                    "disabled"
                );

                button.title =
                    "Sin stock";

            }

            if (
                selectedSize?.name ===
                size.name
            ) {

                button.classList.add(
                    "selected"
                );

            }

            if (available) {

                button.addEventListener(
                    "click",
                    () => {

                        selectSize(
                            size.name
                        );

                    }
                );
            
            }

            elements.sizeOptions.appendChild(
                button
            );

        });

        elements.selectedSizeName.textContent =
            selectedSize?.name || "";

    }

    // JavaScript function for selecting a size
    function selectSize(sizeName) {

        if (!selectedProduct) {
            return;
        }

        let sizes = [];

        if (selectedColor) {

            sizes =
                selectedColor.sizes || [];

        } else {

            sizes =
                selectedProduct.sizes || [];

        }

        const size =
            sizes.find(
                item =>
                    item.name === sizeName
            );

        if (!size) {
            return;
        }

        if (
            size.available === false
        ) {
            return;
        }

        if (
            size.stock !== undefined &&
            Number(size.stock) <= 0
        ) {
            return;
        }

        selectedSize =
            size;

        /*
        * La variante real viene
        * directamente desde la API.
        */
        if (size.variantId) {

            selectedVariant =
                productVariants.find(
                    variant =>
                        Number(variant.id) ===
                        Number(size.variantId)
                ) || null;

        } else {

            selectedVariant =
                null;

        }

        elements.selectedSizeName.textContent =
            size.name;

        renderSizeOptions();

        updateAddButtonState();

        }


    /*
     * =====================================================
     * VALIDACIÓN
     * =====================================================
     */


    function updateAddButtonState() {

        if (!selectedProduct) {

            elements.addToCartButton.disabled =
                true;

            return;
        }

        if (
            selectedProduct.available === false
        ) {

            elements.addToCartButton.disabled =
                true;

            elements.modalStockMessage.textContent =
                "Este producto está agotado.";

            return;
        }

        const usesAPI =
            Array.isArray(
                selectedProduct.apiOptions
            ) &&
            selectedProduct.apiOptions.length > 0;

        /*
            * =====================================================
            * PRODUCTO CON VARIANTES REALES
            * =====================================================
            */

        if (usesAPI) {

            if (!selectedColor) {

                elements.addToCartButton.disabled =
                    true;

                elements.modalStockMessage.textContent =
                    "Seleccioná un color.";

                return;
            }

            if (!selectedSize) {

                elements.addToCartButton.disabled =
                    true;

                elements.modalStockMessage.textContent =
                    "Seleccioná un talle.";

                return;
            }

            if (!selectedVariant) {

                elements.addToCartButton.disabled =
                    true;

                elements.modalStockMessage.textContent =
                    "La combinación seleccionada no está disponible.";

                return;
            }

            const stock =
                Number(
                    selectedVariant.stock
                ) || 0;

            if (stock <= 0) {

                elements.addToCartButton.disabled =
                    true;

                elements.modalStockMessage.textContent =
                    "Sin stock.";

                return;
            }

            elements.modalStockMessage.textContent =
                `Stock disponible: ${stock}`;

            elements.addToCartButton.disabled =
                false;

            return;
        }

        /*
            * =====================================================
            * COMPATIBILIDAD CON PRODUCTOS ANTIGUOS
            * =====================================================
            */

        const requiresColor =
            Array.isArray(
                selectedProduct.colors
            ) &&
            selectedProduct.colors.length > 0;

        if (
            requiresColor &&
            !selectedColor
        ) {

            elements.addToCartButton.disabled =
                true;

            elements.modalStockMessage.textContent =
                "Seleccioná un color.";

            return;
        }

        const sizes =
            selectedColor?.sizes ||
            selectedProduct.sizes ||
            [];

        const availableSizes =
            sizes.filter(
                size =>
                    size.available !== false
            );

        if (
            availableSizes.length > 0 &&
            !selectedSize
        ) {

            elements.addToCartButton.disabled =
                true;

            elements.modalStockMessage.textContent =
                "Seleccioná un talle.";

            return;
        }

        elements.modalStockMessage.textContent =
            "";

        elements.addToCartButton.disabled =
            false;

    }




    /*
     * =====================================================
     * CAMBIO DE IMAGEN
     * =====================================================
     */

    function changeModalImage(imageUrl) {

        if (!imageUrl) {

            return;

        }


        elements.modalProductImage.classList.add(
            "changing"
        );


        setTimeout(() => {

            elements.modalProductImage.src =
                imageUrl;


            elements.modalProductImage.alt =
                selectedProduct?.name || "";


            elements.modalProductImage.classList.remove(
                "changing"
            );

        }, 120);

    }


    /*
     * =====================================================
     * CARRITO
     * =====================================================
     */

    function addToCart() {

        if (!selectedProduct) {
            return;
        }

        if (!selectedColor || !selectedSize) {
            return;
        }

        if (!selectedVariant) {
            alert(
                "La variante seleccionada no está disponible."
            );
            return;
        }

        const stock =
            Number(selectedVariant.stock) || 0;

        if (stock <= 0) {
            alert(
                "Esta variante no tiene stock disponible."
            );
            return;
        }

        /*
        * Guardamos estos datos antes de cerrar
        * el modal porque closeProductModal()
        * limpia selectedProduct, selectedColor
        * y selectedSize.
        */
        const productName =
            selectedProduct.name;

        const productId =
            selectedProduct.id;

        const productPrice =
            selectedProduct.price;

        const colorName =
            selectedColor.name;

        const sizeName =
            selectedSize.name;

        const variantId =
            selectedVariant.id;

        const selectedColorData =
            selectedProduct.colors?.find(
                color => color.name === colorName
            );

        const productImage =
            selectedColorData?.image ||
            selectedProduct.image ||
            "";

        /*
        * Cada variante tiene su propio cartId.
        *
        * Ejemplo:
        * Producto 1 + variante 4
        * Producto 1 + variante 6
        *
        * Son dos elementos diferentes del carrito.
        */
        const cartId =
            `${productId}-${variantId}`;

        const existingItem =
            cart.find(
                item =>
                    item.cartId === cartId
            );

        if (existingItem) {

            if (
                existingItem.quantity >=
                stock
            ) {

                alert(
                    `No hay más stock disponible. Stock máximo: ${stock}`
                );

                return;
            }

            existingItem.quantity++;

        } else {

            cart.push({

                cartId:

                    cartId,

                productId:

                    productId,

                variantId:

                    variantId,

                name:

                    productName,

                price:

                    productPrice,

                color:

                    colorName,

                size:

                    sizeName,

                image:

                    productImage,

                quantity: 1

            });

        }

        saveCart();

        updateCartUI();

        /*
        * Guardamos el mensaje antes de cerrar
        * el modal para evitar depender de
        * selectedProduct después.
        */
        const toastMessage =
            `${productName} agregado al carrito`;

        closeProductModal();

        showToast(
            toastMessage
        );
    }






    function updateCartUI() {

        const totalItems =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );


        elements.cartCount.textContent =
            totalItems;


        renderCartItems();


        const total =
            calculateCartTotal();


        elements.cartTotal.textContent =
            formatPrice(total);


        if (cart.length === 0) {

            elements.cartDrawer.classList.add(
                "cart-empty"
            );

        } else {

            elements.cartDrawer.classList.remove(
                "cart-empty"
            );

        }

    }


    function renderCartItems() {

        elements.cartItems.innerHTML = "";


        if (cart.length === 0) {

            elements.emptyCart.classList.add(
                "visible"
            );

            return;

        }


        elements.emptyCart.classList.remove(
            "visible"
        );


        cart.forEach(item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "cart-item";


            const variantText = [

                item.color
                    ? `Color: ${item.color}`
                    : "",

                item.size
                    ? `Talle: ${item.size}`
                    : ""

            ]
                .filter(Boolean)
                .join(" · ");


            element.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${escapeAttribute(item.image)}"
                        alt="${escapeAttribute(item.name)}"
                    >

                </div>

                <div class="cart-item-info">

                    <div class="cart-item-name">
                        ${escapeHTML(item.name)}
                    </div>

                    <div class="cart-item-variant">
                        ${escapeHTML(variantText)}
                    </div>

                    <div class="cart-item-price">
                        ${formatPrice(item.price)}
                    </div>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            data-action="decrease"
                            data-id="${escapeAttribute(item.cartId)}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            data-action="increase"
                            data-id="${escapeAttribute(item.cartId)}"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-cart-item"
                    type="button"
                    data-action="remove"
                    data-id="${escapeAttribute(item.cartId)}"
                    aria-label="Eliminar"
                >
                    ×
                </button>

            `;


            elements.cartItems.appendChild(
                element
            );

        });

    }


    async function changeQuantity(
        cartId,
        amount
    ) {

        const item =
            cart.find(
                item =>
                    item.cartId === cartId
            );

        if (!item) {
            return;
        }

        /*
        * Si estamos disminuyendo,
        * no necesitamos consultar la API.
        */
        if (amount < 0) {

            item.quantity += amount;

            if (item.quantity <= 0) {

                cart =
                    cart.filter(
                        cartItem =>
                            cartItem.cartId !== cartId
                    );

            }

            saveCart();

            updateCartUI();

            return;
        }

        /*
        * Si estamos aumentando,
        * necesitamos comprobar el stock real
        * de la variante en el backend.
        */
        if (!item.variantId) {

            console.warn(
                "El producto no tiene variantId:",
                item
            );

            return;
        }

        try {

            const response =
                await fetch(
                    `${VARIANTS_API_URL}/${item.variantId}`
                );

            if (!response.ok) {

                throw new Error(
                    `Error HTTP: ${response.status}`
                );

            }

            const variant =
                await response.json();

            const stock =
                Number(variant.stock) || 0;

            /*
            * La cantidad que ya tenemos
            * en el carrito no puede superar
            * el stock real.
            */
            if (item.quantity >= stock) {

                alert(
                    `No hay más stock disponible. Stock actual: ${stock}`
                );

                return;
            }

            /*
            * Hay stock suficiente.
            */
            item.quantity += amount;

            saveCart();

            updateCartUI();

        } catch (error) {

            console.error(
                "No se pudo verificar el stock:",
                error
            );

            alert(
                "No se pudo verificar el stock. Intentá nuevamente."
            );

        }

    }


    function removeFromCart(cartId) {

        cart =
            cart.filter(
                item =>
                    item.cartId !== cartId
            );


        saveCart();

        updateCartUI();

    }


    function calculateCartTotal() {

        return cart.reduce(
            (total, item) => {

                return total +
                    (
                        item.price *
                        item.quantity
                    );

            },
            0
        );

    }


    /*
 * =====================================================
 * CHECKOUT
 * =====================================================
 */

    function openCheckout() {

        if (cart.length === 0) {

            showToast(
                "El carrito está vacío"
            );

            return;
        }

        renderCheckoutSummary();

        elements.checkoutError.textContent = "";

        elements.checkoutFormView.style.display =
            "block";

        elements.checkoutSuccess.classList.remove(
            "visible"
        );

        elements.checkoutOverlay.classList.add(
            "open"
        );

        document.body.classList.add(
            "no-scroll"
        );
    }


    function closeCheckout() {

        elements.checkoutOverlay.classList.remove(
            "open"
        );

        document.body.classList.remove(
            "no-scroll"
        );

    }


    function renderCheckoutSummary() {

        if (cart.length === 0) {

            elements.checkoutSummary.innerHTML =
                "<p>El carrito está vacío.</p>";

            return;
        }

        elements.checkoutSummary.innerHTML =
            cart.map(item => {

                const subtotal =
                    Number(item.price) *
                    Number(item.quantity);

                return `
                    <div class="checkout-summary-item">

                        <div>

                            <strong>
                                ${escapeHTML(item.name)}
                            </strong>

                            <span>
                                ${
                                    item.color
                                        ? `Color: ${escapeHTML(item.color)}`
                                        : ""
                                }

                                ${
                                    item.size
                                        ? ` · Talle: ${escapeHTML(item.size)}`
                                        : ""
                                }
                            </span>

                            <span>
                                Cantidad: ${item.quantity}
                            </span>

                        </div>

                        <strong>
                            ${formatPrice(subtotal)}
                        </strong>

                    </div>
                `;

            }).join("") +

            `
                <div class="checkout-summary-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatPrice(calculateCartTotal())}
                    </strong>

                </div>
            `;
    }


    async function submitOrder(event) {

        event.preventDefault();

        if (cart.length === 0) {

            showCheckoutError(
                "El carrito está vacío."
            );

            return;
        }

        const formData =
            new FormData(
                elements.checkoutForm
            );

        const nombre =
            String(
                formData.get("nombre") || ""
            ).trim();

        const apellido =
            String(
                formData.get("apellido") || ""
            ).trim();

        const email =
            String(
                formData.get("email") || ""
            ).trim();

        const telefono =
            String(
                formData.get("telefono") || ""
            ).trim();

        const direccion =
            String(
                formData.get("direccion") || ""
            ).trim();

        const localidad =
            String(
                formData.get("localidad") || ""
            ).trim();

        const codigoPostal =
            String(
                formData.get("codigoPostal") || ""
            ).trim();


        if (
            !nombre ||
            !apellido ||
            !email ||
            !telefono ||
            !direccion ||
            !localidad ||
            !codigoPostal
        ) {

            showCheckoutError(
                "Completá todos los campos obligatorios."
            );

            return;
        }


        /*
        * El frontend solamente envía:
        *
        * - variante
        * - cantidad
        *
        * El backend será responsable
        * de obtener producto y precio.
        */

        const detalles =
            cart.map(item => ({

                variante: {
                    id: Number(item.variantId)
                },

                cantidad:
                    Number(item.quantity)

            }));


        if (
            detalles.some(
                detalle =>
                    !detalle.variante.id ||
                    detalle.cantidad <= 0
            )
        ) {

            showCheckoutError(
                "Hay un producto del carrito que ya no es válido. Actualizá la página e intentá nuevamente."
            );

            return;
        }


        const pedido = {

            nombreCliente:
                nombre,

            apellidoCliente:
                apellido,

            emailCliente:
                email,

            telefonoCliente:
                telefono,

            direccionEntrega:
                direccion,

            localidadEntrega:
                localidad,

            codigoPostalEntrega:
                codigoPostal,

            costoEnvio:
                0,

            detalles:
                detalles

        };


        setCheckoutLoading(true);

        try {

            const response =
                await fetch(
                    ORDERS_API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                pedido
                            )
                    }
                );


            const data =
                await response.json()
                    .catch(
                        () => ({})
                    );


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "No se pudo crear el pedido."
                );
            }


            /*
            * IMPORTANTE:
            *
            * Solamente vaciamos el carrito
            * después de recibir 201 Created.
            */

            cart = [];

            saveCart();

            updateCartUI();


            elements.checkoutForm.reset();

            elements.checkoutFormView.style.display =
                "none";

            elements.checkoutSuccess.classList.add(
                "visible"
            );


            elements.checkoutOrderId.textContent =
                `#${data.id}`;


            elements.checkoutSuccessTotal.textContent =
                `Total: ${formatPrice(data.total)}`;


        } catch (error) {

            console.error(
                "Error al crear pedido:",
                error
            );


            showCheckoutError(
                error.message ||
                "No se pudo completar la compra."
            );

        } finally {

            setCheckoutLoading(false);

        }

    }


    function showCheckoutError(message) {

        elements.checkoutError.textContent =
            message;

        elements.checkoutError.classList.add(
            "visible"
        );

    }


    function setCheckoutLoading(loading) {

        elements.checkoutSubmit.disabled =
            loading;

        if (loading) {

            elements.checkoutSubmit.textContent =
                "Procesando compra...";

        } else {

            elements.checkoutSubmit.textContent =
                "Confirmar compra";

        }

}


    /*
     * =====================================================
     * BÚSQUEDA
     * =====================================================
     */

    function openSearch() {

        elements.searchOverlay.classList.add(
            "open"
        );


        elements.searchInput.focus();

    }


    function closeSearch() {

        elements.searchOverlay.classList.remove(
            "open"
        );

    }


    function performSearch(value) {

        currentSearch =
            value;


        renderCatalog();

    }


    /*
     * =====================================================
     * CATEGORÍAS / FILTROS
     * =====================================================
     */

    function selectCategory(categoryId) {

        currentCategory =
            categoryId;


        elements.categoryFilter.value =
            categoryId;


        renderCatalog();


        document
            .getElementById("catalog")
            .scrollIntoView({
                behavior: "smooth"
            });

    }


    function clearFilters() {

        currentCategory =
            "all";


        currentSearch =
            "";


        elements.categoryFilter.value =
            "all";


        elements.searchInput.value =
            "";


        renderCatalog();

    }


    function updateNavigationActiveState() {

        const links =
            elements.desktopNav.querySelectorAll(
                "a"
            );


        links.forEach(link => {

            link.classList.toggle(
                "active",
                String(link.dataset.category) ===
                    String(currentCategory)
            );

        });

    }


    /*
     * =====================================================
     * MOBILE MENU
     * =====================================================
     */

    function openMobileMenu() {

        elements.mobileMenu.classList.add(
            "open"
        );


        document.body.classList.add(
            "no-scroll"
        );

    }


    function closeMobileMenu() {

        elements.mobileMenu.classList.remove(
            "open"
        );


        document.body.classList.remove(
            "no-scroll"
        );

    }


    /*
     * =====================================================
     * CART OPEN / CLOSE
     * =====================================================
     */

    function openCart() {

        elements.cartDrawer.classList.add(
            "open"
        );


        elements.cartOverlay.classList.add(
            "open"
        );


        document.body.classList.add(
            "no-scroll"
        );

    }


    function closeCart() {

        elements.cartDrawer.classList.remove(
            "open"
        );


        elements.cartOverlay.classList.remove(
            "open"
        );


        document.body.classList.remove(
            "no-scroll"
        );

    }


    /*
     * =====================================================
     * EVENTOS
     * =====================================================
     */

    function initializeEvents() {

        /*
         * Search
         */

        elements.searchButton.addEventListener(
            "click",
            openSearch
        );


        elements.closeSearch.addEventListener(
            "click",
            closeSearch
        );


        elements.searchOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    elements.searchOverlay
                ) {

                    closeSearch();

                }

            }
        );


        elements.searchInput.addEventListener(
            "input",
            event => {

                performSearch(
                    event.target.value
                );

            }
        );


        /*
         * Mobile menu
         */

        elements.menuButton.addEventListener(
            "click",
            openMobileMenu
        );


        elements.closeMobileMenu.addEventListener(
            "click",
            closeMobileMenu
        );


        /*
         * Categoría
         */

        elements.categoryFilter.addEventListener(
            "change",
            event => {

                currentCategory =
                    event.target.value;


                renderCatalog();

            }
        );


        /*
         * Modal
         */

        elements.closeProductModal.addEventListener(
            "click",
            closeProductModal
        );


        elements.productModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    elements.productModal
                ) {

                    closeProductModal();

                }

            }
        );


        /*
         * Agregar al carrito
         */

        elements.addToCartButton.addEventListener(
            "click",
            addToCart
        );


        /*
         * Carrito
         */

        elements.cartButton.addEventListener(
            "click",
            openCart
        );


        elements.closeCart.addEventListener(
            "click",
            closeCart
        );


        elements.cartOverlay.addEventListener(
            "click",
            closeCart
        );


        /*
         * Continuar comprando
         */

        elements.continueShopping.addEventListener(
            "click",
            closeCart
        );


        /*
         * Limpiar filtros
         */

        elements.clearFilters.addEventListener(
            "click",
            clearFilters
        );


        /*
         * Compra
         */

        elements.checkoutButton.addEventListener(
            "click",
            openCheckout
        );

        elements.closeCheckout.addEventListener(
            "click",
            closeCheckout
        );

        elements.closeCheckoutSuccess.addEventListener(
            "click",
            closeCheckout
        );

        elements.checkoutOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    elements.checkoutOverlay
                ) {
                    closeCheckout();
                }

            }
        );

        elements.checkoutForm.addEventListener(
            "submit",
            submitOrder
        );


        /*
         * Eventos dinámicos del carrito
         */

        elements.cartItems.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "button"
                    );


                if (!button) {

                    return;

                }


                const action =
                    button.dataset.action;


                const cartId =
                    button.dataset.id;


                if (
                    action ===
                    "increase"
                ) {

                    changeQuantity(
                        cartId,
                        1
                    );

                }


                if (
                    action ===
                    "decrease"
                ) {

                    changeQuantity(
                        cartId,
                        -1
                    );

                }


                if (
                    action ===
                    "remove"
                ) {

                    removeFromCart(
                        cartId
                    );

                }

            }
        );


        /*
         * Escape
         */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                closeSearch();

                closeMobileMenu();

                closeProductModal();

                closeCart();

            }
        );

    }


    /*
     * =====================================================
     * LOCAL STORAGE
     * =====================================================
     */

    function loadCart() {

        try {

            const saved =
                localStorage.getItem(
                    getCartStorageKey()
                );


            if (!saved) {

                return [];

            }


            const parsed =
                JSON.parse(saved);


            return Array.isArray(parsed)
                ? parsed
                : [];


        } catch (error) {

            console.error(
                "No se pudo cargar el carrito:",
                error
            );


            return [];

        }

    }


    function saveCart() {

        try {

            localStorage.setItem(
                getCartStorageKey(),
                JSON.stringify(cart)
            );


        } catch (error) {

            console.error(
                "No se pudo guardar el carrito:",
                error
            );

        }

    }


    function getCartStorageKey() {

        const storeId =
            STORE_CONFIG.store?.id ||
            STORE_CONFIG.store?.name ||
            "default";


        return `negociop_cart_${storeId}`;

    }


    /*
     * =====================================================
     * HELPERS
     * =====================================================
     */

    function getCategoryName(categoryId) {

        const category =
            categories.find(
                category =>
                    String(category.id) ===
                    String(categoryId)
            );


        return (
            category?.name ||
            ""
        );

    }


    /**
     * Obtiene los colores disponibles de un producto.
     * @param {Object} product - El producto.
     * @returns {Array} Lista de colores disponibles.
     */
    function getAvailableColors(product) {

        if (!product) {
            return [];
        }

        const colors =
            Array.isArray(product.apiOptions) &&
            product.apiOptions.length > 0
                ? product.apiOptions
                : product.colors || [];

        return colors.filter(
            color => {

                if (
                    color.available === false
                ) {
                    return false;
                }

                if (
                    Array.isArray(
                        color.sizes
                    )
                ) {

                    return color.sizes.some(
                        size =>
                            size.available !== false
                    );

                }

                return true;

            }
        );

    }




    function getFirstAvailableImage(product) {

        if (
            !Array.isArray(
                product.colors
            ) ||
            product.colors.length === 0
        ) {

            return (
                product.image ||
                "https://placehold.co/800x1000?text=Producto"
            );

        }


        const color =
            product.colors.find(
                color =>
                    color.available !== false
            );


        return (
            color?.image ||
            product.image ||
            "https://placehold.co/800x1000?text=Producto"
        );

    }


    function getProductColorDots(product) {

        if (
            !Array.isArray(
                product.colors
            ) ||
            product.colors.length === 0
        ) {

            return "";

        }


        return product.colors
            .filter(
                color =>
                    color.available !== false
            )
            .map(
                color => `
                    <span
                        class="product-color-dot"
                        title="${escapeAttribute(color.name)}"
                        style="background:${escapeAttribute(color.hex || "#ccc")}"
                    ></span>
                `
            )
            .join("");

    }


    function formatPrice(value) {

        const number =
            Number(value) || 0;


        return new Intl.NumberFormat(
            "es-AR",
            {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0
            }
        ).format(number);

    }


    function showToast(message) {

        elements.toastMessage.textContent =
            message;


        elements.toast.classList.add(
            "show"
        );


        clearTimeout(
            showToast.timeout
        );


        showToast.timeout =
            setTimeout(
                () => {

                    elements.toast.classList.remove(
                        "show"
                    );

                },
                2600
            );

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }


    function escapeAttribute(value) {

        return escapeHTML(value);

    }

});

