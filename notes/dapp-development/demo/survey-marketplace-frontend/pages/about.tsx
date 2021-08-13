import Link from 'next/link'
import Layout from '../components/Layout'

export default function AboutPage(): JSX.Element {
    return (
        <div>
            <Layout title="About | Next.js + TypeScript Example">
                <h1>Survey Market Place</h1>
                <p>A decentralized survey marketplace</p>
                <p>
                    <Link href="/">
                        <a>Go home</a>
                    </Link>
                </p>
            </Layout>
            Made with Love at GBC
        </div>
    )
}