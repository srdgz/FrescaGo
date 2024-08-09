import React from "react";
import { motion } from "framer-motion";
import { FadeLeft } from "../../utility/animation";

const ProductsData = [
  {
    id: 1,
    title: "Manzana Roja",
    link: "#",
    price: "2,35€/kg",
    delay: 0.3,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/78bc97a8-1914-407b-8a6b-f24657fbf967/200x200.webp",
  },
  {
    id: 2,
    title: "Manzana Golden",
    link: "#",
    price: "3,77€/kg",
    delay: 0.6,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/0c96d300-c0a4-40d0-93ca-5f8d70904cbc/200x200.webp",
  },
  {
    id: 3,
    title: "Manzana Grany",
    link: "#",
    price: "2,89€/kg",
    delay: 0.9,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/330ae5b8-0960-432a-b850-3e906fabdaeb/200x200.webp",
  },
  {
    id: 4,
    title: "Pera conferencia",
    link: "#",
    price: "2,45€/kg",
    delay: 1.2,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/ae0cdd34-9542-4536-8520-bfb52368c698/200x200.webp",
  },
  {
    id: 5,
    title: "Plátano de Canarias",
    link: "#",
    price: "2,35€/kg",
    delay: 1.5,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/d31e072b-3526-4f0d-b09d-cbc4c47a218a/200x200.webp",
  },
  {
    id: 6,
    title: "Naranja de zumo",
    link: "#",
    price: "1,85€/kg",
    delay: 1.8,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/52699382-4f35-4dcd-8545-e412441af49b/200x200.webp",
  },
  {
    id: 7,
    title: "Mandarina",
    link: "#",
    price: "3,77€/kg",
    delay: 2.1,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/c9656f9b-57c2-42ec-bda2-59b101456b88/200x200.webp",
  },
  {
    id: 8,
    title: "Arándanos",
    link: "#",
    price: "5,75€/kg",
    delay: 2.4,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/51a417fc-f7ac-4089-b3f8-1a7ed515aab9/200x200.webp",
  },
  {
    id: 9,
    title: "Fresas",
    link: "#",
    price: "2,99€/kg",
    delay: 2.7,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/df1e0f90-3b02-41c9-9d55-640f33f9050b/200x200.webp",
  },
  {
    id: 10,
    title: "Kiwis",
    link: "#",
    price: "3,89€/kg",
    delay: 3.0,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/491882a4-a218-465b-bc3b-0f988edefd8f/200x200.webp",
  },
  {
    id: 11,
    title: "Aguacate",
    link: "#",
    price: "4,95€/kg",
    delay: 3.3,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/ca9a3335-6b64-418e-bbe6-b0fe9a34f155/200x200.webp",
  },
  {
    id: 12,
    title: "Tomate en rama",
    link: "#",
    price: "1,69€/kg",
    delay: 3.6,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/f2857bf9-b4e5-4dba-b50c-2da523b715d1/1280x1280.webp",
  },
  {
    id: 13,
    title: "Calabacín",
    link: "#",
    price: "1,25€/kg",
    delay: 3.9,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/ae11d47e-140a-4a4c-9344-fefc7b426178/1280x1280.webp",
  },
  {
    id: 14,
    title: "Cogollos de lechuga",
    link: "#",
    price: "0,99€/kg",
    delay: 4.1,
    img: "https://www.compraonline.alcampo.es/images-v3/37ea0506-72ec-4543-93c8-a77bb916ec12/ac1421ab-988d-4aa4-8470-dac08dd2904c/1280x1280.webp",
  },
];

const Products = () => {
  return (
    <section>
      <div className="container pt-12 pb-20">
        <motion.h1
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl font-bold text-left pb-10"
        >
          Algunos de nuestros productos
        </motion.h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ProductsData.map((product) => (
            <motion.div
              variants={FadeLeft(product.delay)}
              initial="hidden"
              whileInView={"visible"}
              whileHover={{ scale: 1.1 }}
              className="bg-white rounded-3xl px-4 py-4 shadow-[0_0_22px_0_rgba(0,0,0,0.15)] flex flex-row justify-around items-center gap-3"
            >
              <img
                src={product.img}
                alt=""
                className="w-[60px] mb-4 scale-110 transform justify-center"
              />
              <div>
                <h1 className="text-lg font-semibold">{product.title}</h1>
                <p className="text-lg font-semibold text-secondary">
                  {product.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
