import { useEffect } from "react";
import useHttp from "../hooks/use-http";
import CategoryList from "../Components/CategoryList";
import { sendHttpRequest } from "../lib/HttpRequest";

export async function getStaticProps(){
  const {data, error} = await sendHttpRequest("https://opentdb.com/api_category.php");
  return {
    props: {data, error},
    revalidate: 10
  }
}

export default function Home(props) {

    return (
    <div className="w3-container w3-white">
      <div className="w3-center w3-row">
        {props.error && <h3>{props.error.message}</h3>}

        {!props.error && <CategoryList data={props.data}></CategoryList>}
      </div>
      <br />
      <br />
    </div>
  );
}

