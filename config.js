/* =========================================================
   NEGOCIOP
   CONFIGURACIÓN DEL NEGOCIO
========================================================= */

const STORE_CONFIG = {

    /* =====================================================
       INFORMACIÓN DEL NEGOCIO
    ===================================================== */

    store: {

        /*
         * Identificador único.
         *
         * Más adelante esto vendrá de MySQL.
         */

        id: "nova-ropa",

        name: "NOVA",

        logo: "NOVA",

        description:
            "Indumentaria moderna para todos los días.",


        /*
         * WhatsApp
         *
         * IMPORTANTE:
         * colocar número completo sin +, espacios ni guiones.
         *
         * Ejemplo:
         * 5491123456789
         */

        whatsapp: "5491100000000",


        /*
         * Redes sociales
         */

        instagram:
            "https://instagram.com/",

        facebook:
            "https://facebook.com/",


        /*
         * Hero
         */

        hero: {

            label:
                "NUEVA COLECCIÓN",

            title:
                "Vestite<br>diferente.",

            description:
                "Descubrí nuestra nueva colección. Diseños pensados para acompañarte todos los días.",

            buttonText:
                "Ver colección"

        }

    },


    /* =====================================================
       CATEGORÍAS
    ===================================================== */

    categories: [

        {
            id: "remeras",
            name: "Remeras",
            description: "Básicos y oversize"
        },

        {
            id: "buzos",
            name: "Buzos",
            description: "Comodidad y estilo"
        },

        {
            id: "pantalones",
            name: "Pantalones",
            description: "Distintos cortes"
        },

        {
            id: "camperas",
            name: "Camperas",
            description: "Para completar tu look"
        }

    ],


    /* =====================================================
       PRODUCTOS
    ===================================================== */

    products: [

        /* =================================================
           PRODUCTO 1
        ================================================= */

        {
            id: 1,

            name:
                "Remera Oversize Essential",

            category:
                "remeras",

            price:
                24900,

            badge:
                "NUEVO",

            visible:
                true,

            available:
                true,

            description:
                "Remera de corte oversize confeccionada en algodón premium. Una prenda cómoda y versátil para todos los días.",


            colors: [

                {
                    name:
                        "Negro",

                    hex:
                        "#151515",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: true
                        },

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: true
                        },

                        {
                            name: "XL",
                            available: true
                        }

                    ]
                },


                {
                    name:
                        "Blanco",

                    hex:
                        "#f5f5f5",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: true
                        },

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: false
                        },

                        {
                            name: "XL",
                            available: true
                        }

                    ]
                },


                {
                    name:
                        "Gris",

                    hex:
                        "#8b8b8b",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: false
                        },

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: true
                        },

                        {
                            name: "XL",
                            available: false
                        }

                    ]
                }

            ]

        },


        /* =================================================
           PRODUCTO 2
        ================================================= */

        {
            id: 2,

            name:
                "Remera Basic Fit",

            category:
                "remeras",

            price:
                19900,

            badge:
                "",

            visible:
                true,

            available:
                true,

            description:
                "Remera de corte clásico, suave y liviana. Un básico indispensable para cualquier outfit.",

            colors: [

                {
                    name:
                        "Negro",

                    hex:
                        "#111111",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: true
                        },

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: true
                        }

                    ]
                },


                {
                    name:
                        "Verde",

                    hex:
                        "#536b57",

                    available:
                        false,

                    image:
                        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: false
                        },

                        {
                            name: "M",
                            available: false
                        },

                        {
                            name: "L",
                            available: false
                        }

                    ]
                }

            ]

        },


        /* =================================================
           PRODUCTO 3
        ================================================= */

        {
            id: 3,

            name:
                "Hoodie Heavy",

            category:
                "buzos",

            price:
                49900,

            badge:
                "BEST SELLER",

            visible:
                true,

            available:
                true,

            description:
                "Buzo hoodie de algodón pesado con interior suave y capucha ajustable.",

            colors: [

                {
                    name:
                        "Negro",

                    hex:
                        "#111111",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: true
                        },

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: true
                        },

                        {
                            name: "XL",
                            available: true
                        }

                    ]
                },


                {
                    name:
                        "Beige",

                    hex:
                        "#d2c3a5",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: true
                        },

                        {
                            name: "M",
                            available: false
                        },

                        {
                            name: "L",
                            available: true
                        },

                        {
                            name: "XL",
                            available: false
                        }

                    ]
                }

            ]

        },


        /* =================================================
           PRODUCTO 4
        ================================================= */

        {
            id: 4,

            name:
                "Hoodie Essential",

            category:
                "buzos",

            price:
                45900,

            badge:
                "",

            visible:
                true,

            available:
                true,

            description:
                "Buzo clásico de calce relajado. Ideal para combinar con cualquier look.",

            colors: [

                {
                    name:
                        "Gris",

                    hex:
                        "#8d8d8d",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: true
                        },

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: true
                        },

                        {
                            name: "XL",
                            available: true
                        }

                    ]
                },


                {
                    name:
                        "Negro",

                    hex:
                        "#111111",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: true
                        },

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: false
                        },

                        {
                            name: "XL",
                            available: true
                        }

                    ]
                }

            ]

        },


        /* =================================================
           PRODUCTO 5
        ================================================= */

        {
            id: 5,

            name:
                "Cargo Relax",

            category:
                "pantalones",

            price:
                52900,

            badge:
                "NUEVO",

            visible:
                true,

            available:
                true,

            description:
                "Pantalón cargo de corte relajado con múltiples bolsillos y cintura ajustable.",

            colors: [

                {
                    name:
                        "Negro",

                    hex:
                        "#161616",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "38",
                            available: true
                        },

                        {
                            name: "40",
                            available: true
                        },

                        {
                            name: "42",
                            available: true
                        },

                        {
                            name: "44",
                            available: false
                        }

                    ]
                },


                {
                    name:
                        "Verde Militar",

                    hex:
                        "#56604e",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1517445312882-bc9910d016b4?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "38",
                            available: false
                        },

                        {
                            name: "40",
                            available: true
                        },

                        {
                            name: "42",
                            available: true
                        },

                        {
                            name: "44",
                            available: true
                        }

                    ]
                }

            ]

        },


        /* =================================================
           PRODUCTO 6
        ================================================= */

        {
            id: 6,

            name:
                "Jean Straight",

            category:
                "pantalones",

            price:
                57900,

            badge:
                "",

            visible:
                true,

            available:
                false,

            description:
                "Jean de corte recto con acabado lavado y construcción resistente.",

            colors: [

                {
                    name:
                        "Azul",

                    hex:
                        "#344b67",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "38",
                            available: true
                        },

                        {
                            name: "40",
                            available: true
                        },

                        {
                            name: "42",
                            available: true
                        }

                    ]
                }

            ]

        },


        /* =================================================
           PRODUCTO 7
        ================================================= */

        {
            id: 7,

            name:
                "Bomber Urban",

            category:
                "camperas",

            price:
                79900,

            badge:
                "NUEVO",

            visible:
                true,

            available:
                true,

            description:
                "Campera bomber de inspiración urbana con cierre frontal y terminaciones premium.",

            colors: [

                {
                    name:
                        "Negro",

                    hex:
                        "#111111",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: true
                        },

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: true
                        }

                    ]
                },


                {
                    name:
                        "Verde",

                    hex:
                        "#4c5a4d",

                    available:
                        false,

                    image:
                        "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "S",
                            available: false
                        },

                        {
                            name: "M",
                            available: false
                        },

                        {
                            name: "L",
                            available: false
                        }

                    ]
                }

            ]

        },


        /* =================================================
           PRODUCTO 8
        ================================================= */

        {
            id: 8,

            name:
                "Campera Minimal",

            category:
                "camperas",

            price:
                68900,

            badge:
                "",

            visible:
                false,

            available:
                true,

            description:
                "Campera minimalista de corte moderno.",

            colors: [

                {
                    name:
                        "Negro",

                    hex:
                        "#111111",

                    available:
                        true,

                    image:
                        "https://images.unsplash.com/photo-1520975958225-7c5b4a1b3e5b?auto=format&fit=crop&w=900&q=85",

                    sizes: [

                        {
                            name: "M",
                            available: true
                        },

                        {
                            name: "L",
                            available: true
                        }

                    ]
                }

            ]

        }

    ]

};