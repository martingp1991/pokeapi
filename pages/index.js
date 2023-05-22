import { useState } from "react";
import HomeCss from "../styles/Home.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home({ pokemones, minimimosDatos, tipos, notFound }) {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemAnimado = {
    hidden: { opacity: 0, scale: 0 },
    show: { opacity: 1, scale: 1 }
  }

  const [filtro, setFiltrar] = useState(minimimosDatos);
  const [busqueda, setBusqueda] = useState("");

  const filtrar = (elTipo) => {
    setFiltrar(minimimosDatos);

    if (elTipo === "borrar") {
      setFiltrar(minimimosDatos);
    } else {
      let filtradoPorTypo = minimimosDatos
        .filter((pokemon) =>
          pokemon.types.some((tipo) => tipo.type.name === elTipo)
        )
        .map((tem2) => {
          let nuevosTem = { ...tem2 };

          return nuevosTem;
        });
      setFiltrar(filtradoPorTypo);
    }
  };

  const buscar = (event) => {
    setBusqueda(event.target.value);

    if (event.target.value === "") {
      setFiltrar(minimimosDatos);
    } else {
      let filtradoPorBusqueda = minimimosDatos
        .filter((pokemon) =>
          pokemon.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
        .map((tem2) => {
          let nuevosTem = { ...tem2 };

          return nuevosTem;
        });
      setFiltrar(filtradoPorBusqueda);
    }
  };

  return (
    <>
      <div className={HomeCss.container}>
        <div className={HomeCss.filtros}>
          <button
            className={`${HomeCss.botonFiltro} ${HomeCss.botonTodos}`}
            onClick={() => filtrar("borrar")}
          >
            Mostrar todos
          </button>
          <div className={HomeCss.botones}>
            {tipos.map((tipo, index) => {
              return (
                <button
                  key={tipo.name}
                  className={`${HomeCss.botonFiltro} ${tipo.name}`}
                  aria-label={tipo.name}
                  onClick={() => filtrar(tipo.name)}
                >
                  {tipo.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className={HomeCss.titulo}>
          <h1>Pokemones</h1>
          <input
            type="text"
            placeholder="Buscar Pokemones"
            value={busqueda}
            onChange={buscar}
          />
        </div>
        <div className={HomeCss.columnas}>

            <ul
            variants={container}
            initial="hidden"
            animate="show"
            >

          <ul>
            {filtro
              ? filtro.map((pokemon) => (
                  <li
                  variants={itemAnimado}
                  key={pokemon.id}>
                    <Link
                      scroll={false}
                      href={{
                        pathname: "/pokemon/[name]",
                        query: { name: pokemon.name },
                      }}
                    >

                        <div
                          className={`${HomeCss.card} ${pokemon.types[0].type.name}`}
                        >
                          <div className={HomeCss.nombreTipos}>
                            <h3 exit={{ opacity: 0 }}>{pokemon.name}</h3>

                            <div className={HomeCss.tipos}>
                              {pokemon.types.map((tipos, index) => {
                                return (
                                  <div key={index} className={HomeCss.tipo}>
                                    {tipos.type.name}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <motion.img
                            src={pokemon.sprites}
                            alt={pokemon.name}
                            width={100}
                            height={100}
                            className={HomeCss.imagen}
                            layoutid={pokemon.sprites}
                            style={{cursor:"pointer"}}
                          />
                        </div>

                    </Link>
                  </li>
                ))
              : "Cargando..."}

          </ul>
          </ul>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const resTipos = await fetch("https://pokeapi.co/api/v2/type");
  const tipos = await resTipos.json();

  const traemosPokemones = async (porPokemon) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${porPokemon}?limit=101&offset=0/`
    );
    const data = await response.json();

    return data;
  };
  let pokemones = [];
  for (let i = 1; i <= 101; i++) {
    let data = await traemosPokemones(i);
    pokemones.push(data);
  }

  let minimimosDatos = pokemones.map((pokemon) => {
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprites: pokemon.sprites.other.dream_world.front_default,
      types: pokemon.types,
    };
  });

  return {
    props: {
      tipos: tipos.results,
      minimimosDatos,
    },
  };
}