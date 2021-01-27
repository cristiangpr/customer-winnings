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
import { getEarnings, getROI } from "../utils";

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
                marketPositions(where: { market: $marketAddress }) {
                    user {
                        id
                    }
                    outcomeIndex
                    valueBought
                    valueSold
                    netValue
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
    console.log(data);
    const leaderBoardArray = [];
    data.marketPositions
        .filter((position: { valueBought: string }) => {
            return position.valueBought > "0";
        })
        .map((position: { user: { id: string }; valueBought: string }) => {
            const earnings = getEarnings(position);
            const roi = getROI(position);
            const leaderBoardRow = {
                user: position.user.id,
                earnings,
                invested: position.valueBought,
                roi,
            };
            leaderBoardArray.push(leaderBoardRow);
            return leaderBoardArray;
        });

    leaderBoardArray.sort((a, b) => (+a.earnings > +b.earnings ? -1 : 1));
    const top10 = leaderBoardArray.slice(0, 10);

    return (
        <>
            {top10.map(({ user, earnings, invested, roi }) => (
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
