import Link from "next/link";
import Account from "../components/Account";
import Layout from "../components/Layout";
import WalletConnect from "../components/WalletConnect";
import { useEagerConnect } from "../hooks/useEagerConnect";

export default function DAppPage(): JSX.Element {
  // automatically try connecting to the injected connector on pageload
  const triedToEagerConnect = useEagerConnect();

  return (
      <Layout title="About | Next.js + TypeScript Example">
        <h1>Survey Market Place</h1>
        <p>A decentralized survey marketplace</p>
        <WalletConnect />
        <Account triedToEagerConnect={triedToEagerConnect} />
        <p>
          <Link href="/">
            <a>Go home</a>
          </Link>
        </p>
      </Layout>
  );
}
