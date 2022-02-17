import { useRouter } from "next/router";
import { Fragment } from "react/cjs/react.production.min";
import classes from "./CategoryList.module.css";

const CategoryList = (props) => {

  const router = useRouter();

  const { data } = props;
  return (
    <Fragment>
      <h3>Categories</h3>
      <p>Choose a category and take the quiz!</p>

      {data &&
        data.trivia_categories.map((category) => (
          <div
            className=" w3-col m3 w3-padding"
            key={category.id}
            onClick={() => {
              router.push("/categories/" + category.id);
            }}
          >
            <div
              className={classes.card + " w3-card w3-round w3-white w3-padding"}
            >
              <h4 className="w3-center">
                {category.name.split(":")[1] || category.name.split(":")[0]}
              </h4>
            </div>
          </div>
        ))}
    </Fragment>
  );
};

export default CategoryList;
