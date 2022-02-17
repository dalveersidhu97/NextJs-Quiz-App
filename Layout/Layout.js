import Footer from "./Footer";
import Header from "./Header";

const Layout = (props) => {
  return (
    <div>
      <Header></Header>
      <main>{props.children}<br/><br/></main>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
