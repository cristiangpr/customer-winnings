import React, { useState } from "react";
import { Market } from "../utils/constants";
import { searchMarkets } from "../utils";
import { getModalProps } from "../utils/hooks";
import BalanceModal from "./WinningsModal";
import styles from "../styles/MarketsBoard.module.scss";

type Props = {
    data: Market[];
    query: string;
};

const ActiveMarkets: React.FC<Props> = ({ data, query }): JSX.Element => {
    const [show, setShow] = useState<boolean>(false);
    const [marketAddress, setMarketAddress] = useState<string>("");
    const [question, setQuestion] = useState<string>("");

    async function handleClick({ market }: { market: Market }): Promise<void> {
        setMarketAddress(market.marketMakerAddress);
        setQuestion(market.question);
        setShow(true);
    }

    const resultMarkets = data.filter((market) =>
        searchMarkets<Market>(market, ["question", "description"], query),
    );

    const marketElements = resultMarkets.map((market: Market) => {
        return (
            <div
                className={styles.MarketWidget}
                role="button"
                style={{ cursor: "pointer" }}
                onClick={() => handleClick({ market })}
                key={market.id}
                onKeyDown={() => handleClick({ market })}
            >
                {" "}
                <div className={styles.MarketWidget__name}>
                    {market.question}
                </div>
            </div>
        );
    });
    return (
        <>
            <BalanceModal
                show={show}
                setShow={setShow}
                marketAddress={marketAddress}
                question={question}
            />
            {marketElements}
        </>
    );
};
export default ActiveMarkets;
