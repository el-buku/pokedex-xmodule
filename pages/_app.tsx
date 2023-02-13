import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { wrapper } from "pokedex-utils";
import fetch, { Headers, Request, Response } from "node-fetch";

if (!globalThis.fetch) {
  Object.assign(globalThis, {
    fetch,
    Headers,
    Request,
    Response,
  });
}

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <main>
      <Provider store={store}>
        <Component {...props.pageProps} />
      </Provider>
    </main>
  );
}
