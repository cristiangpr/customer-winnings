import React, { useState } from "react";
import { Button, Alert, Modal } from "react-bootstrap";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client"; // TODO: remove bootstrap

type ModalProps = {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    question: string;
    marketAddress: string;
    show: boolean;
};
type WinningsProps = {
    marketAddress: string;
};

const client = new ApolloClient({
    uri:
        "https://subgraph-matic.poly.market/subgraphs/name/TokenUnion/polymarket",
    cache: new InMemoryCache(),
});

const MarketWinnings: React.FC<WinningsProps> = ({
    marketAddress,
}): JSX.Element => {
    // Don't know how to pass this to the query. currently I am fetching all positions

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
  

    return data.marketPositions.map(
        ({
            user,
            valueBought,
            netValue,
            netQuantity,
            outcomeTokenPrices,
            i,
        }) => (
            <div key={i}>
                <p>User: {user.id}</p>
                <p>netValue: {netValue}</p>
            </div>
        ),
    );
};

const WinningsModal: React.FC<ModalProps> = ({
    setShow,
    question,
    marketAddress,
    show,
}): JSX.Element => {
    const [errorMessage, setErrorMessage] = useState<string>("");

    return (
        <Modal show={show} onHide={setShow}>
            <Modal.Header closeButton>
                <Modal.Title>Market Positions</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h6> {question} </h6>
                <ApolloProvider client={client}>
                    <MarketWinnings marketAddress={marketAddress} />
                </ApolloProvider>
                {errorMessage && (
                    <Alert
                        variant="danger"
                        onClose={() => setErrorMessage("")}
                        dismissible
                    >
                        <Alert.Heading>
                            Oh snap! You got an error!
                        </Alert.Heading>
                        <p>{errorMessage}</p>
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setShow(false);
                        setErrorMessage("");
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default WinningsModal;
