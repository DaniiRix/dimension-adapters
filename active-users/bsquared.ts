import { FetchOptions, ProtocolType, SimpleAdapter } from "../adapters/types";
import { CHAIN } from "../helpers/chains";
import { getOklinkApiKey } from "../helpers/oklink";
import { httpGet } from "../utils/fetchURL";

const fetch = async (options: FetchOptions) => {
  const timestamp = options.startOfDay * 1e3;
  const apiKey = await getOklinkApiKey();
  const headers = { 'x-apikey': apiKey };
  const [activeData, txData] = await Promise.all([
    httpGet(`https://www.oklink.com/api/explorer/v2/common/charts/activeAddressCount?chain=BSQUARED&t=${timestamp}`, { headers }),
    httpGet(`https://www.oklink.com/api/explorer/v2/common/charts/transaction?chain=BSQUARED&t=${timestamp}`, { headers }),
  ]);
  const activeEntry = activeData.data.value.find((item: any) => item.timestamp == timestamp);
  const txEntry = txData.data.value.find((item: any) => item.timestamp == timestamp);
  if (!activeEntry || !txEntry) {
    throw new Error(`No BSquared user data found for ${timestamp}`);
  }
  return {
    dailyActiveUsers: Number(activeEntry.activeAddressCount),
    dailyTransactionsCount: Number(txEntry.transactionCount),
  };
};

const adapter: SimpleAdapter = {
  version: 1,
  fetch,
  chains: [CHAIN.BSQUARED],
  protocolType: ProtocolType.CHAIN,
  start: '2024-04-15',
};

export default adapter;
