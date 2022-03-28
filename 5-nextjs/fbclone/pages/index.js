import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Feed from '../components/Feed';
import Header from '../components/Header';
import Login from '../components/Login';
import Sidebar from '../components/Sidebar';

export default function Home({session}) {

  console.log(session);
  if(!session) return <Login />;

  return (
    <div className="bg-gray-900">
      <Head>
        <title>Facebook</title>
      </Head>

      <Header />

      <main className="flex">
        {/* sidebar */}
        <Sidebar />
        {/* feed */}
        <Feed />
        {/* widgets */}
      </main>
    </div>
  )

}


export async function getServerSideProps(context){
  // Get the user
  const session = await getSession(context);
  return {
    props:{
      session
    }
  }

}