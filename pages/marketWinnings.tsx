import Head from "next/head";
import React, { useState } from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client";
import { Market } from "../utils/constants";
import SearchInput from "../components/searchInput";
import ActiveMarkets from "../components/activeMarkets";
import styles from "../styles/Home.module.scss";
import PolymarketLogo from "../public/polymarket.svg";

const client = new ApolloClient({
    uri:
        "https://subgraph-matic.poly.market/subgraphs/name/TokenUnion/polymarket",
    cache: new InMemoryCache(),
});
type Props = {
    data: Market[];
};

const MarketWinnings: React.FC<Props> = (): JSX.Element => {
    const { loading, error, data } = useQuery(gql`
        {
            marketPositions(orderBy: netQuantity) {
                user {
                    id
                }
                valueBought
                netValue
                netQuantity
                market {
                    outcomeTokenPrices
                }
            }
        }
    `);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <ApolloProvider client={client}>
            <div className={styles.App_Container}>
                <Head>
                    <title>Customer Winnings For Market</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className={styles.header}>
                    <div className={styles.content}>
                        <PolymarketLogo />
                    </div>
                </div>

                <main className={styles.main}>
                    <h1 className={styles.title}>Customer Winnings</h1>

                    <div className={styles.grid}>
                        <p className={styles.description}>
                            Select a market outcome to find customer winnings{" "}
                        </p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.content}>
                            <h2 className={styles.description}>
                                Active Markets
                            </h2>
                        </div>
                    </div>
                </main>
            </div>
        </ApolloProvider>
    );
};
