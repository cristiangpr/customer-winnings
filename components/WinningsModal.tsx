import React, { PropsWithChildren } from "react";
import { Dialog, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client";
import styles from "./WinningsModal.module.scss";
import { getAllPositions, getAggregatedPositions, getTopTen } from "../utils";

type Props = {
    marketAddress: string;
};

const client = new ApolloClient({
    uri:
        "https://subgraph-matic.poly.market/subgraphs/name/TokenUnion/polymarket",
    cache: new InMemoryCache(),
});

const LeaderBoard: React.FC<Props> = ({ marketAddress }): JSX.Element => {
    const { loading, error, data } = useQuery(
        gql`
            query positions($marketAddress: String!) {
                marketPositions(where: { market: $marketAddress  valueBought_gt: 0 }) {
                    user {
                        id
                    }
                    outcomeIndex
                    valueBought
                    valueSold
                    netQuantity
                    market {
                        outcomeTokenPrices
                    }
                }
            }
        `,
        { variables: { marketAddress: marketAddress.toLowerCase() } },
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;
    console.log(data)
    const allPositions = getAllPositions(data);
    console.log(allPositions)
    const aggregatedPositions = getAggregatedPositions(allPositions);
    const topTen = getTopTen(aggregatedPositions);
 

    return (
        <>
            {topTen.map(({ user, earnings, invested, roi }) => (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Invested</th>
                            <th>Earnings</th>
                            <th>Return</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={user}>
                            <td>{user}</td>
                            <td>{invested}</td>
                            <td>{earnings}</td>
                            <td>{roi}%</td>
                        </tr>
                    </tbody>
                </table>
            ))}{" "}
        </>
    );
};

const LeaderBoardModal = ({
    show,
    setShow,
    marketAddress,
}: PropsWithChildren<{
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    question: string;
    marketAddress: string;
}>) => {
    return (
        <Dialog fullScreen open={show} onClose={setShow}>
            <div className={styles.inner}>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                        setShow(false);
                    }}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <main className={styles.body}>
                    <ApolloProvider client={client}>
                        <LeaderBoard marketAddress={marketAddress} />
                    </ApolloProvider>
                </main>
            </div>
        </Dialog>
    );
};
export default LeaderBoardModal;
