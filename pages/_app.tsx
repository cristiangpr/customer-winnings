import * as React from "react";
import "../styles/globals.scss";
import { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return <Component {...pageProps} />;
}
