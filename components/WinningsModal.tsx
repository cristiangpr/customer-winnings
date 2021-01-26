import React, { PropsWithChildren } from "react";
import { Dialog, IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client";
import styles from "./WinningsModal.module.scss";
import { getWinnings } from "../utils";

type Props = {
    marketAddress: string;
};

const client = new ApolloClient({
    uri:
        "https://subgraph-matic.poly.market/subgraphs/name/TokenUnion/polymarket",
    cache: new InMemoryCache(),
});

const LeaderBoard: React.FC<Props> = ({
    marketAddress,
}):  JSX.Element => {
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
    const winningsArray = [];
    data.marketPositions.map((position: { user: { id: string; }; }) => {
        const winnings = getWinnings(position);
        const obj = {
            user: position.user.id,
            winnings,
        };
        winningsArray.push(obj);
        return winningsArray;
    });
   
    winningsArray.sort((a, b) => (+a.winnings > +b.winnings ? -1 : 1));
   // TODO filter out NaN

    return <>{winningsArray.map(({ user, winnings, i }) => (
        
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Winnings</th>
                </tr>
            </thead>
            <tbody>
                <tr key={i}>
                    <td>{user}</td>
                    <td>{winnings}</td>
                </tr>
            </tbody>
        </table>
       
    ))
    } </>
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
