import Head from "next/head";
import { useRouter } from "next/router";
import { LandingLayout, DataGridControlProps } from "pokedex-components";
import {
  wrapper,
  getPaginatedPokemonsList,
  pokemonApiUtil,
  useGetPaginatedPokemonsListQuery,
  NamedAPIResourceList,
} from "pokedex-utils";
import { useEffect, useState } from "react";

const perPage = 35;

export default function LandingPage() {
  const router = useRouter();
  const { query } = router;
  const [page, setPage] = useState(0);

  useEffect(() => {
    const parsedPageIndex = parseInt((query.page as string) || "0");
    setPage((parsedPageIndex >= 0 && parsedPageIndex) || 0);
    //eslint-disable-next-line
  }, []);

  const { isLoading, data } = useGetPaginatedPokemonsListQuery({
    page,
    perPage,
  }) as {
    data?: NamedAPIResourceList;
    isLoading: boolean;
  };

  const [isLoadingThunks, setIsLoadingThunks] = useState(false);

  useEffect(() => {
    const awaitQueries = async () => {
      setIsLoadingThunks(true);
      await pokemonApiUtil.getRunningQueriesThunk();
      // timeout for a nicer UX
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          setIsLoadingThunks(false);
          resolve();
        }, (Math.random() * (8 - 3) + 3) * 100)
      );
      router.replace(`/`, `/?page=${page}`);
    };
    awaitQueries();
    //eslint-disable-next-line
  }, [page]);

  const dataGridControlProps: DataGridControlProps = {
    isLoading: isLoading || isLoadingThunks,
    page: page,
    pageSize: perPage,
    totalRows: data?.count || 0,
    rows: data?.results || [],
    onPageChange: setPage,
  };

  return (
    <>
      <Head>
        <title>Next Pokedex</title>
      </Head>
      <LandingLayout {...{ dataGridControlProps }} />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { query } = context;
    const parsedPageIndex = parseInt((query.page as any) || 0);

    const offsetParams = {
      page: (parsedPageIndex >= 0 && parsedPageIndex) || 0,
      perPage,
    };
    store.dispatch(getPaginatedPokemonsList.initiate(offsetParams));
    await pokemonApiUtil.getRunningQueriesThunk();
    return {
      props: {},
    };
  }
);
