import { useRouter } from "next/router";
import {
  getPokemonByName,
  pokemonApiUtil,
  useGetPokemonByNameQuery,
  wrapper,
  querySkipToken,
  Pokemon,
  makeStore,
  getAllPokemonsList,
} from "pokedex-utils";
import { PokemonDetailsLayout } from "pokedex-components";
import { NamedAPIResourceList } from "../../../packages/utils/src/models/Base";

export async function getStaticPaths() {
  const store = makeStore();
  const { data } = (await store.dispatch(
    //@ts-ignore
    getAllPokemonsList.initiate()
  )) as {
    data: NamedAPIResourceList;
  };

  return {
    paths: data?.results.map((p) => `/${p.name}`),
    fallback: true,
  };
}

export default function PokemonDetailsPage() {
  const {
    query: { name },
    isFallback,
  } = useRouter();

  const { data, error, isLoading } = useGetPokemonByNameQuery(
    typeof name === "string" ? name : querySkipToken,
    {
      skip: isFallback,
    }
  ) as {
    data?: Pokemon;
    error?: any;
    isLoading: boolean;
  };

  return (
    <PokemonDetailsLayout
      isLoading={isFallback || isLoading}
      error={!!error}
      data={data}
    />
  );
}

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (context) => {
    const name = context.params?.name;
    if (typeof name === "string") {
      store.dispatch(getPokemonByName.initiate(name));
      await pokemonApiUtil.getRunningQueriesThunk();
    }

    return {
      props: {},
    };
  }
);
