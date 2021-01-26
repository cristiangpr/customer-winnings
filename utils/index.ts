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
/**
 *@function getWinnings - calculates winnings from graphQl query result
 @param {Object} - the market position object
 */
export const getWinnings = (position: {
    user?: { id: string };
    netQuantity?: string;
    market?: any;
    outcomeIndex?: string;
    valueSold?: string;
    valueBought?: string;
}) => {
    return (
        (+position.netQuantity *
            +position.market.outcomeTokenPrices[position.outcomeIndex] +
            +position.valueSold) /
        +position.valueBought
    );
};
