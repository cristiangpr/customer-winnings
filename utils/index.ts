import { BigNumber, BigNumberish } from "@ethersproject/bignumber";

/**
 * @function searchMarkets - This function is called by typing in the search input. It searches market questions and descriptions for matches
 * @param {Array} object - the array of market objects fetched by getStaticProps from the api
 * @param {Array} properties - keys for the properties of the market objects
 * @param {string} query - the text coming from the search input
 * @returns {boolean} - value indicating if search query was found
 * */
export function searchMarkets<data>(
    object: data,
    properties: Array<keyof data>,
    query: string,
): boolean {
    if (query === "") {
        return true;
    }

    return properties.some((property) => {
        const value = object[property];
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().toLowerCase().includes(query.toLowerCase());
        }
        return false;
    });
}

// Following two functions taken from https://github.com/TokenUnion/amm-maths/blob/master/src/utils.ts by Tom French
/**
 * Performs multiplication between a BigNumber and a decimal number while temporarily scaling the decimal to preserve precision
 * @param a - a BigNumber to multiply by b
 * @param b - a decimal by which to multiple a by.
 * @param scale - the factor by which to scale the numerator by before division
 */
const mulBN = (a: BigNumber, b: number, scale = 10000): BigNumber => {
    return a.mul(Math.round(b * scale)).div(scale);
};

/**
 * Performs division between two BigNumbers while temporarily scaling the numerator to preserve precision
 * @param a - the numerator
 * @param b - the denominator
 * @param scale - the factor by which to scale the numerator by before division
 */
const divBN = (a: BigNumber, b: BigNumberish, scale = 10000): number => {
    return a.mul(scale).div(b).toNumber() / scale;
};

/**
 *@function getEarnings - calculates winnings from graphQl query result
 @param {Object} position - the market position object
 */
export const getEarnings = (position: {
    user?: { id: string };
    netQuantity?: string;
    market?: any;
    outcomeIndex?: string;
    valueSold?: string;
    valueBought?: string;
}) => {
    const netQuantity = BigNumber.from(position.netQuantity);
    const outcomeTokenPrice =
        position.market.outcomeTokenPrices[position.outcomeIndex];
    const valueSold = BigNumber.from(position.valueSold);
    const valueBought = BigNumber.from(position.valueBought);
    const netValue = mulBN(netQuantity, outcomeTokenPrice);
    return netValue.add(valueSold).sub(valueBought).toNumber();
};

/**
 *@function getROI - calculates ROI from graphQl query result
 @param {Object} position - the market position object
 */
export const getROI = (position: {
    user?: { id: string };
    netQuantity?: string;
    market?: any;
    outcomeIndex?: string;
    valueSold?: string;
    valueBought?: string;
}) => {
    const netQuantity = BigNumber.from(position.netQuantity);
    const outcomeTokenPrice =
        position.market.outcomeTokenPrices[position.outcomeIndex];
    const valueSold = BigNumber.from(position.valueSold);
    const valueBought = BigNumber.from(position.valueBought);
    const netValue = mulBN(netQuantity, outcomeTokenPrice);
    const netEarnings = netValue.add(valueSold).sub(valueBought);
    return divBN(netEarnings, valueBought) * 100;
};
